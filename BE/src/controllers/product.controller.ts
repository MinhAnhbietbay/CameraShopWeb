import { Request, Response } from 'express'
import productService from '~/services/product.services'
import fs from 'fs'
import path from 'path'

export const addController = async (req: Request, res: Response) => {
    try {
        // 1. Ảnh chính
        if (!req.files || !("image" in req.files)) {
            return res.status(400).json({ errors: { image: { msg: 'Image is required' } } });
        }
        const imageFile = (req.files as any)["image"][0];
        const imageUrl = `/uploads/${imageFile.filename}`;

        // 2. Ảnh phụ
        const additionalImages: string[] = [];
        if ("additionalImages" in req.files) {
            ((req.files as any)["additionalImages"] as Express.Multer.File[]).forEach(file => {
                additionalImages.push(`/uploads/${file.filename}`);
            });
        }

        // 3. Features (có ảnh)
        let features: any[] = [];
        if (req.body.features) {
            // Nếu FE gửi dạng JSON string
            if (typeof req.body.features === 'string') {
                features = JSON.parse(req.body.features);
            } else {
                features = req.body.features;
            }
            // Gán ảnh cho từng feature nếu có
            features = features.map((feature: any, idx: number) => {
                const key = `features[${idx}][image]`;
                if (req.files && key in req.files) {
                    feature.image = `/uploads/${(req.files as any)[key][0].filename}`;
                }
                return feature;
            });
        }

        // 4. Tạo object sản phẩm
        const productData = {
            ...req.body,
            sold: 0,
            image: imageUrl,
            additionalImages,
            features,
            createdAt: new Date(),
            updatedAt: new Date(),
            type: req.body.type
        };

        const result = await productService.addProduct(productData);
        res.json({
            message: 'Product added successfully',
            result
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            message: 'Error adding product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

//gộp
// export const getProductsController = async (req: Request, res: Response) => {
//     const page = Number(req.query.page) || 1
//     const pageSize = Number(req.query.pageSize) || 10
//     const result = await productService.getProducts(page, pageSize)
//     res.json({
//         message: 'Products fetched successfully',
//         result
//     })
//     return
// }

export const getProductByIdController = async (req: Request, res: Response) => {
    const { product_id } = req.params
    const result = await productService.getProductById(product_id)
    res.json({
        message: 'Product fetched successfully',
        result
    })
    return
}

//gộp
// export const searchProductController = async (req: Request, res: Response) => {
//     const { query } = req.body
//     const page = Number(req.query.page) || 1
//     const pageSize = Number(req.query.pageSize) || 10
//     const result = await productService.searchProduct(query, page, pageSize)
//     res.json({
//         message: 'Product fetched successfully',
//         result
//     })
//     return
// }

export const deleteProductController = async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params

        // Lấy thông tin sản phẩm trước khi xóa để có đường dẫn ảnh
        const product = await productService.getProductById(product_id)
        if (!product) {
            res.status(404).json({
                message: 'Product not found'
            })
            return
        }

        // Xóa ảnh từ thư mục uploads
        const imagePath = path.join(__dirname, '../../../FE/public', product.image)

        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath)
            } catch (err) {
                console.error('Error deleting file:', err)
            }
        }

        // Xóa sản phẩm từ database
        const result = await productService.deleteProduct(product_id)
        res.json({
            message: 'Product deleted successfully',
            result
        })
    } catch (error) {
        console.error('Error deleting product:', error)
        res.status(500).json({
            message: 'Error deleting product',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

export const updateProductController = async (req: Request, res: Response) => {
    try {
        const { product_id } = req.params

        // Lấy thông tin sản phẩm hiện tại
        const currentProduct = await productService.getProductById(product_id)
        if (!currentProduct) {
            res.status(404).json({
                message: 'Product not found'
            })
            return
        }

        // Tạo object product với dữ liệu từ request
        const productData = {
            ...req.body,
            updatedAt: new Date()
        }

        // Nếu có ảnh mới được upload
        if (req.file) {
            // Xóa ảnh cũ
            const oldImagePath = path.join(__dirname, '../../../FE/public', currentProduct.image)
            if (fs.existsSync(oldImagePath)) {
                try {
                    fs.unlinkSync(oldImagePath)
                    console.log('Old image deleted successfully')
                } catch (err) {
                    console.error('Error deleting old image:', err)
                }
            }

            // Lấy đường dẫn ảnh mới
            const imageUrl = `/uploads/${req.file.filename}`
            productData.image = imageUrl
        }

        const result = await productService.updateProduct(product_id, productData)
        res.json({
            message: 'Product updated successfully',
            result
        })
    } catch (error) {
        console.error('Error updating product:', error)
        res.status(500).json({
            message: 'Error updating product',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

export const getProductsWithSearchAndSortController = async (req: Request, res: Response) => {
    const { query = '', page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'asc' } = req.query

    // Xử lý trường hợp lấy sản phẩm ngẫu nhiên
    if (sortBy === 'random') {
        const result = await productService.getRandomProducts(Number(pageSize))
        res.json({
            message: 'Random products fetched successfully',
            result: { products: result, pagination: { total: result.length, totalPages: 1 } }
        })
        return
    }

    // Kiểm tra và xử lý tham số sortBy
    const validSortFields = ['name', 'price', 'createdAt', 'sold']
    const finalSortBy = validSortFields.includes(sortBy as string) ? sortBy : 'name'

    const result = await productService.getProductsWithSearchAndSort(
        query as string,
        Number(page),
        Number(pageSize),
        finalSortBy as string,
        sortOrder as 'asc' | 'desc'
    )
    res.json({
        message: 'Products fetched successfully',
        result
    })
    return
}
