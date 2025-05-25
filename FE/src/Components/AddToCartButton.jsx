import React from "react";
import styles from "./AddToCartButton.module.css";
import add from "../assets/icons/add.svg";

function AddToCartButton({ product }) {
  const handleAddToCart = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('You must log in to add products to your cart!');
      // window.location.href = '/login';
      return;
    }
    // Add to cart in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item._id === product._id);
    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  return (
    <button className={styles.button} onClick={handleAddToCart}>
      <img src={add} alt="Add to cart" />
      <span>Add to Cart</span>
    </button>
  );
}

export default AddToCartButton;
