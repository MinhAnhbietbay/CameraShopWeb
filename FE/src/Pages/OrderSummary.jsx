import React from "react";
import styles from "./ShoppingCart.module.css";

function OrderSummary({ subtotal, handleCheckout }) {
  const shipping = subtotal > 0 ? 10 : 0; // Free shipping logic
  const total = subtotal + shipping;

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
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
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