import React, { useState, useEffect } from "react";
import styles from "../Pages/SearchResult.module.css";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

function ProductGrid({ category, query, filters, products }) {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    console.log("Filters:", filters);
    console.log("Category:", category);
    console.log("Query:", query);

    let result = [...products];

    if (category) {
      if (category === 'accessories') {
        // If category is 'accessories', filter by parentCategory
        result = result.filter(product => 
          product.parentCategory && product.parentCategory.toLowerCase() === category.toLowerCase()
        );
      } else {
        // Otherwise, filter by category
        result = result.filter(product => 
          product.category && product.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    if (query) {
      const searchQuery = query.toLowerCase();
      result = result.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchQuery)) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery))
      );
    }

    if (filters?.brand && filters.brand !== "All") {
      result = result.filter(product => 
        product.brand && product.brand === filters.brand
      );
    }

    if (filters?.type) {
      result = result.filter(product =>
        product.type && product.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters?.condition) {
      result = result.filter(product =>
        product.condition && product.condition.toLowerCase() === filters.condition.toLowerCase()
      );
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "az":
          result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case "za":
          result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          break;
        case "priceLow":
          result.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "priceHigh":
          result.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
  }, [category, query, filters, products]);

  return (
    <div className={styles.productGrid}>
      {filteredProducts.length === 0 ? (
        <div className={styles.noResultsMessage}>Không tìm thấy sản phẩm nào.</div>
      ) : (
        filteredProducts.map((product) => (
          <Link to={`/products/${product.category}/${product._id}`} key={product._id} className={styles.productLink}>
            <ProductCard
              image={product.image}
              name={product.name}
              price={product.price ? `$${product.price.toFixed(2)}` : 'N/A'}
              alt={product.alt || product.name}
              styleClass={styles.productCard}
              nameClass={styles.productName}
              priceClass={styles.productPrice}
            />
          </Link>
        ))
      )}
    </div>
  );
}

export default ProductGrid;