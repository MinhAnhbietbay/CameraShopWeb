import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./Checkout.module.css";

function Checkout() {
  const location = useLocation();
  const { products, subtotal } = location.state || { products: [], subtotal: 0 }; // Lấy dữ liệu từ state

  const shipping = subtotal > 150 ? 0 : 10; // Free shipping logic
  const total = subtotal + shipping;

  return (
    <main className={styles.checkoutContainer}>
      <h2>CHECKOUT</h2>

      {/* Delivery Address */}
      <section className={styles.deliveryAddress}>
        <h2>Delivery Address</h2>
        <p>Pham Minh Anh (+84) 942361234</p>
        <p>123 Hoan Kiem Street, Hoan Kiem District, Hanoi, Vietnam</p>
        <a href="/change-address" className={styles.changeAddressLink}>
          Change Address
        </a>
      </section>

      {/* Products Ordered */}
      <section className={styles.productsOrdered}>
        <h2>Products Ordered</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <div className={styles.productDetails}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <div>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                </div>
              </div>
              <div className={styles.productQuantity}>{product.quantity}</div>
              <div className={styles.productTotalPrice}>
                ${(product.price * product.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className={styles.orderSummary}>
        <h2>Order Summary</h2>
        <div className={styles.summaryDetails}>
          <div className={styles.summaryItem}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className={styles.summaryTotal}>
            <div className={styles.orderTotalLabel}>Order Total</div>
            <div className={styles.orderTotalAmount}>${total.toFixed(2)}</div>
          </div>
        </div>
        <button className={styles.placeOrderButton}>PLACE ORDER</button>
      </section>
    </main>
  );
}

export default Checkout;