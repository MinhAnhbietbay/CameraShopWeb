import { Router } from 'express'
import {
    createOrderController,
    getOrderListController,
    getOrderListByUserIdController,
    updateOrderStatusController,
    deleteOrderController
} from '~/controllers/order.controller'
import { accessTokenValidator, authorizeadmin } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const orderRouter = Router()

/**
 * Description: Create order
 * Path: /create-order
 * Method: GET
 */
orderRouter.get('/create-order', accessTokenValidator, wrapRequestHandler(createOrderController))

/**
 * Description: Get order list (Admin)
 * Path: /order-list
 * Method: GET
 * Query: { page: number, pageSize: number }
 */
orderRouter.get('/order-list', accessTokenValidator, authorizeadmin, wrapRequestHandler(getOrderListController))

/**
 * Description: Get order by user_id
 * Path: /order-list/:user_id
 * Method: GET
 * Query: { page: number, pageSize: number }
 */
orderRouter.get('/order-list/:user_id', accessTokenValidator, wrapRequestHandler(getOrderListByUserIdController))

/**
 * Description: Update order status (Admin)
 * Path: /order-list/:order_id
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
