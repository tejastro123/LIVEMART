// client/src/components/Pagination.js
import React from 'react';

const Pagination = ({ pages, page, setPage }) => {
  // Don't render the component if there's only one page or fewer
    if (pages <= 1) {
        return null;
    }

    // Create an array of page numbers to map over, e.g., [1, 2, 3]
    const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

    return (
        <div className="pagination-container">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            &laquo; Prev
        </button>
        {pageNumbers.map(number => (
            <button
            key={number}
            onClick={() => setPage(number)}
            className={page === number ? 'active' : ''}
            >
            {number}
            </button>
        ))}
        <button onClick={() => setPage(page + 1)} disabled={page === pages}>
            Next &raquo;
        </button>
        </div>
    );
};

export default Pagination;