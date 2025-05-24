import React from "react";
import styles from "./MyOrder.module.css";
import Sidebar from "../Components/Sidebar";
import image1 from "../assets/images/C90d.jpg";
import image2 from "../assets/images/Sa7.png";

// Component hiển thị tổng quan đơn hàng
function OrderSummary({ total, status }) {
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.orderTotal}>
        <h4>ORDER TOTAL</h4>
        <span className={styles.totalPrice}>{total}</span>
      </div>
      <div className={styles.orderStatus}>
        <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

// Component hiển thị chi tiết đơn hàng
function OrderDetails() {
  const orders = [
    {
      id: 1,
      status: "Processing",
      total: "$1399.98",
      products: [
        {
          id: 1,
          image: image1,
          name: "Canon EOS 90D (Body Only)",
          price: "$699.99",
          quantity: 1,
          totalPrice: "$699.99",
        },
        {
          id: 2,
          image: image2,
          name: "Sony a7 III Mirrorless",
          price: "$699.99",
          quantity: 1,
          totalPrice: "$699.99",
        },
      ],
    },
    {
      id: 2,
      status: "Completed",
      total: "$699.99",
      products: [
        {
          id: 3,
          image: image1,
          name: "Canon EOS 90D (Body Only)",
          price: "$699.99",
          quantity: 1,
          totalPrice: "$699.99",
        },
      ],
    },
    {
      id: 3,
      status: "Canceled",
      total: "$0.00",
      products: [],
    },
  ];

  return (
    <div>
      {orders.map((order) => (
        <article key={order.id} className={styles.details}>
          <h3 className={styles.productsOrdered}>Products Ordered</h3>
          <div>
            {order.products.map((product) => (
              <div key={product.id} className={styles.productRow}>
                <div className={styles.productInfo}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <span className={styles.productName}>{product.name}</span>
                </div>
                <div className={styles.productPrice}>{product.price}</div>
                <div className={styles.productQuantity}>{product.quantity}</div>
                <div className={styles.productTotalPrice}>
                  {product.totalPrice}
                </div>
              </div>
            ))}
          </div>
          <OrderSummary total={order.total} status={order.status} />
        </article>
      ))}
    </div>
  );
}

// Component chính hiển thị trang MyOrder
function MyOrder() {
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
          <h2 className={styles.orderTitle}>My Order</h2>

          {/* Order Status Tabs */}
          <div className={styles.orderTabs}>
          <button className={`${styles.tabButton} ${styles.all}`}>All</button>
            <button className={`${styles.tabButton} ${styles.processing}`}>Processing</button>
            <button className={`${styles.tabButton} ${styles.completed}`}>Completed</button>
            <button className={`${styles.tabButton} ${styles.canceled}`}>Canceled</button>
            
          </div>


          {/* Order Details */}
          <OrderDetails />
        </div>
      </div>
    </div>
  );
}

export default MyOrder;