import React from "react";
import styles from "./ShoppingCart.module.css";

function OrderSummary({ subtotal, handleCheckout }) {
  const shipping = 0; // Always free
  const total = subtotal;

  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>
      <div className={styles.summaryDetails}>
        <div className={styles.summaryItem}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button className={styles.checkoutButton} onClick={handleCheckout}>
        CHECKOUT
      </button>
    </div>
  );
}

export default OrderSummary;