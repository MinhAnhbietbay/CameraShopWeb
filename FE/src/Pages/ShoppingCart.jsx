import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import styles from "./ShoppingCart.module.css";

import image from "../assets/images/Sa7.png";
import image1 from "../assets/images/C90d.jpg";

// Component QuantitySelector
function QuantitySelector({ quantity, onQuantityChange }) {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    onQuantityChange(quantity + 1);
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

// Component ProductItem
function ProductItem({ product, onRemove, updateQuantity }) {
  return (
    <div className={styles.productItem}>
      <div className={styles.productDetails}>
        <div className={styles.productImageContainer}>
          <img src={product.image} alt={product.altText} className={styles.productImage} />
        </div>
        <div className={styles.productName}>{product.name}</div>
      </div>
      <div className={styles.productPrice}>${product.price.toFixed(2)}</div>
      <QuantitySelector
        quantity={product.quantity}
        onQuantityChange={(newQty) => updateQuantity(product.id, newQty)}
      />
      <div className={styles.productTotalPrice}>
        ${(product.price * product.quantity).toFixed(2)}
      </div>
      <button className={styles.removeButton} onClick={() => onRemove(product.id)}>
        Remove
      </button>
    </div>
  );
}

// ShoppingCart Component
function ShoppingCart() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Canon EOS 90D (Body Only)",
      price: 699.99,
      quantity: 1,
      image: image1,
      altText: "Canon Camera",
    },
    {
      id: 4,
      name: "Sony a7 III Mirrorless",
      price: 700,
      quantity: 1,
      image: image,
      altText: "Sony Camera",
    },
  ]);

  const handleRemoveProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setProducts(
      products.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const navigate = useNavigate();

  const subtotal = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", { state: { products, subtotal } }); // Truyền products và subtotal qua state
  };


  return (
    <main className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>SHOPPING CART</h1>
      <section className={styles.cartContent}>
        <div className={styles.productListContainer}>
          <div className={styles.productHeader}>
            <div className={styles.headerItem1}>Product</div>
            <div className={styles.headerItem2}>Unit Price</div>
            <div className={styles.headerItem3}>Quantity</div>
            <div className={styles.headerItem4}>Total Price</div>
            <div className={styles.headerItem5}>Action</div>
          </div>

          {products.length > 0 ? (
            products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onRemove={handleRemoveProduct}
                updateQuantity={updateQuantity}
              />
            ))
          ) : (
            <p className={styles.emptyCartMessage}>Your cart is empty.</p>
          )}
        </div>
        

        <OrderSummary subtotal={subtotal} handleCheckout={handleCheckout} />
      </section>
    </main>
  );
}

export default ShoppingCart;