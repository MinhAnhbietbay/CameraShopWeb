import React from "react";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";

import arrow from "../assets/icons/arrow.svg";

function NavigationItem({ text, link }) {
    return (
      <Link to={link} className={styles.navItem}> {/* Sử dụng Link để điều hướng */}
        <div className={styles.navItemText}>{text}</div>
        <div>
          <img src={arrow} alt="Arrow" className={styles.arrowIcon} />
        </div>
      </Link>
    );
  }

  function Sidebar() {
    return (
      <>
        <section className={styles.sidebarContainer}>
          <h3 className={styles.sidebarHeader}>Account</h3>
          <nav className={styles.navigationList}>
            <NavigationItem text="My profiles" link="/account" />
            <NavigationItem text="My order" link="/account/order" />
            {/* <NavigationItem text="Change password" link="/account/change-password" /> */}
          </nav>
        </section>
      </>
    );
  }

export default Sidebar;
