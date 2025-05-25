import React, { useState, useEffect } from "react";
import styles from "./AdminDashboard.module.css";
import AdminPanel from "../Components/AdminPanel";
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { orderApi } from '../api';
import { productApi } from '../api';

import productImage from "../assets/images/C90d.jpg";
import total from "../assets/icons/total.svg";
import revenue from "../assets/icons/revenue.svg";
import products from "../assets/icons/products.svg";

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function AdminDashboard() {
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        ordersByStatus: {},
        revenueByMonth: [],
        topProducts: [],
    });

    console.log('AdminDashboard rendering. orderStats.topProducts:', orderStats.topProducts);

    const [tasks, setTasks] = useState([
        { text: "Update product A", starred: false },
        { text: "Update product B", starred: false },
        { text: "Update product C", starred: false },
        { text: "Update product D", starred: false }
    ]);

    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderRes = await orderApi.getOrders();
                console.log('Order API response data (in useEffect):', orderRes.data);
                processOrderData(orderRes.data);

                // Fetch total products
                const productRes = await productApi.getAll();
                setProductCount(productRes.data?.result?.products?.length || 0);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setProductCount(0);
            }
        };
        fetchData();
    }, []);

    const processOrderData = (data) => {
        // Đảm bảo orders là một mảng
        const orders = data?.result?.orders || [];
        if (!Array.isArray(orders)) {
            console.error('Orders data is not an array:', orders);
            return;
        }

        const ordersByStatus = {};
        const revenueByMonth = new Array(12).fill(0);
        const productSales = {};

        orders.forEach(order => {
            // Xử lý trạng thái đơn hàng
            const status = order.status || 'pending';
            ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;

            // Xử lý doanh thu theo tháng
            const month = new Date(order.createdAt).getMonth();
            revenueByMonth[month] += order.total_amount || 0;

            // Xử lý sản phẩm bán chạy
            if (Array.isArray(order.items)) {
                order.items.forEach(item => {
                    // Use product_id directly
                    const productId = item.product_id;
                    if (productId) {
                         productSales[productId] = (productSales[productId] || 0) + (item.quantity || 0);
                    }
                });
            }
        });

        console.log('productSales before calculating topProducts:', productSales);

        // Convert productSales object to an array of { id, quantity } objects
        const topProducts = Object.entries(productSales)
            .map(([id, quantity]) => ({
                id: id, // Product ID
                quantity: quantity // Total quantity sold
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5); // Get top 5

        console.log('Calculated topProducts:', topProducts);

        setOrderStats({
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
            ordersByStatus,
            revenueByMonth,
            topProducts,
        });
        console.log('Order Stats after processing (in processOrderData):', {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
            ordersByStatus,
            revenueByMonth,
            topProducts,
        });
    };

    const toggleStar = (index) => {
        setTasks((prevTasks) =>
            prevTasks.map((task, i) =>
                i === index ? { ...task, starred: !task.starred } : task
            )
        );
    };

    const handleTaskChange = (index, newValue) => {
        setTasks((prevTasks) =>
            prevTasks.map((task, i) =>
                i === index ? { ...task, text: newValue } : task
            )
        );
    };

    // Cấu hình biểu đồ doanh thu theo tháng
    const revenueData = {
        labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
        datasets: [
            {
                label: 'Revenue',
                data: orderStats.revenueByMonth,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    // Cấu hình biểu đồ trạng thái đơn hàng
    const statusData = {
        labels: Object.keys(orderStats.ordersByStatus),
        datasets: [
            {
                data: Object.values(orderStats.ordersByStatus),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                ],
            },
        ],
    };

    // Cấu hình biểu đồ sản phẩm bán chạy
    const topProductsData = {
        labels: Array.isArray(orderStats.topProducts) ? orderStats.topProducts.map((product) => product.id) : [],
        datasets: [
            {
                label: 'Units Sold',
                data: Array.isArray(orderStats.topProducts) ? orderStats.topProducts.map((product) => product.quantity) : [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <div className={styles.adminPanel}>
                    <AdminPanel />
                </div>
                <section className={styles.dashboard}>
                    <h1 className={styles.title}>Admin Dashboard</h1>

                    {/* Business Insights */}
                    <div className={styles.businessInsights}>
                        <div className={styles.insightCard}>
                            <div className={styles.insightContent}>
                                <span>Total Order</span>
                                <h2>{orderStats.totalOrders}</h2>
                            </div>
                            <div className={styles.insightIcon}>
                                <img src={total} alt="Total Order" />
                            </div>
                        </div>
                        <div className={styles.insightCard}>
                            <div className={styles.insightContent}>
                                <span>Total Revenue</span>
                                <h2>${orderStats.totalRevenue.toLocaleString('en-US')}</h2>
                            </div>
                            <div className={styles.insightIcon}>
                                <img src={revenue} alt="Total Revenue" />
                            </div>
                        </div>
                        <div className={styles.insightCard}>
                            <div className={styles.insightContent}>
                                <span>Total Products</span>
                                <h2>{productCount}</h2>
                            </div>
                            <div className={styles.insightIcon}>
                                <img src={products} alt="Total Products" />
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ thống kê */}
                    <div className={styles.chartsSection}>
                        <div className={styles.chartContainer}>
                            <h2>Monthly Revenue</h2>
                            <Line data={revenueData} />
                        </div>
                        <div className={styles.chartContainer}>
                            <h2>Order Status</h2>
                            <Pie data={statusData} />
                        </div>
                        {/* Removed incorrectly placed commented-out Best-Selling Products table */}
                        {/* <div className={styles.chartContainer}> 
                            <h2>Best-Selling Products</h2>
                            <table className={styles.bestSellingTable}> 
                                <thead>
                                    <tr>
                                        <th>Product ID</th> 
                                        <th>Units Sold</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {console.log('Rendering Best-Selling Products table. orderStats.topProducts:', orderStats.topProducts)} 
                                    {Array.isArray(orderStats.topProducts) && orderStats.topProducts.map((product, index) => (
                                        <tr key={index} className={styles.bestSellingTableRow}> 
                                            <td>{product.id}</td> 
                                            <td>{product.quantity}</td> 
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
                    </div>

                    <div className={styles.productsAndTodo}>
                        <div className={styles.productsSection}>
                            {/* Best-Selling Products */}
                            <div className={styles.bestSelling}>
                                <h2>Best-Selling Products</h2>
                                <table className={styles.bestSellingTable}> 
                                    <thead>
                                        <tr>
                                            <th>Product ID</th> 
                                            <th>Units Sold</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* console.log('Rendering Best-Selling Products table. orderStats.topProducts:', orderStats.topProducts) */}
                                        {/* Map through topProducts data - ensure it's an array */}
                                        {Array.isArray(orderStats.topProducts) && orderStats.topProducts.map((product, index) => (
                                            <tr key={index} className={styles.bestSellingTableRow}> 
                                                <td>{product.id}</td> 
                                                <td>{product.quantity}</td> 
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AdminDashboard;
