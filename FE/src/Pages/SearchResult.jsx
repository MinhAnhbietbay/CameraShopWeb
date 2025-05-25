import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./SearchResult.module.css";
import FilterBar from "../Components/FilterBar";
import ProductGrid from "../Components/ProductGrid";
import DoubleRight from "../assets/images/DoubleRight.png";
import { productApi } from "../api";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const category = queryParams.get("category");
  const type = queryParams.get("type");
  const condition = queryParams.get("condition");
  const brand = queryParams.get("brand");

  const [filters, setFilters] = useState({ 
    brand: brand || "All", 
    sortBy: "default",
    type: type || "",
    condition: condition || ""
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          query: query,
          category: category,
          type: type,
          condition: condition,
          ...filters,
          page,
          pageSize
        };
        if (filters.brand === "All") {
          delete params.brand;
        }
        const response = await productApi.getAll(params);
        if (response.data && response.data.result && Array.isArray(response.data.result.products)) {
          // Sort products by createdAt in descending order (newest first)
          const sortedProducts = response.data.result.products.sort((a, b) => {
            // Handle cases where createdAt might be missing or null
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0; // Use 0 if createdAt is missing
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0; // Use 0 if createdAt is missing
            return dateB - dateA; // Sort descending
          });
          setProducts(sortedProducts);
          setTotalPages(response.data.result.pagination?.totalPages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải sản phẩm.");
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, category, type, condition, filters, page, pageSize]);

  useEffect(() => {
    setFilters(f => ({
      ...f,
      brand: brand || "All",
      type: type || "",
      condition: condition || ""
    }));
  }, [brand, type, condition]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getPageTitle = () => {
    if (category) {
      let title = category.charAt(0).toUpperCase() + category.slice(1);
      if (type) {
        title += ` - ${type.charAt(0).toUpperCase() + type.slice(1)}`;
      }
      if (condition) {
        title += ` (${condition.charAt(0).toUpperCase() + condition.slice(1)})`;
      }
      return title.toUpperCase();
    }
    if (brand) {
      return `${brand.toUpperCase()} PRODUCTS`;
    }
    return query ? `SEARCH RESULTS FOR "${query.toUpperCase()}"` : "SEARCH RESULTS";
  };

  const brandList = [
    "All",
    ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))
  ];

  const Pagination = ({ page, totalPages, onPageChange }) => (
    <div style={{ margin: '16px 0', textAlign: 'center' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</button>
      <span style={{ margin: '0 12px' }}>{page} / {totalPages}</span>
      <button style={{ marginTop: '20px' }} onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );

  return (
    <main className={styles.pageContainer}>
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>Home</Link>
        <span>/</span>
        {query ? (
          <Link to={`/search?query=${query}`} className={styles.breadcrumbLink}>
            Search
          </Link>
        ) : condition === 'used' ? (
          <Link to="/search?condition=used" className={styles.breadcrumbLink}>
            Used
          </Link>
        ) : category ? (
          <>
            {(category === 'lenses' || category === 'tripods' || category === 'storage-editing') && (
              <>
                <Link to="/search?category=accessories" className={styles.breadcrumbLink}>Accessories</Link>
                <span>/</span>
              </>
            )}
            {(category === 'flashes' || category === 'softboxes' || category === 'light-stands' || category === 'studio-backgrounds') && (
              <>
                <Link to="/search?category=lighting-studio" className={styles.breadcrumbLink}>Lighting-studio</Link>
                <span>/</span>
              </>
            )}
            <Link to={`/search?category=${category}`} className={styles.breadcrumbLink}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </>
        ) : (
          <Link to="/search?category=products" className={styles.breadcrumbLink}>
            Products
          </Link>
        )}
        {brand && condition !== 'used' && (
          <>
            <span>/</span>
            <span className={styles.breadcrumbBrand}>
              {brand.charAt(0).toUpperCase() + brand.slice(1)}
            </span>
          </>
        )}
        {type && condition !== 'used' && (
          <>
            <span>/</span>
            <Link to={`/search?${query ? `query=${query}&` : category ? `category=${category}&` : 'category=products&'}type=${type}`} className={styles.breadcrumbLink}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Link>
          </>
        )}
        {condition && condition !== 'used' && (
          <>
            <span>/</span>
            <Link to={`/search?${query ? `query=${query}&` : category ? `category=${category}&` : 'category=products&'}${type ? `type=${type}&` : ''}condition=${condition}`} className={styles.breadcrumbLink}>
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </Link>
          </>
        )}
      </nav>
      <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      <section className={styles.contentLayout}>
        <FilterBar 
          category={category} 
          query={query} 
          onFilterChange={handleFilterChange}
          brands={brandList}
        />
        <div className={styles.mainContent}>
          <ProductGrid 
            category={category} 
            query={query} 
            filters={filters}
            products={products}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          <p className={styles.text}>
            Prices, specifications, availability and terms of offers may change
            without notice. <br />
            Products / Services may be manufactured by and/or supplied
            to us by third party manufacturers / suppliers for distribution / resale
            (non-Canon brand products). <br />
            Prices above are recommended retail price and
            may change without prior notice.
          </p>
        </div>
      </section>
    </main>
  );
};

export default SearchResults;