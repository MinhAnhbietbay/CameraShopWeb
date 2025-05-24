import { Request, Response } from 'express'
import databaseService from '../services/database.services'
import { ObjectId } from 'mongodb'

export const getOverview = async (req: Request, res: Response) => {
    try {
        // Lấy tổng doanh thu
        const orders = await databaseService.orders.find({}).toArray()
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0)

        // Tính doanh thu theo tháng
        const monthlyRevenue = Array(12).fill(0)
        orders.forEach((order: any) => {
            const month = new Date(order.createdAt).getMonth()
            monthlyRevenue[month] += order.total_amount
        })

        // Lấy tổng số đơn hàng
        const totalOrders = orders.length

        // Lấy tổng số sản phẩm
        const totalProducts = await databaseService.products.countDocuments()

        // Lấy tổng số khách hàng
        const totalUsers = await databaseService.users.countDocuments()

        // Lấy số đơn hàng đang chờ xử lý
        const pendingOrders = await databaseService.orders.countDocuments({ status: 'pending' })

        // Lấy số sản phẩm hết hàng
        const outOfStockProducts = await databaseService.products.countDocuments({ count_in_stock: 0 })

        // Lấy 5 đơn hàng gần đây nhất
        const recentOrders = await databaseService.orders.find({}).sort({ createdAt: -1 }).limit(5).toArray()

        // Lấy 5 sản phẩm bán chạy nhất
        const topSellingProducts = await databaseService.products
            .find({})
            .sort({ sold: -1 })
            .limit(5)
            .project({ name: 1, sold: 1 })
            .toArray()

        res.json({
            result: {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalUsers,
                pendingOrders,
                outOfStockProducts,
                recentOrders,
                topSellingProducts,
                monthlyRevenue
            }
        })
    } catch (error) {
        console.error('Error in getOverview:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
