import { Router } from 'express'
import {
    addProductToCartController,
    deleteProductFromCartController,
    getCartController,
    updateProductInCartController
} from '~/controllers/cart.controller'
import { wrapRequestHandler } from '~/utils/handlers'
import { addToCartValidator, updateCartValidator } from '~/middlewares/cart.middlewares'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
const cartRouter = Router()

/**
 * Description: Add product to cart
 * Path: /add-to-cart
 * Method: POST
 * Body: { product_id: string, quantity: number }
 */
cartRouter.post(
    '/add-to-cart',
    accessTokenValidator,
    addToCartValidator,
    wrapRequestHandler(addProductToCartController)
)

/**
 * Description: Get cart
 * Path: /cart-list
 * Method: GET
 * Query: { page: number, pageSize: number }
 */
cartRouter.get('/cart-list', accessTokenValidator, wrapRequestHandler(getCartController))

/**
 * Description: Delete product from cart
 * Path: /delete-product/:product_id
 * Method: DELETE
 */
cartRouter.delete(
    '/delete-product/:product_id',
    accessTokenValidator,
    wrapRequestHandler(deleteProductFromCartController)
)

/**
 * Description: Update product in cart
 * Path: /update-product/:product_id
 * Method: PUT
 * Body: { quantity: number }
 */
cartRouter.put(
    '/update-product/:product_id',
    accessTokenValidator,
    updateCartValidator,
    wrapRequestHandler(updateProductInCartController)
)

export default cartRouter
