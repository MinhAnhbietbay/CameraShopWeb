import React from "react";
import styles from "./Home.module.css";
import BestSellers from "../Components/BestSellers";
import FeaturedProduct1 from "./FeaturedProduct1";
import FeaturedProduct2 from "./FeaturedProduct2";
import CategoryGrid from "./CategoryGrid";
import banner from "../assets/images/banner.png";
import NewArrivals from "../Components/NewArrivals";
import AboutUsHome from "../Components/AboutUsHome";

function Home() {
  return (
    <main className={styles.div}>
      <section className={styles.banner}>
        <img src={banner} alt="banner" />
          </section>
      <div className={styles.div2}>
        <BestSellers />
        <NewArrivals />
        <FeaturedProduct1 />
        <FeaturedProduct2 />
        <CategoryGrid />
        <AboutUsHome />
        <hr className={styles.div30} />
      </div>
    </main>
  );
}

export default Home;