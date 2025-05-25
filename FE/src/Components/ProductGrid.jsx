import React, { useState, useEffect } from "react";
import styles from "../Pages/SearchResult.module.css";
import AddToCartButton from "./AddToCartButton";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

function ProductGrid({ category, query, filters, products }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    let result = [...products];

    if (category) {
      result = result.filter(product =>
        product.category && product.category.toLowerCase() === category.toLowerCase()
      );
      if (filters?.type) {
        result = result.filter(product =>
          product.type && product.type.toLowerCase() === filters.type.toLowerCase()
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
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  }, [category, query, filters, products]);

  // Phân trang
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const ProductCard = ({ product }) => (
    <article className={styles.productCard}>
      <img
        src={product.image || (product.images && product.images[0]) || "https://via.placeholder.com/200"}
        alt={product.name}
        className={styles.productImage}
        onClick={() => navigate(`/products/${product.category}/${product._id}`)}
        style={{ cursor: "pointer" }}
      />
      <h3 className={styles.productName}>{product.name}</h3>
      <p className={styles.productPrice}>{product.price ? `$${product.price.toLocaleString()}` : "N/A"}</p>
      <AddToCartButton product={product} />
    </article>
  );

  return (
    <div>
      <div className={styles.productGrid}>
        {currentProducts.length === 0 ? (
          <div className={styles.noResultsMessage}>Không tìm thấy sản phẩm nào.</div>
        ) : (
          currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
      {/* Thanh chuyển trang */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

export default ProductGrid;