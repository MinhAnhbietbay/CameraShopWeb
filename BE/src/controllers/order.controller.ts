import { Request, Response } from 'express'
import orderService from '~/services/order.services'

export const createOrderController = async (req: Request, res: Response) => {
    try {
        const user_id = req.decoded_authorization?.user_id as string
        console.log('==> Nhận request tạo order cho user:', user_id)
        const result = await orderService.createOrder(user_id)
        res.json({
            message: 'Order created successfully',
            result
        })
    } catch (err) {
        console.error('Lỗi khi tạo order:', err)
        res.status(500).json({ message: 'Lỗi khi tạo order', error: typeof err === 'object' && err && 'message' in err ? (err as any).message : String(err) })
    }
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

export const getMyOrdersForUserController = async (req: Request, res: Response) => {
    const user_id = req.decoded_authorization?.user_id as string;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    try {
        const result = await orderService.getOrderListByUserId(user_id, page, pageSize);
        res.json({
            message: 'User orders fetched successfully',
            result
        });
    } catch (error) {
         console.error('Error fetching user orders:', error);
         res.status(500).json({ message: 'Failed to fetch user orders' });
    }
}

export const getOrderListByUserIdController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    if (!user_id) {
        res.status(400).json({ message: 'User ID param is required for this route.' });
        return;
    }
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    try {
        const result = await orderService.getOrderListByUserId(user_id, page, pageSize);
        res.json({
            message: 'Order list by User ID fetched successfully',
            result
        });
    } catch (error) {
         console.error('Error fetching orders by user ID:', error);
         res.status(500).json({ message: 'Failed to fetch orders by user ID' });
    }
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
