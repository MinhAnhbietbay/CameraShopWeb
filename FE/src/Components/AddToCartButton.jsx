import React from "react";
import styles from "./AddToCartButton.module.css";
import add from "../assets/icons/add.svg";
import { cartApi } from "../api";

function AddToCartButton({ product }) {
  const handleAddToCart = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('You must log in to add products to your cart!');
      // window.location.href = '/login';
      return;
    }
    try {
      await cartApi.addToCart({ product_id: product._id, quantity: 1 });
      alert('Added to cart!');
      // Optionally: cập nhật lại localStorage cart nếu muốn đồng bộ FE/BE
    } catch (err) {
      alert('Failed to add to cart!');
    }
  };

  return (
    <button className={styles.button} onClick={handleAddToCart}>
      <img src={add} alt="Add to cart" />
      <span>Add to Cart</span>
    </button>
  );
}

export default AddToCartButton;
