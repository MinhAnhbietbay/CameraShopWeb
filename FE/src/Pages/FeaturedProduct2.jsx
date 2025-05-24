import React from "react";
import styles from "./Home.module.css";

import image1 from "../assets/images/fji.png";
import DoubleRight from "../assets/images/DoubleRight.png";

function FeaturedProduct2() {
  return (
    <section className={styles.div211}>
      <img
        src={image1}
        alt="Fujifilm GFX100 II"
        className={styles.featuredImage}
      />
      <div className={styles.div221}>
        <h2 className={styles.div231}>
          FUJIFILM GFX100 II <br /> More than full frame
        </h2>
        <p className={styles.div241}>
          GFX100 II continues this tradition by bringing unprecedented high-speed performance, 
          expanded video capabilities, and lightning fast autofocus to a growing list of accolades 
          that professionals everywhere have come to rely on from GFX System cameras.
        </p>
        <button className={styles.button2}>
          <span>DISCOVER</span>
          <img
            src={DoubleRight}
            alt="Double Right Arrow"
            className={styles.buttonIcon}
          />
        </button>
      </div>
    </section>
  );
}

export default FeaturedProduct2;