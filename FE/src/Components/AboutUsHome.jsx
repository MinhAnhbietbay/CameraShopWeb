import React from "react";
import styles from "./AboutUsHome.module.css";

import abhome from "../assets/images/abhome.jpg";

function AboutUsHome() {
  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>ABOUT US</h1>
      <div className={styles.contentWrapper}>
        <div className={styles.textContent}>
          <p className={styles.description}>
            <strong className={styles.bold}>We're camera enthusiasts. </strong>
            <span className={styles.regular}>
              As a trusted curator and reseller of exceptional, high-quality
              gear,
            </span>
            <span className={styles.highlight}> MANH </span>
            <span className={styles.regular}>
              is committed to supporting photographers with expertly graded,
              sustainable, and exchangeable equipment.
            </span>
          </p>
          <button className={styles.ctaButton}>
            <span>MORE ABOUT US</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5ac5d501f8db5b0f5f6dd3d620701bef10cdd4fc"
              alt=""
              className={styles.arrowIcon}
            />
          </button>
        </div>
        <img
          src={abhome}
          alt=""
          className={styles.featureImage}
        />
      </div>
    </section>
  );
}

export default AboutUsHome;
