import React, { useState } from "react";
import styles from "./FilterBar.module.css";
import arrowdown from "../assets/icons/arrowdown.svg";

function FilterBar({ category, query, onFilterChange, brands = ["All"] }) {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    onFilterChange({ brand, sortBy });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onFilterChange({ brand: selectedBrand, sortBy: value });
  };

  return (
    <aside className={styles.sidebar}>
      <SortingSection sortBy={sortBy} onSortChange={handleSortChange} />
      <FilterSection
        selectedBrand={selectedBrand}
        onBrandSelect={handleBrandSelect}
        category={category}
        brands={brands}
      />
    </aside>
  );
}

function SortingSection({ sortBy, onSortChange }) {
  return (
    <section className={styles.sortingContainer}>
      <h2 className={styles.sectionTitle}>Sort by</h2>
      <div className={styles.sortDropdown}>
        <select
          className={styles.dropdownText}
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>
    </section>
  );
}

function FilterSection({ selectedBrand, onBrandSelect, category, brands }) {
  return (
    <section className={styles.filterContainer}>
      <h2 className={styles.sectionTitle}>Filter By</h2>
      <div className={styles.filterOptions}>
        <h3 className={styles.filterCategory}>Brand</h3>
        <div className={styles.optionsList}>
          {brands.map((brand) => (
            <BrandOption
              key={brand}
              brand={brand}
              isSelected={selectedBrand === brand}
              onSelect={() => onBrandSelect(brand)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandOption({ brand, isSelected, onSelect }) {
  return (
    <div className={styles.optionItem} onClick={onSelect}>
      <div
        className={isSelected ? styles.radioSelected : styles.radioUnselected}
      />
      <span className={styles.optionText}>{brand}</span>
    </div>
  );
}

export default FilterBar;