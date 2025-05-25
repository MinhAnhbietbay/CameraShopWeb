import React, { useEffect, useState } from "react";
import styles from "./BestSellers.module.css";
import AddToCartButton from "./AddToCartButton";
import { productApi } from "../api";
import { useNavigate } from "react-router-dom";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll();
        if (response.data && response.data.result && Array.isArray(response.data.result.products)) {
          // Sort theo createdAt giảm dần và lấy 4 sản phẩm mới nhất
          const sorted = response.data.result.products
            .filter(p => p.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
          setProducts(sorted);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const ProductCard = ({ product }) => {
    return (
      <article className={styles.productCard}>
        <img
          src={product.image || (product.images && product.images[0]) || "https://via.placeholder.com/200"}
          alt={product.name}
          className={styles.productImage}
          onClick={() => navigate(`/products/${product.category}/${product._id}`)}
          style={{ cursor: "pointer" }}
        />
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>{product.price ? `$${product.price.toLocaleString()}` : "N/A"}</p>
        <AddToCartButton product={product} />
      </article>
    );
  };

  return (
    <section className={styles.bestSellersSection}>
      <h2 className={styles.bestSellersTitle}>NEW ARRIVALS</h2>
      <div className={styles.bestSellersWrapper}>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;