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

import productImage from "../assets/images/C90d.jpg";
import total from "../assets/icons/total.svg";
import revenue from "../assets/icons/revenue.svg";
import products from "../assets/icons/products.svg";
import deleteIcon from "../assets/icons/deleteIcon.svg";
import star from "../assets/icons/star.svg";

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

    const [tasks, setTasks] = useState([
        { text: "Update product A", starred: false },
        { text: "Update product B", starred: false },
        { text: "Update product C", starred: false },
        { text: "Update product D", starred: false }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await orderApi.getOrders();
                processOrderData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    const processOrderData = (orders) => {
        const ordersByStatus = {};
        const revenueByMonth = new Array(12).fill(0);
        const productSales = {};

        orders.forEach(order => {
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
            const month = new Date(order.createdAt).getMonth();
            revenueByMonth[month] += order.totalAmount;
            order.items.forEach(item => {
                productSales[item.product.name] = (productSales[item.product.name] || 0) + item.quantity;
            });
        });

        const topProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        setOrderStats({
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
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
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
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
        labels: orderStats.topProducts.map(([name]) => name),
        datasets: [
            {
                label: 'Số lượng bán',
                data: orderStats.topProducts.map(([, quantity]) => quantity),
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
                                <h2>{orderStats.totalRevenue.toLocaleString('vi-VN')} VNĐ</h2>
                            </div>
                            <div className={styles.insightIcon}>
                                <img src={revenue} alt="Total Revenue" />
                            </div>
                        </div>
                        <div className={styles.insightCard}>
                            <div className={styles.insightContent}>
                                <span>Total Products</span>
                                <h2>200</h2>
                            </div>
                            <div className={styles.insightIcon}>
                                <img src={products} alt="Total Products" />
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ thống kê */}
                    <div className={styles.chartsSection}>
                        <div className={styles.chartContainer}>
                            <h2>Doanh thu theo tháng</h2>
                            <Line data={revenueData} />
                        </div>
                        <div className={styles.chartContainer}>
                            <h2>Trạng thái đơn hàng</h2>
                            <Pie data={statusData} />
                        </div>
                        <div className={styles.chartContainer}>
                            <h2>Top sản phẩm bán chạy</h2>
                            <Bar data={topProductsData} />
                        </div>
                    </div>

                    <div className={styles.productsAndTodo}>
                        <div className={styles.productsSection}>
                            {/* Best-Selling Products */}
                            <div className={styles.bestSelling}>
                                <h2>Best-Selling Products</h2>
                                <div className={styles.productList}>
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <div key={index} className={styles.productCard}>
                                            <img src={productImage} alt="Product" />
                                            <span>Canon EOS 90D</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recently Orders */}
                            <div className={styles.recentOrders}>
                                <h2>Recent Orders</h2>
                                <div className={styles.productList}>
                                    {[1, 2, 3, 4].map((_, index) => (
                                        <div key={index} className={styles.productCard}>
                                            <img src={productImage} alt="Product" />
                                            <span>Canon EOS 90D</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* To-do List */}
                        <div className={styles.todoList}>
                            <h2>To do list</h2>
                            <a href="#" className={styles.addNew}>
                                Add new
                            </a>
                            <ul>
                                {tasks.map((task, index) => (
                                    <li key={index} className={styles.todoItem}>
                                        <input type="checkbox" />
                                        <input
                                            type="text"
                                            value={task.text}
                                            onChange={(e) => handleTaskChange(index, e.target.value)}
                                            className={styles.taskInput}
                                        />
                                        <button
                                            className={`${styles.iconButton} ${task.starred ? styles.starred : ""}`}
                                            onClick={() => toggleStar(index)}
                                        >
                                            <img src={star} alt="Star" />
                                        </button>
                                        <button className={styles.iconButton}>
                                            <img src={deleteIcon} alt="Delete" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AdminDashboard;
