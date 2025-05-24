import { ObjectId } from 'mongodb'

import databaseService from './database.services'
import productService from './product.services'

class OrderService {
    async createOrder(user_id: string) {
        // get cart
        const cart = await databaseService.carts.findOne({ user_id: new ObjectId(user_id) })
        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty')
        }
        // get products
        const products = await databaseService.products
            .find({ _id: { $in: cart.items.map((item) => new ObjectId(item.product_id)) } })
            .toArray()

        if (products.length !== cart.items.length) {
            throw new Error('Some products are not found')
        }

        // Check if products have enough stock
        for (const item of cart.items) {
            const product = products.find((p) => p._id.equals(item.product_id))
            if (!product || product.count_in_stock < item.quantity) {
                throw new Error(`Product ${product?.name} does not have enough stock`)
            }
        }

        // get address
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!user) {
            throw new Error('User is not found')
        }
        const address = user.address
        if (!address) {
            throw new Error('Address is not found')
        }

        // Update product quantities
        for (const item of cart.items) {
            await productService.updateProductQuantity(new ObjectId(item.product_id), item.quantity)
        }

        // create order
        const order = await databaseService.orders.insertOne({
            _id: new ObjectId(),
            user_id: new ObjectId(user_id),
            items: cart.items.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: products.find((product) => product._id.equals(item.product_id))?.price || 0
            })),
            total_amount: cart.items.reduce(
                (acc, item) =>
                    acc + (products.find((product) => product._id.equals(item.product_id))?.price || 0) * item.quantity,
                0
            ),
            status: 'pending',
            payment_status: 'unpaid',
            shipping_address: address,
            phone: user.phone,
            name: user.name,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // delete cart
        await databaseService.carts.deleteOne({ user_id: new ObjectId(user_id) })
        return order
    }

    async getOrderList(page: number = 1, pageSize: number = 10) {
        const skip = (page - 1) * pageSize
        const [orders, total] = await Promise.all([
            databaseService.orders.find({}).skip(skip).limit(pageSize).toArray(),
            databaseService.orders.countDocuments({})
        ])
        return {
            orders,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    }

    async getOrderListByUserId(user_id: string, page: number = 1, pageSize: number = 10) {
        const skip = (page - 1) * pageSize
        const [orders, total] = await Promise.all([
            databaseService.orders
                .find({ user_id: new ObjectId(user_id) })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            databaseService.orders.countDocuments({ user_id: new ObjectId(user_id) })
        ])
        return {
            orders,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    }

    async updateOrderStatus(
        order_id: string,
        status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
        payment_status: 'unpaid' | 'paid'
    ) {
        const order = await databaseService.orders.updateOne(
            { _id: new ObjectId(order_id) },
            { $set: { status, payment_status } }
        )
        return order
    }

    async deleteOrder(order_id: string) {
        const order = await databaseService.orders.deleteOne({ _id: new ObjectId(order_id) })
        return order
    }
}

export default new OrderService()
