import React from "react";
import styles from "../Pages/Home.module.css";
import AddToCartButton from "./AddToCartButton";

function ProductCard({
  image,
  name,
  price,
  alt,
  styleClass,
  nameClass,
  priceClass,
}) {
  return (
    <article className={styleClass}>
      <img src={image} alt={alt} className={styles.productImage} />
      <h3 className={nameClass}>{name}</h3>
      <p className={priceClass}>{price}</p>
      <AddToCartButton />
    </article>
  );
}

export default ProductCard;
