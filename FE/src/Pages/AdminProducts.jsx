import React, { useState } from "react";
import styles from "./AdminProducts.module.css";
import AdminPanel from "../Components/AdminPanel";

import image1 from "../assets/images/C90d.jpg";
import image2 from "../assets/images/Sa7.png";
import edit from "../assets/icons/edit.svg";
import deleteIcon from "../assets/icons/deleteIcon.svg";

function IconButton({ className, icon, onClick, ariaLabel }) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      <img src={icon} alt={ariaLabel} className={styles.icon} />
    </button>
  );
}

function ProductRow({ product, onDelete }) {
  return (
    <article className={styles.tableRow}>
      <div className={styles.cellId}>{product.id}</div>
      <div className={styles.cellImage}>
        <img src={product.image} alt={product.name} className={styles.img} />
      </div>
      <div className={styles.cellName}>{product.name}</div>
      <div className={styles.cellCategory}>{product.category}</div>
      <div className={styles.cellPrice}>{product.price}</div>
      <div className={styles.cellStock}>{product.stock}</div>
      <div className={styles.cellAction}>
        <IconButton
          className={styles.actionButton}
          icon={edit}
          ariaLabel="Edit product"
        />
        <IconButton
          className={styles.deleteButton}
          icon={deleteIcon}
          ariaLabel="Delete product"
          onClick={() => onDelete(product.id)}
        />
      </div>
    </article>
  );
}

function ProductTable() {
  const [products, setProducts] = useState([
    { id: 1, name: "Canon EOS 90D (Body Only)", category: "Digital Camera", price: "$690.00", stock: 63, image: image1 },
    { id: 2, name: "Canon EOS 90D (Body Only)", category: "Digital Camera", price: "$690.00", stock: 63, image: image2 },
    { id: 3, name: "Canon EOS 90D (Body Only)", category: "Digital Camera", price: "$690.00", stock: 63, image: image1 },
    { id: 4, name: "Canon EOS 90D (Body Only)", category: "Digital Camera", price: "$690.00", stock: 63, image: image1 },
    { id: 5, name: "Canon EOS 90D (Body Only)", category: "Digital Camera", price: "$690.00", stock: 63, image: image1 },
    { id: 6, name: "Canon EOS 90D (Body Only)", category: "Digital Camera", price: "$690.00", stock: 63, image: image1 },
    { id: 7, name: "Canon EOS 90D (Body Only)", category: "Digital Camera", price: "$690.00", stock: 63, image: image1 },
  ]);

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <section className={styles.tableContainer}>
      <header className={styles.tableHeader}>
        <div>ID</div>
        <div>Image</div>
        <div>Product Name</div>
        <div>Category</div>
        <div>Price</div>
        <div>Stock</div>
        <div>Action</div>
      </header>
      {products.map((product) => (
        <ProductRow 
          key={product.id} 
          product={product} 
          onDelete={handleDeleteProduct}
        />
      ))}
    </section>
  );
}

function AdminProducts() {
  return (
    <main className={styles.prContainer}>
      <div style={{ display: 'flex' }}>
        <AdminPanel />
        <section className={styles.table}>
          <h1 className={styles.adminProducts}>Products List</h1>
          <ProductTable />
        </section>
      </div>
    </main>
  );
}

export default AdminProducts;