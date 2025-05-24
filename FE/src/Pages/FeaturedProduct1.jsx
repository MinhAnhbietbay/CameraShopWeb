import React from "react";
import styles from "./Home.module.css";

import image1 from "../assets/images/lens.jpg";
import DoubleRight from "../assets/images/DoubleRight.png";

function FeaturedProduct1() {
  return (
    <section className={styles.div21}>
      <div className={styles.div22}>
        <h2 className={styles.div23}>
          XF16-55mmF2.8 R LM WR II <br/>Prime Performance, Zoom Versatility
        </h2>
        <p className={styles.div24}>
          FUJINON XF16-55mmF2.8 R LM WR II lens features groundbreaking design
          updates that surpass mere evolutionary progress, plus broader video
          capabilities to help it excel in a wider range of scenarios. Compact
          and lightweight, this zoom fits in the palm of your hand, yet delivers
          image quality to rival a prime lens.
        </p>
        <button className={styles.button2}>
          <span>DISCOVER</span>
          <img
            src={DoubleRight}
          />
        </button>
      </div>
      <img
        src={image1}
      />
    </section>
  );
}

export default FeaturedProduct1;