import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import styles from "./ShoppingCart.module.css";
import { cartApi } from "../api";


// Component QuantitySelector
function QuantitySelector({ quantity, onQuantityChange, max }) {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      onQuantityChange(1);
      return;
    }
    value = Math.max(1, Math.min(Number(value), max));
    onQuantityChange(value);
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
      <input
        type="number"
        className={styles.quantityInput}
        value={quantity}
        min={1}
        max={max}
        onChange={handleInputChange}
        style={{ width: 50, textAlign: "center" }}
      />
      <button
        className={styles.quantityButton}
        onClick={increaseQuantity}
        aria-label="Increase quantity"
        disabled={quantity >= max}
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
          <img src={product.image} alt={product.name} className={styles.productImage} />
        </div>
        <div className={styles.productName}>{product.name}</div>
      </div>
      <div className={styles.productPrice}>${Number(product.price).toFixed(2)}</div>
      <QuantitySelector
        quantity={product.quantity}
        onQuantityChange={(newQty) => updateQuantity(product._id, newQty, product.count_in_stock)}
        max={product.count_in_stock || 99}
      />
      <div className={styles.productTotalPrice}>
        ${(product.price * product.quantity).toFixed(2)}
      </div>
      <button className={styles.removeButton} onClick={() => onRemove(product._id)}>
        Remove
      </button>
    </div>
  );
}

// ShoppingCart Component
function ShoppingCart() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await cartApi.getCart();
        // Nếu BE trả về items là [{product_id, quantity, product: {...}}]
        setProducts(
          (res.data.result.items || []).map(item => ({
            ...(item.product || {}),
            quantity: item.quantity,
            _id: item.product_id || (item.product && item.product._id),
            price: item.product?.price || 0,
            image: item.product?.image || ""
          }))
        );
      } catch (err) {
        setProducts([]);
      }
    }
    fetchCart();
  }, []);

  const handleRemoveProduct = (productId) => {
    const newProducts = products.filter((product) => product._id !== productId);
    setProducts(newProducts);
    localStorage.setItem('cart', JSON.stringify(newProducts));
  };

  const updateQuantity = (productId, newQuantity, max) => {
    const updatedProducts = products.map((product) =>
      product._id === productId
        ? { ...product, quantity: Math.max(1, Math.min(newQuantity, product.count_in_stock || max || 99)) }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));
  };

  const navigate = useNavigate();

  const subtotal = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", { state: { products, subtotal } });
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
                key={product._id}
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