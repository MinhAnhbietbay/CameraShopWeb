import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import AddToCartButton from "../Components/AddToCartButton";

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/products/${productId}`);
        const data = await res.json();
        setProduct({
          ...data.result,
          features: Array.isArray(data.result.features) ? data.result.features : [],
          additionalImages: Array.isArray(data.result.additionalImages) ? data.result.additionalImages : [],
          specifications: Array.isArray(data.result.specifications) ? data.result.specifications : [],
        });
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div className={styles.productNotFound}><h1>Product not found</h1><p>The product you are looking for does not exist.</p></div>;

  return (
    <article className={styles.productDetails}>
      <header className={styles.header}>
        {Array.isArray(product.additionalImages) && product.additionalImages.length > 0 && (
          <div className={styles.additionalImages}>
            {product.additionalImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} - Additional Image ${index + 1}`}
                className={styles.thumbnail}
              />
            ))}
          </div>
        )}
        <div className={styles.mainImageContainer}>
          <img src={product.image} alt={product.name} className={styles.img} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.price}>${Number(product.price).toFixed(2)}</p>
          <div className={styles.description}>
            {product.description && <div>{product.description}</div>}
            
            <div className={styles.additionalInfo}>
              <AddToCartButton product={product} className={styles.addToCartButton} />
              <p>
                Got any questions? <a href="/contact" className={styles.contactLink}>Contact us</a>
              </p>
              <p>Free Shipping</p>
            </div>
          </div>
          
        </div>
      </header>

      {product.highlightsSummary && (
        <section className={styles.highlight}>
          <h2>Highlights</h2>
          <div>{product.highlightsSummary}</div>
        </section>
      )}

      {Array.isArray(product.features) && product.features.length > 0 && (
        <section className={styles.features}>
          <h2>Features</h2>
          <div className={styles.featureGrid}>
            {product.features.map((feature, index) => (
              <div key={index} className={styles.featureItem}>
                {feature.image && <img src={feature.image} alt={feature.title} className={styles.featureImage} />}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {Array.isArray(product.specifications) && product.specifications.length > 0 && (
        <section className={styles.specifications}>
          <h2>Specifications</h2>
          <ul className={styles.specList}>
            {product.specifications.map((spec, idx) => (
              <li key={idx}><strong>{spec.key}:</strong> {spec.value}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export default ProductDetails;
