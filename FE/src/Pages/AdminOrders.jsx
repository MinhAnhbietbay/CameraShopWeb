import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminOrders.module.css";
import AdminPanel from "../Components/AdminPanel";

import arrowdown from "../assets/icons/arrowdown.svg";
function OrderRow({ order, onStatusChange }) {
  const [isEditing, setIsEditing] = useState(false); // Trạng thái để kiểm soát hiển thị dropdown

  const handleStatusChange = (e) => {
    onStatusChange(order.id, e.target.value); // Gọi hàm thay đổi trạng thái
    setIsEditing(false);
  };

  return (
    <article className={styles.row}>
      <div className={styles.id}>{order.id}</div>
      <div className={styles.name}>{order.name}</div>
      <div className={styles.address}>{order.address}</div>
      <div className={styles.date}>{order.date}</div>
      <div className={styles.viewOrder}>
        <Link
          to="/checkout"
          state={{ products: order.products, subtotal: order.subtotal }}
          className={styles.viewLink}
        >
          View
        </Link>
      </div>
      <div className={styles.status}>
        {isEditing ? (
          // Hiển thị dropdown khi đang chỉnh sửa
          <select
            value={order.status}
            onChange={handleStatusChange}
            className={styles.statusSelect}
            onBlur={() => setIsEditing(false)} // Ẩn dropdown khi mất focus
          >
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Canceled">Canceled</option>
          </select>
        ) : (
          // Hiển thị badge khi không chỉnh sửa
          <div
            className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}
            onClick={() => setIsEditing(true)} // Hiển thị dropdown khi nhấn vào badge
          >
            {order.status}
            <img src={arrowdown} alt="Arrow Down" className={styles.arrowIcon} />
          </div>
        )}
      </div>
    </article>
  );
}

function OrderTable() {
  const [orders, setOrders] = useState([
    {
      id: "OD0001",
      name: "Anh Minh",
      address: "123 Hoan Kiem, Hanoi",
      date: "02 Feb 2024",
      products: [
        { id: 1, name: "Canon EOS 90D", price: 690, quantity: 1, image: "/path/to/image1.jpg" },
        { id: 2, name: "Sony Alpha a7 III", price: 2000, quantity: 1, image: "/path/to/image2.jpg" },
      ],
      subtotal: 2690,
      status: "Completed",
    },
    {
      id: "OD0002",
      name: "Anh Minh",
      address: "123 Hoan Kiem, Hanoi",
      date: "02 Feb 2024",
      products: [
        { id: 3, name: "Nikon D750", price: 1200, quantity: 1, image: "/path/to/image3.jpg" },
      ],
      subtotal: 1200,
      status: "Processing",
    },
  ]);

  // Hàm xử lý thay đổi trạng thái
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <section className={styles.tableContainer}>
      <header className={styles.tableHeader}>
        <div>ID</div>
        <div>Name</div>
        <div>Address</div>
        <div>Date</div>
        <div>View Order</div>
        <div>Status</div>
      </header>
      <div>
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} />
        ))}
      </div>
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