import React from "react";
import styles from "./Pagination.module.css";

export default function Pagination({ currentPage, totalPages, onPrev, onNext }) {
  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.pageBtn}
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        &lt; Previous
      </button>
      <span className={styles.pageInfo}>
        Page <span className={styles.currentPage}>{currentPage}</span> of {totalPages}
      </span>
      <button
        className={styles.pageBtn}
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  );
} 