import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import cartService from '~/services/cart.services'

export const addProductToCartController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id
    const { product_id, quantity } = req.body
    const result = await cartService.addProductToCart(new ObjectId(user_id), product_id, quantity)
    res.json({
        message: 'Product added to cart successfully',
        result
    })
    return
}

export const getCartController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const result = await cartService.getCart(new ObjectId(user_id), page, pageSize)
    res.json({
        message: 'Cart retrieved successfully',
        result
    })
    return
}

export const deleteProductFromCartController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id
    const product_id = req.params.product_id
    const result = await cartService.deleteProductFromCart(new ObjectId(user_id), new ObjectId(product_id))
    res.json({
        message: 'Product deleted from cart successfully',
        result
    })
    return
}

export const updateProductInCartController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id
    const product_id = req.params.product_id
    const { quantity } = req.body
    const result = await cartService.updateProductInCart(new ObjectId(user_id), new ObjectId(product_id), quantity)
    res.json({
        message: 'Product updated in cart successfully',
        result
    })
    return
}
