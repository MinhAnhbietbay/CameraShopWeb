import React, { useState } from "react";
import styles from "./ShoppingCart.module.css";

function QuantitySelector({ quantity: initialQuantity = 1 }) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className={styles.quantitySelector}>
      <button
        className={styles.quantityButton}
        onClick={decreaseQuantity}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <div className={styles.quantityValue}>{quantity}</div>
      <button
        className={styles.quantityButton}
        onClick={increaseQuantity}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
