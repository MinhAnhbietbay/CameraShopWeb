import React from "react";
import {Link} from "react-router-dom";
import styles from "./Home.module.css";

import image1 from "../assets/images/C90d.jpg";
import image2 from "../assets/images/IPX17.jpg";
import image3 from "../assets/images/lenss.jpg";
import image4 from "../assets/images/CA40024105K.jpg";
import image5 from "../assets/images/MI3404_1.jpg";
import image6 from "../assets/images/li.jpg";
import image7 from "../assets/images/IDS032GN3IN.jpg";
import image8 from "../assets/images/SGBFSL.jpg";

function CategoryGrid() {

    const CategoryCard = ({ image, name, styleClass, nameClass, link }) => {
      return (
        <Link to={link} className={styleClass}>
          <img src={image} alt={name} className={styles.imageClass} />
          <h3 className={nameClass}>{name}</h3>
        </Link>
      );
    };

  const categories = [
    {
      id: 1,
      image: image1,
      name: "Digital Camera",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/products/digital-camera",
    },
    {
      id: 2,
      image: image2,
      name: "Film Camera",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/products/film-camera",
    },
    {
      id: 3,
      image: image3,
      name: "Lenses",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/products/lenses",
    },
    {
      id: 4,
      image: image4,
      name: "Video Camera",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/products/video-cameras",
    },
    {
      id: 5,
      image: image5,
      name: "Accessories",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/products/accessories",
    },
    {
      id: 6,
      image: image6,
      name: "Lighting & Studio",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/products/lighting-studio",
    },
    {
      id: 7,
      image: image7,
      name: "Storage & Editing",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/products/storage-editing",
    },
    {
      id: 8,
      image: image8,
      name: "Used Cameras",
      styleClass: styles.div28,
      nameClass: styles.div29,
      link: "/used/used-cameras",
    },
  ];

  return (
    <section className={styles.div25}>
      <h2 className={styles.div26}>SHOP BY TOP CATEGORIES</h2>
      <div className={styles.div27}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            image={category.image}
            name={category.name}
            styleClass={category.styleClass}
            nameClass={category.nameClass}
            link={category.link}
          />
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
