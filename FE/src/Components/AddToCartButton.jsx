import React from "react";
import styles from "./AddToCartButton.module.css";
import add from "../assets/icons/add.svg";

function AddToCartButton() {
  const handleAddToCart = () => {
    // Add to cart functionality
    console.log("Product added to cart");
  };

  return (
    <button className={styles.button} onClick={handleAddToCart}>
      <img src={add} alt="Add to cart" />
      <span>Add to Cart</span>
    </button>
  );
}

export default AddToCartButton;
