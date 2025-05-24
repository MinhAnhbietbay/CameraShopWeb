import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class CartService {
    async addProductToCart(user_id: ObjectId, product_id: ObjectId, quantity: number = 1) {
        const existingCart = await databaseService.carts.findOne({ user_id })
        if (existingCart) {
            const existingItemIndex = existingCart.items.findIndex(
                (item) => item.product_id.toString() === product_id.toString()
            )
            if (existingItemIndex !== -1) {
                existingCart.items[existingItemIndex].quantity += quantity
            } else {
                existingCart.items.push({
                    product_id,
                    quantity
                })
            }
            const result = await databaseService.carts.updateOne(
                { _id: existingCart._id },
                {
                    $set: {
                        items: existingCart.items,
                        updatedAt: new Date()
                    }
                }
            )
            return result
        } else {
            const cart = {
                _id: new ObjectId(),
                user_id,
                items: [
                    {
                        product_id,
                        quantity
                    }
                ],
                updatedAt: new Date()
            }
            const result = await databaseService.carts.insertOne(cart)
            return result
        }
    }

    async getCart(user_id: ObjectId, page: number = 1, pageSize: number = 10) {
        const cart = await databaseService.carts.findOne({ user_id })
        if (!cart) {
            return {
                items: [],
                pagination: {
                    page,
                    pageSize,
                    total: 0,
                    totalPages: 0
                }
            }
        }

        const skip = (page - 1) * pageSize
        const items = cart.items.slice(skip, skip + pageSize)

        return {
            items,
            pagination: {
                page,
                pageSize,
                total: cart.items.length,
                totalPages: Math.ceil(cart.items.length / pageSize)
            }
        }
    }

    async deleteProductFromCart(user_id: ObjectId, product_id: ObjectId) {
        const cart = await databaseService.carts.findOne({ user_id })
        if (!cart) {
            throw new Error('Cart not found')
        }
        const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === product_id.toString())
        if (itemIndex === -1) {
            throw new Error('Product not found')
        }
        cart.items.splice(itemIndex, 1)
        const result = await databaseService.carts.updateOne(
            { _id: cart._id },
            { $set: { items: cart.items, updatedAt: new Date() } }
        )
        return result
    }

    async updateProductInCart(user_id: ObjectId, product_id: ObjectId, quantity: number) {
        const cart = await databaseService.carts.findOne({ user_id })
        if (!cart) {
            throw new Error('Cart not found')
        }
        const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === product_id.toString())
        if (itemIndex === -1) {
            throw new Error('Product not found')
        }
        cart.items[itemIndex].quantity = quantity
        const result = await databaseService.carts.updateOne(
            { _id: cart._id },
            { $set: { items: cart.items, updatedAt: new Date() } }
        )
        return result
    }
}

export default new CartService()
