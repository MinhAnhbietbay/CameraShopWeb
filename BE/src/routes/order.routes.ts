import { Router } from 'express'
import {
    createOrderController,
    getOrderListController,
    getOrderListByUserIdController,
    getMyOrdersForUserController,
    updateOrderStatusController,
    deleteOrderController
} from '~/controllers/order.controller'
import { accessTokenValidator, authorizeadmin } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const orderRouter = Router()

/**
 * Description: Create order
 * Path: /create-order
 * Method: POST
 */
orderRouter.post('/create-order', accessTokenValidator, wrapRequestHandler(createOrderController))

/**
 * Description: Get ALL orders (Admin only)
 * Path: /order-list
 * Method: GET
 * Query: { page: number, pageSize: number }
 * Middleware: authorizeadmin
 */
orderRouter.get('/order-list', accessTokenValidator, authorizeadmin, wrapRequestHandler(getOrderListController))

/**
 * Description: Get orders by specific user_id (Admin only)
 * Path: /order-list/:user_id
 * Method: GET
 * Query: { page: number, pageSize: number }
 * Middleware: authorizeadmin
 */
orderRouter.get('/order-list/:user_id', accessTokenValidator, authorizeadmin, wrapRequestHandler(getOrderListByUserIdController))

/**
 * Description: Get orders for the authenticated user (Regular User)
 * Path: /my-orders
 * Method: GET
 * Query: { page: number, pageSize: number }
 * Middleware: accessTokenValidator (to get user_id from token)
 */
orderRouter.get('/my-orders', accessTokenValidator, wrapRequestHandler(getMyOrdersForUserController))

/**
 * Description: Update order status (Admin)
 * Path: /:order_id
 * Method: PUT
 */
orderRouter.put('/:order_id', accessTokenValidator, authorizeadmin, wrapRequestHandler(updateOrderStatusController))

/**
 * Description: Delete order (Admin)
 * Path: /delete-order/:order_id
 * Method: DELETE
 */
orderRouter.delete(
    '/delete-order/:order_id',
    accessTokenValidator,
    authorizeadmin,
    wrapRequestHandler(deleteOrderController)
)

export default orderRouter
