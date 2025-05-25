import React, { useState, useEffect } from "react";
import styles from "./AdminProducts.module.css";
import AdminPanel from "../Components/AdminPanel";
import edit from "../assets/icons/edit.svg";
import deleteIcon from "../assets/icons/deleteIcon.svg";
import axios from "axios";

function IconButton({ className, icon, onClick, ariaLabel }) {
  return (
    <button className={className} onClick={onClick} aria-label={ariaLabel}>
      <img src={icon} alt={ariaLabel} className={styles.icon} />
    </button>
  );
}

function SortArrow({ active, order }) {
  if (!active) return null;
  return order === 'asc' ? (
    <svg width="12" height="12" style={{marginLeft: 4}} viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
  ) : (
    <svg width="12" height="12" style={{marginLeft: 4}} viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
  );
}

function ProductRow({ product, index, onDelete }) {
  return (
    <article className={styles.tableRow}>
      <div className={styles.cellIndex}>{index + 1}</div>
      <div className={styles.cellImage}>
        <img src={product.image} alt={product.name} className={styles.img} />
      </div>
      <div className={styles.cellName}>{product.name}</div>
      <div className={styles.cellCategory}>{product.category}</div>
      <div className={styles.cellBrand}>{product.brand}</div>
      <div className={styles.cellPrice}>${product.price?.toLocaleString()}</div>
      <div className={styles.cellStock}>{product.count_in_stock}</div>
      <div className={styles.cellSold}>{product.sold}</div>
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
          onClick={() => onDelete(product._id)}
        />
      </div>
    </article>
  );
}

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/products/products');
        setProducts(res.data.result.products || []);
        // Lấy danh sách danh mục duy nhất
        const cats = Array.from(new Set((res.data.result.products || []).map(p => p.category)));
        setCategories(cats);
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Lọc theo danh mục
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Sắp xếp
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortField === 'stock') {
      return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
    }
    if (sortField === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });

  const handleDeleteProduct = async (productId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:3000/products/${productId}`, {
        headers: {
          "Authorization": "Bearer " + accessToken
        }
      });
      setProducts(products.filter((product) => product._id !== productId));
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      alert("Xóa sản phẩm thất bại!");
      console.error(error);
    }
  };

  // Hàm đổi sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <section className={styles.tableContainer}>
      <div className={styles.tableControls}>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className={styles.categoryDropdown}
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className={styles.sortControls}>
          <span>Sort by:</span>
          <button type="button" onClick={() => handleSort('name')} className={sortField==='name'?styles.activeSort:''}>
            Name <SortArrow active={sortField==='name'} order={sortOrder} />
          </button>
          <button type="button" onClick={() => handleSort('stock')} className={sortField==='stock'?styles.activeSort:''}>
            Stock <SortArrow active={sortField==='stock'} order={sortOrder} />
          </button>
          <button type="button" onClick={() => handleSort('price')} className={sortField==='price'?styles.activeSort:''}>
            Price <SortArrow active={sortField==='price'} order={sortOrder} />
          </button>
        </div>
      </div>
      <header className={styles.tableHeader}>
        <div>No.</div>
        <div>Image</div>
        <div>Product Name</div>
        <div>Category</div>
        <div>Brand</div>
        <div>Price</div>
        <div>Stock</div>
        <div>Total Sold</div>
        <div>Action</div>
      </header>
      {sortedProducts.map((product, idx) => (
        <ProductRow 
          key={product._id} 
          product={product} 
          index={idx}
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