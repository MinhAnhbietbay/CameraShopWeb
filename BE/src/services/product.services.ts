import Product from '~/models/schemas/Product.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class ProductService {
    async addProduct(product: Product) {
        // Đảm bảo trường sold luôn là number
        let sold = 0;
        if (typeof product.sold === 'number') {
            sold = product.sold;
        } else if (typeof product.sold === 'string') {
            sold = parseInt(product.sold) || 0;
        }
        const productToInsert = {
            ...product,
            sold
        };
        const result = await databaseService.products.insertOne(productToInsert);
        const product_id = result.insertedId.toString();
        return product_id;
    }

    // async getProducts(page: number = 1, pageSize: number = 10) {
    //     const skip = (page - 1) * pageSize
    //     const [products, total] = await Promise.all([
    //         databaseService.products.find({}).skip(skip).limit(pageSize).toArray(),
    //         databaseService.products.countDocuments({})
    //     ])
    //     return {
    //         products,
    //         pagination: {
    //             page,
    //             pageSize,
    //             total,
    //             totalPages: Math.ceil(total / pageSize)
    //         }
    //     }
    // }

    async getProductById(product_id: string) {
        const product = await databaseService.products.findOne({ _id: new ObjectId(product_id) })
        return product
    }

    // async searchProduct(query: string, page: number = 1, pageSize: number = 10) {
    //     const skip = (page - 1) * pageSize
    //     const [products, total] = await Promise.all([
    //         databaseService.products
    //             .find({ $text: { $search: query } })
    //             .skip(skip)
    //             .limit(pageSize)
    //             .toArray(),
    //         databaseService.products.countDocuments({ $text: { $search: query } })
    //     ])
    //     return {
    //         products,
    //         pagination: {
    //             page,
    //             pageSize,
    //             total,
    //             totalPages: Math.ceil(total / pageSize)
    //         }
    //     }
    // }

    async deleteProduct(product_id: string) {
        const result = await databaseService.products.deleteOne({ _id: new ObjectId(product_id) })
        return result
    }

    async updateProduct(product_id: string, product: Product) {
        const result = await databaseService.products.updateOne({ _id: new ObjectId(product_id) }, { $set: product })
        return result
    }

    async getProductsWithSearchAndSort(
        query: string = '',
        page: number = 1,
        pageSize: number = 10,
        sortBy: string = 'name',
        sortOrder: 'asc' | 'desc' = 'asc'
    ) {
        const skip = (page - 1) * pageSize
        const sortOptions: { [key: string]: 1 | -1 } = {}

        // Xử lý trường hợp sắp xếp theo số lượng đã bán
        if (sortBy === 'sold') {
            sortOptions['sold'] = sortOrder === 'asc' ? 1 : -1
        } else {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1
        }

        const searchQuery = query
            ? {
                  $text: { $search: query }
              }
            : {}

        const [products, total] = await Promise.all([
            databaseService.products.find(searchQuery).sort(sortOptions).skip(skip).limit(pageSize).toArray(),
            databaseService.products.countDocuments(searchQuery)
        ])

        return {
            products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    }

    async getRandomProducts(limit: number) {
        try {
            const products = await databaseService.products.aggregate([{ $sample: { size: limit } }]).toArray()
            return products
        } catch (error) {
            throw new Error('Error getting random products')
        }
    }

    async updateProductQuantity(product_id: ObjectId, quantity: number) {
        try {
            const product = await databaseService.products.findOne({ _id: product_id });
            console.log('updateProductQuantity - product:', product, 'quantity:', quantity);
            if (!product) {
                throw new Error('Product not found');
            }
            if (product.count_in_stock < quantity) {
                throw new Error('Not enough stock');
            }
            const result = await databaseService.products.updateOne(
                { _id: product_id },
                {
                    $inc: {
                        count_in_stock: -quantity,
                        sold: quantity
                    }
                }
            );
            if (result.modifiedCount === 0) {
                throw new Error('Error updating product quantity (no document modified)');
            }
            return result;
        } catch (error) {
            console.error('updateProductQuantity error:', error);
            throw new Error(typeof error === 'object' && error && 'message' in error ? (error as any).message : String(error) || 'Error updating product quantity');
        }
    }
}

const productService = new ProductService()

export default productService
