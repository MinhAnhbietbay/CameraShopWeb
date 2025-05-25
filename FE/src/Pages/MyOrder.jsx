import React, { useState, useEffect } from 'react';
import styles from "./MyOrder.module.css";
import Sidebar from "../Components/Sidebar";
import image1 from "../assets/images/C90d.jpg";
import image2 from "../assets/images/Sa7.png";
import { orderApi } from '../api';

// Define status options for filtering and display text
const STATUS_FILTERS = [
    { value: 'All', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

// Component hiển thị phần tóm tắt tổng tiền và trạng thái đơn hàng
function OrderSummary({ total, status }) {
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.orderTotal}>
        <h4>ORDER TOTAL</h4>
        <span className={styles.totalPrice}>${total?.toFixed(2) || '0.00'}</span>
      </div>
      <div className={styles.orderStatus}>
        <span className={`${styles.status} ${styles[status?.toLowerCase() || '']}`}>
          {status || 'N/A'}
        </span>
      </div>
    </div>
  );
}

// Component hiển thị chi tiết một đơn hàng cụ thể
// Removed OrderDetail component, integrating logic into OrderDetailsList

// Component hiển thị danh sách các đơn hàng đã lọc
function OrderDetailsList({ orders }) {
  if (!orders || orders.length === 0) {
    return <div className={styles.noOrdersMessage}>No orders found</div>;
  }

  // The .orderDetailsContainer can provide padding or margin around the list of order details
  return (
    <div className={styles.orderDetailsContainer}>
      <table className={styles.orderTable}><thead><tr><th>Order ID</th><th>Created At</th><th>Shipping Address</th><th>Total Amount</th><th>Status</th></tr></thead><tbody>{orders.map(order => (<tr key={order._id} className={styles.orderTableRow}><td>{order._id}</td><td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td><td>{order.shipping_address || 'N/A'}</td><td>${order.total_amount?.toFixed(2) || '0.00'}</td><td><span className={`${styles.status} ${styles[order.status?.toLowerCase() || '']}`}>{order.status || 'N/A'}</span></td></tr>))}{/* Close map immediately */}</tbody></table>
    </div>
  );
}

// Component chính hiển thị trang MyOrder
function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  console.log('MyOrder component rendered');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        console.log('Fetching my orders...');
        const response = await orderApi.getMyOrders();
        // console.log('My orders response:', response.data);
        // console.log('My orders items:', response.data?.result?.orders?.[0]?.items);
        
        const ordersData = response.data?.result?.orders || [];
        
        // Sort orders by createdAt in descending order (newest first)
        const sortedOrders = Array.isArray(ordersData)
            ? ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            : [];

        setOrders(sortedOrders);
        // Tính tổng số trang
        setTotalPages(Math.ceil(sortedOrders.length / pageSize) || 1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching my orders:', err);
        setError('Failed to fetch orders');
        setOrders([]);
        setTotalPages(1);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [pageSize]);

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(order => order.status === filterStatus.toLowerCase());

  // Phân trang ở FE
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    setTotalPages(Math.ceil(filteredOrders.length / pageSize) || 1);
    if (page > Math.ceil(filteredOrders.length / pageSize)) setPage(1);
  }, [filteredOrders, pageSize]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Tạm thời hiển thị dữ liệu orders để debug
  // Xóa đoạn này sau khi debug xong
  // return (
  //   <div className={styles.container}>
  //     <h2>Raw Order Data (for debugging)</h2>
  //     <pre>{JSON.stringify(orders, null, 2)}</pre>
  //   </div>
  // );

  // Đoạn mã render giao diện gốc (bỏ comment sau khi debug)
  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <div className={styles.sidebarContainer}>
          <h2 className={styles.sidebarTitle}>Have a good time</h2>
          <Sidebar />
        </div>

        {/* Order Container */}
        <div className={styles.orderContainer}>
          <h2 className={styles.orderTitle}>My Orders</h2>

          {/* Order Status Tabs */}
          <div className={styles.orderTabs}>
            {STATUS_FILTERS.map(status => (
              <button
                key={status.value}
                className={`${styles.tabButton} ${filterStatus === status.value ? styles.activeTab : ''}`}
                onClick={() => setFilterStatus(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Order Details */}
          <OrderDetailsList orders={paginatedOrders} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

// Component Pagination
const Pagination = ({ page, totalPages, onPageChange }) => (
  <div style={{ margin: '16px 0', textAlign: 'center' }}>
    <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</button>
    <span style={{ margin: '0 12px' }}>{page} / {totalPages}</span>
    <button style={{ marginTop: '20px' }} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
  </div>
);

export default MyOrder;