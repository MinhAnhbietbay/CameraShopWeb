import React from "react";
import styles from "./BestSellers.module.css";
import AddToCartButton from "./AddToCartButton";

import image1 from "../assets/images/C90d.jpg";


function BestSellers() {

  const ProductCard = ({
    image,
    name,
    price,
    alt,
    styleClass,
    nameClass,
    priceClass,
  }) => {
    return (
      <article className={styleClass}>
        <img src={image} alt={alt} className={styles.productImage} />
        <h3 className={nameClass}>{name}</h3>
        <p className={priceClass}>{price}</p>
        <AddToCartButton />
      </article>
    );
  };
  const bestSellerProducts = [
    {
      id: 1,
      image: image1,
      name: "Canon EOS 90D",
      price: "$699.99",
      alt: "Canon EOS 90D",
    },
    {
      id: 2,
      image: image1,
      name: "Canon EOS 90D",
      price: "$699.99",
      alt: "Canon EOS 90D",
    },
    {
      id: 3,
      image: image1,
      name: "Canon EOS 90D",
      price: "$699.99",
      alt: "Canon EOS 90D",
    },
    {
      id: 4,
      image: image1,
      name: "Canon EOS 90D",
      price: "$699.99",
      alt: "Canon EOS 90D",
    },
  ];

  return (
    <section className={styles.bestSellersSection}>
      <h2 className={styles.bestSellersTitle}>BEST SELLERS</h2>
      <div className={styles.bestSellersWrapper}>
        <div className={styles.productGrid}>
          {bestSellerProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              alt={product.alt}
              styleClass={styles.productCard}
              nameClass={styles.productName}
              priceClass={styles.productPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellers;