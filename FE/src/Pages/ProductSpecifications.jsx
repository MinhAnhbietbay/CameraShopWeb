import React from "react";
import styles from "./ProductDetails.module.css";

function ProductSpecifications() {
  return (
    <section>
      <div className={styles.div10}>
        <h2>Specifications</h2>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/352c689d63948485dfc2bf30f26dd31f30f8f1c4?placeholderIfAbsent=true&apiKey=a463dcc6a0de423e88f1a3fc61874bde"
          alt="Specifications icon"
          className={styles.img6}
        />
      </div>
      <hr className={styles.div11} />
    </section>
  );
}

export default ProductSpecifications;
