import * as React from "react";
import styles from "./AdminPanel.module.css";
import { Link } from "react-router-dom";
import arrowdown from "../assets/icons/arrowdown.svg";

// Navigation Item with icon
const NavItem = ({ title, link }) => {
  return (
    <section className={styles.navItem}>
      <div className={styles.navItemHeader}>
        <Link to={link} className={styles.link}>
          {title}
        </Link>
      </div>
    </section>
  );
};

// Main AdminPanel component
function AdminPanel() {
  return (
    <nav className={styles.adminPanel}>
      <h2 className={styles.panelTitle}>Admin Panel</h2>
      <div className={styles.navList}>
        {/* Admin Dashboard */}
        <NavItem title="Admin Dashboard" link="/admin" />

        {/* Product List */}
        <NavItem title="Product List"link="/admin/products" />

        {/* Add New Product */}
        <NavItem title="Add New Product"link="/admin/products/add" />

        {/* Order List */}
        <NavItem title="Order List"link="/admin/orders" />

        {/* User List */}
        <NavItem title="User List" link="/admin/users" />
      </div>
    </nav>
  );
}

export default AdminPanel;