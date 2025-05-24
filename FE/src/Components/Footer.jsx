import React from "react";
import styles from "./Footer.module.css";
import logo from "../assets/icons/logo.svg";
import arrow from "../assets/icons/arrow.svg";

// Logo
const Logo = () => (
  <div className = {styles.logoContainer}>
    <img src = {logo} alt = "LensLogo" 
    className={styles.logo}/>
    <h2 className={styles.brandName}>MANH</h2>
  </div>
);

// Arrow icon for the email submit button
const ArrowIcon = () => (
  <img src = {arrow} atl = "ArrowIcon"/>
);

// Footer header component
const FooterHeader = () => (
  <header className={styles.header}>
    <h1 className={styles.headerTitle}>Bringing vision to life</h1>
  </header>
);


// Email subscription component
const EmailSubscription = () => {
  return (
    <div className={styles.subscriptionContainer}>
      <Logo/>
      <p className={styles.subscriptionText}>
        Sign up for texts and get special offers, product news, exclusive deals,
        and more.
      </p>
      <form className={styles.emailForm}>
        <input type="email" placeholder="Email" className={styles.emailInput} />
        <button type="submit" className={styles.submitButton}>
          <ArrowIcon />
        </button>
      </form>
    </div>
  );
};

// Navigation column component
const NavColumn = ({ title, links }) => (
  <nav className={styles.navColumn}>
    <h3 className={styles.navTitle}>{title}</h3>
    <ul className={styles.navList}>
      {links.map((link, index) => (
        <li key={index} className={styles.navItem}>
          <a 
            href={link.url || "#"} 
            className={styles.navLink}
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

// Footer navigation component
const FooterNavigation = () => {
  const productLinks = [
    { text: "Cameras", url: "/search?category=cameras" },
    { text: "Accessories", url: "/search?category=accessories" },
    { text: "Video Cameras", url: "/search?category=video-cameras" },
    { text: "Lightning & Studio", url: "/search?category=lightning-studio" },
    { text: "Used Cameras", url: "/search?condition=used" },
  ];

  const infoLinks = [
    { text: "Search", url: "/search?category=products" },
    { text: "My Account", url: "#" },
    { text: "Shipping", url: "#" },
    { text: "About us", url: "#" },
    { text: "Term of use", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ];

  const serviceLinks = [
    { text: "Support/ Contact us", url: "#" }
  ];

  return (
    <div className={styles.navigationContainer}>
      <NavColumn title="Products" links={productLinks} />
      <NavColumn title="Additional Information" links={infoLinks} />
      <NavColumn title="Services" links={serviceLinks} />
    </div>
  );
};

// Footer content component
const FooterContent = () => (
  <div className={styles.contentContainer}>
    <div className={styles.topSection}>
      <EmailSubscription />
      <FooterNavigation />
    </div>
    <hr className={styles.divider} />
    <p className={styles.copyright}>MANH Company PTIT Hanoi. Tel: 0123456789</p>
  </div>
);

// Main Footer component
function Footer() {
  return (
    <footer className={styles.footer}>
      <FooterHeader />
      <FooterContent />
    </footer>
  );
}

export default Footer;
