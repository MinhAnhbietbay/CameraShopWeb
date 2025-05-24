import { Request, Response } from 'express'
import orderService from '~/services/order.services'

export const createOrderController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id as string
    const result = await orderService.createOrder(user_id)
    res.json({
        message: 'Order created successfully',
        result
    })
    return
}

export const getOrderListController = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const result = await orderService.getOrderList(page, pageSize)
    res.json({
        message: 'Order list fetched successfully',
        result
    })
    return
}

export const getOrderListByUserIdController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id as string
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 10
    const result = await orderService.getOrderListByUserId(user_id, page, pageSize)
    res.json({
        message: 'Order list fetched successfully',
        result
    })
    return
}

export const updateOrderStatusController = async (req: Request, res: Response) => {
    const order_id = req.params.order_id
    const status = req.body.status
    const payment_status = req.body.payment_status
    const result = await orderService.updateOrderStatus(order_id, status, payment_status)
    res.json({
        message: 'Order status updated successfully',
        result
    })
    return
}

export const deleteOrderController = async (req: Request, res: Response) => {
    const order_id = req.params.order_id
    const result = await orderService.deleteOrder(order_id)
    res.json({
        message: 'Order deleted successfully',
        result
    })
    return
}
