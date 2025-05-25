import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";
import { orderApi, authApi, productApi } from "../api";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, subtotal } = location.state || { products: [], subtotal: 0 };
  const shipping = subtotal > 150 ? 0 : 10;
  const total = subtotal + shipping;

  const [user, setUser] = useState({});
  const [address, setAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setUser(userData);
    setAddress(userData.address || "");
    if (!userData.address) {
      setShowAddressForm(true);
    }
  }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSaveAddress = async () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }
    try {
      await authApi.updateUserInfo({ ...user, address });
      const updatedUser = { ...user, address };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowAddressForm(false);
    } catch (err) {
      alert("Cập nhật địa chỉ thất bại!");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user.address) {
      setShowAddressForm(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const orderData = {
        items: products.map(p => ({ 
          product_id: p._id, 
          quantity: p.quantity, 
          price: p.price 
        })),
        total_amount: total,
        shipping_address: user.address,
        phone: user.phone,
        name: user.name
      };
      const response = await orderApi.createOrder(orderData);
      if (response.data) {
        alert("Đặt hàng thành công!");
        navigate("/account/order");
      }
    } catch (err) {
      alert("Đặt hàng thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      if (typeof productApi !== 'undefined' && typeof productApi.getProducts === 'function') {
        try {
          const productRes = await productApi.getProducts();
          setProductCount(productRes.data.result.products.length);
        } catch (err) {
          setProductCount(0);
        }
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className={styles.checkoutContainer}>
      <h2>CHECKOUT</h2>

      {/* Delivery Address */}
      <section className={styles.deliveryAddress}>
        <h2>Delivery Address</h2>
        {showAddressForm ? (
          <div className={styles.addressForm}>
            <div className={styles.formGroup}>
              <label htmlFor="address">Địa chỉ giao hàng:</label>
              <textarea
                id="address"
                value={address}
                onChange={handleAddressChange}
                placeholder="Nhập địa chỉ giao hàng"
                className={styles.addressInput}
                rows="3"
              />
            </div>
            <div className={styles.formActions}>
              <button 
                onClick={handleSaveAddress} 
                className={styles.saveAddressButton}
              >
                Lưu địa chỉ
              </button>
              <button 
                onClick={() => setShowAddressForm(false)} 
                className={styles.cancelButton}
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.addressInfo}>
            <div className={styles.userInfo}>
              <p className={styles.name}>{user.name}</p>
              <p className={styles.phone}>{user.phone}</p>
            </div>
            <div className={styles.addressDetails}>
              <p className={styles.address}>{user.address}</p>
            </div>
            <button 
              onClick={() => setShowAddressForm(true)} 
              className={styles.changeAddressLink}
            >
              Thay đổi địa chỉ
            </button>
          </div>
        )}
      </section>

      {/* Products Ordered */}
      <section className={styles.productsOrdered}>
        <h2>Products Ordered</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <div key={product._id} className={styles.productItem}>
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
        <button
          className={styles.placeOrderButton}
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "PLACE ORDER"}
        </button>
      </section>
    </main>
  );
}

export default Checkout;