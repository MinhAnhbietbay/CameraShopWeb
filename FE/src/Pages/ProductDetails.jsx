import React from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import { handleAddToCart } from "../Components/CartUtils";

import image1 from "../assets/images/C90d.jpg";
import image11 from "../assets/images/11.jpg";
import image12 from "../assets/images/12.jpg";
import image13 from "../assets/images/13.jpg";
import image14 from "../assets/images/14.jpg";
import image15 from "../assets/images/15.jpg";
import image16 from "../assets/images/16.jpg";
//import image4 from "../assets/images/c90d1.png";
import image17 from "../assets/images/digic.jpg";
import image18 from "../assets/images/anm.png";
import image19 from "../assets/images/sm.jpg";

import image2 from "../assets/images/Cm6.jpg";
import image3 from "../assets/images/Cg7x.jpg";

import AddToCartButton from "../Components/AddToCartButton";

const productDetails = {
  1: {
    name: "Canon EOS 90D (Body Only)",
    price: "$699.99",
    image: image1,
    additionalImages: [
      image11,
      image12,
      image13,
      image14,
      image15,
      image16
    ],
    description: `
      <ul>
        <li>Sensor: APS-C</li>
        <li>ISO Range: 100 - 25,600 (expandable to 100 - 51,200)</li>
        <li>Resolution: 32.5 MP</li>
        <li>Wireless Connectivity: Wi-Fi</li>
        <li>Touchscreen LCD</li>
        <li>Video Recording: 4K</li>
        <li>Continuous Shooting Speed: 10 fps</li>
        <li>Weight: 701g (Body)</li>
      </ul>
    `,
    highlight:
      <p>
        The Canon EOS 90D camera delivers high image quality with a sleek and practical design.
        Featuring a high-resolution 32.5MP APS-C CMOS sensor and 4K/30p video, 1080/120p slow motion,
        the DIGIC 8 image processor, along with an ISO sensitivity range of 100 - 25,600.
        It offers continuous shooting of up to 14 frames per second with autofocus and up to 30fps RAW bursts using the electronic shutter, as well as Dual Pixel AF with Eye Detection."
      </p>
    ,
    features: [
      {
        title: "The DIGIC 8",
        description:
          "The DIGIC 8 image processor delivers high sensitivity and fast shooting performance, making it ideal for both still photography and video applications. The outstanding ISO range of 100-25,600 offers great flexibility and can be easily expanded up to 51,200.",
        image: image17,
      },
      {
        title: "Dual Pixel CMOS AF",
        description:
          "Provides fast, smooth, and accurate autofocus, ideal for capturing moving subjects. In video mode, Movie Servo AF ensures natural focus transitions. The touchscreen LCD allows easy focus control, while subject recognition helps maintain sharp focus.",
        image: image18,
      },
      {
        title: "Eye Detection",
        description:
          "The Canon 90D is also equipped with an optical viewfinder with 100% coverage and face detection capability, enhancing accuracy and framing precision.",
        image: image19,
      },
    ],
  },
  2: {
    name: "Canon EOS M6",
    price: "$499.99",
    image: image2,
    additionalImages: [image11, image12, image13, image14, image15, image16],
    description: `
      <ul>
        <li>Sensor: APS-C</li>
        <li>ISO Range: 100 - 25,600</li>
        <li>Resolution: 24.2 MP</li>
        <li>Wireless Connectivity: Wi-Fi, Bluetooth</li>
        <li>Touchscreen LCD</li>
        <li>Video Recording: Full HD 60fps</li>
        <li>Continuous Shooting Speed: 9 fps</li>
        <li>Weight: 390g (Body)</li>
      </ul>
    `,
    highlight: (
      <p>
        The Canon EOS M6 is a compact mirrorless camera with DSLR-level performance.
        It features a 24.2MP APS-C CMOS sensor and Dual Pixel AF, making it perfect for both photography and video recording.
      </p>
    ),
    features: [
      {
        title: "Dual Pixel CMOS AF",
        description:
          "Smooth and precise autofocus, allowing fast and accurate focusing in both photos and videos.",
        image: image17,
      },
      {
        title: "Compact & Lightweight",
        description:
          "Designed for travelers and content creators, the Canon EOS M6 is lightweight and easy to carry.",
        image: image18,
      },
      {
        title: "Tilting Touchscreen",
        description:
          "The 3.0-inch tilting touchscreen LCD makes it easy to capture selfies and vlogs.",
        image: image19,
      },
    ],
  },
  3: {
    name: "Canon G7X Mark III",
    price: "$749.99",
    image: image3,
    additionalImages: [image11, image12, image13, image14, image15, image16],
    description: `
      <ul>
        <li>Sensor: 1-inch CMOS</li>
        <li>ISO Range: 125 - 12,800</li>
        <li>Resolution: 20.1 MP</li>
        <li>Wireless Connectivity: Wi-Fi, Bluetooth</li>
        <li>Touchscreen LCD</li>
        <li>Video Recording: 4K 30fps</li>
        <li>Continuous Shooting Speed: 20 fps</li>
        <li>Weight: 304g (Body)</li>
      </ul>
    `,
    highlight: (
      <p>
        The Canon G7X Mark III is a premium compact camera with a 1-inch CMOS sensor,
        offering excellent low-light performance and 4K video recording.
        It is ideal for vloggers and content creators.
      </p>
    ),
    features: [
      {
        title: "4K Video Recording",
        description:
          "Shoot stunning 4K videos without cropping, perfect for high-quality content creation.",
        image: image17,
      },
      {
        title: "Live Streaming Capability",
        description:
          "Stream directly to YouTube with built-in live streaming support.",
        image: image18,
      },
      {
        title: "Fast Autofocus & Burst Mode",
        description:
          "Capture action shots with 20fps burst shooting and fast, accurate autofocus.",
        image: image19,
      },
    ],
  },
};

function ProductDetails() {
  const { productId } = useParams();
  const product = productDetails[productId];

  if (!product) {
    return (
      <div className={styles.productNotFound}>
        <h1>Product not found</h1>
        <p>The product you are looking for does not exist.</p>
      </div>
    );
  }

  const addToCart = () => {
    setCartProducts((prevProducts) =>
      handleAddToCart(prevProducts, {
        id: productId,
        name: product.name,
        price: parseFloat(product.price.replace("$", "")),
        image: product.image,
      })
    );
  };

  return (
    <article className={styles.productDetails}>
      <header className={styles.header}>
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
        <div className={styles.mainImageContainer}>
          <img src={product.image} alt={product.name} className={styles.img} />
        </div>
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.price}>{product.price}</p>
          <div className={styles.description}>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            <AddToCartButton productId={productId} className={styles.addToCartButton} />
            <div className={styles.additionalInfo}>
              <p>
                Got any questions? <a href="/contact-us" className={styles.contactLink}>Contact us</a>
              </p>
              <p>Free Shipping</p>
            </div>
          </div>
        </div>

      </header>

      <section className={styles.highlight}>
        <h2>Highlights</h2>
        <div>{product.highlight}</div>
      </section>

      <section className={styles.features}>
        <h2>Features</h2>
        <div className={styles.featureGrid}>
          {product.features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <img src={feature.image} alt={feature.title} className={styles.featureImage} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {productId === "1" && (
        <section className={styles.specifications}>
          <h2>Specifications</h2>
          <ul className={styles.specList}>
            <li><strong>AF Modes:</strong> OVF: One-Shot AF, AI Servo AF, AI Focus AF | Live View: One-Shot AF, Servo AF, AI Focus AF</li>
            <li><strong>AF Point Selection:</strong> Automatic selection, Manual selection</li>
            <li><strong>AF System Points:</strong> OVF: 45 AF Points | Live View: 5,481 selectable focus positions</li>
            <li><strong>Built-in Flash:</strong> YES</li>
            <li><strong>Continuous Shooting Speed:</strong> OVF: 10fps (One-Shot AF & AI Servo AF) | Live View: 11fps (One-Shot AF), 7fps (Servo AF)</li>
            <li><strong>Dimensions:</strong> 140.7 x 104.8 x 76.8 mm</li>
            <li><strong>Effective ISO:</strong> 100 - 25,600 (H:51,200)</li>
            <li><strong>Effective Pixels:</strong> 32.5 MP</li>
            <li><strong>Exposure Compensation:</strong> OVF: ±5 stops in 1/3- or 1/2-stop increments | Live View: ±3 stops in 1/3- or 1/2-stop increments</li>
            <li><strong>Eye Detection AF:</strong> Live View: One-Shot AF & Servo AF</li>
            <li><strong>Flash Modes:</strong> E-TTL II Autoflash, FE Lock, Manual pop-up, Retractable, Built-in</li>
            <li><strong>Image Resolution:</strong> 6960 x 4640 (L), 4800 x 3200 (M), 3472 x 2320 (S1), 2400 x 1600 (S2), 6960 x 4640 (RAW/C-RAW)</li>
            <li><strong>LCD Monitor:</strong> 3.0-inch, 1,040,000 dots</li>
            <li><strong>Processor Type:</strong> DIGIC 8</li>
            <li><strong>Sensor Size:</strong> APS-C</li>
            <li><strong>Shutter Speed Range:</strong> OVF: 30 - 1/8000, Bulb | Live View: 30 – 1/16000</li>
            <li><strong>Weight:</strong> 701g (Including battery and memory card)</li>
            <li><strong>White Balance:</strong> Auto, Preset (Daylight, Shade, Cloudy, Tungsten light, etc.)</li>
          </ul>
        </section>
      )}
    </article>
  );
}

export default ProductDetails;
