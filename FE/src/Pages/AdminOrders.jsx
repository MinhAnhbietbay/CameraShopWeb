import React, { useState, useEffect } from "react";
import styles from "./AdminOrders.module.css";
import AdminPanel from "../Components/AdminPanel";
import { orderApi } from "../api";
import sortIcon from "../assets/icons/sortIcon.svg";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled"
];

function OrderDetail({ order, onClose }) {
  return (
    <div className={styles.orderDetailModal}>
      <div className={styles.orderDetailContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Order Detail</h2>
        <div><b>Customer:</b> {order.name}</div>
        <div><b>Phone:</b> {order.phone}</div>
        <div><b>Address:</b> {order.shipping_address}</div>
        <div><b>Status:</b> {order.status}</div>
        <div><b>Total:</b> ${order.total_amount?.toLocaleString()}</div>
        <div><b>Created At:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
        {order.status === 'delivered' && (
          <div><b>Delivered At:</b> {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : ''}</div>
        )}
        <h3>Products</h3>
        <div className={styles.productList}>
          {order.items?.map((item, idx) => (
            <div key={idx} className={styles.productRow}>
              <span>{item.product?.name || item.product_id}</span>
              <span>Qty: {item.quantity}</span>
              <span>Price: ${item.price?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusDropdown({ value, onChange }) {
  return (
    <select
      className={styles.statusDropdown}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {STATUS_OPTIONS.map(opt => (
        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
      ))}
    </select>
  );
}

function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getOrders({ page, pageSize });
        const ordersData = response.data?.result?.orders || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setTotalPages(response.data?.result?.pagination?.totalPages || 1);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setOrders([]);
        setLoading(false);
        setTotalPages(1);
      }
    };
    fetchOrders();
  }, [page, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      const dateA = new Date(a[sortField] || a.createdAt);
      const dateB = new Date(b[sortField] || b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortField === 'status') {
      return sortOrder === 'asc'
        ? (a.status || '').localeCompare(b.status || '')
        : (b.status || '').localeCompare(a.status || '');
    }
    return 0;
  });

  const Pagination = ({ page, totalPages, onPageChange }) => (
    <div style={{ margin: '16px 0', textAlign: 'center' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</button>
      <span style={{ margin: '0 12px' }}>{page} / {totalPages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!orders || orders.length === 0) return <div>No orders found</div>;

  return (
    <section className={styles.tableContainer}>
      <header className={styles.tableHeader}>
        <div onClick={() => handleSort('createdAt')} className={styles.sortable}>
          Created At <img src={sortIcon} alt="sort" className={styles.sortIcon} />
        </div>
        <div>Customer Name</div>
        <div>Total Amount</div>
        <div onClick={() => handleSort('status')} className={styles.sortable}>
          Status <img src={sortIcon} alt="sort" className={styles.sortIcon} />
        </div>
        <div>Delivered At</div>
      </header>
      <div>
        {sortedOrders.map((order) => (
          <div
            key={order._id}
            className={styles.tableRow}
            onClick={e => { if (e.target.tagName !== 'SELECT') setSelectedOrder(order); }}
            style={{ cursor: 'pointer' }}
          >
            <div>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
            <div>{order.name}</div>
            <div>${order.total_amount?.toLocaleString()}</div>
            <div>
              <StatusDropdown value={order.status} onChange={status => handleStatusChange(order._id, status)} />
            </div>
            <div>{order.status === 'delivered' ? (order.updatedAt ? new Date(order.updatedAt).toLocaleString() : '') : ''}</div>
          </div>
        ))}
      </div>
      {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}

function AdminOrders() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <AdminPanel />
        <section className={styles.tableSection}>
          <h1 className={styles.title}>Orders List</h1>
          <OrderTable />
        </section>
      </div>
    </main>
  );
}

export default AdminOrders;