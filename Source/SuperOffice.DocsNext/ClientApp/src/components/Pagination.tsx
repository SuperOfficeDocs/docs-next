import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let left = Math.max(1, currentPage - 2);
      let right = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        left = 1;
        right = maxVisible;
      } else if (currentPage >= totalPages - 2) {
        left = totalPages - (maxVisible - 1);
        right = totalPages;
      }

      if (left > 1) {
        pages.push(1);
        if (left > 2) pages.push("...");
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages) {
        if (right < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center mt-6 w-full overflow-x-auto">
      <nav className="inline-flex rounded-md shadow-sm space-x-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-md border text-sm font-medium 
                     border-gray-300 bg-white text-gray-700 hover:bg-gray-50 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium 
                        ${
                          page === currentPage
                            ? "bg-superOfficeGreen text-white border-superOfficeGreen"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={idx}
              className="px-3 py-1.5 text-sm text-gray-500 select-none"
            >
              ...
            </span>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-md border text-sm font-medium 
                     border-gray-300 bg-white text-gray-700 hover:bg-gray-50 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
