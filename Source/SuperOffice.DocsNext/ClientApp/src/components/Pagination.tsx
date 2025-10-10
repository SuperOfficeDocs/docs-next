import React, { useState, useEffect } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [maxVisible, setMaxVisible] = useState(5);


  useEffect(() => {
    const updateMaxVisible = () => {
      const width = window.innerWidth;
      if (width < 640) setMaxVisible(3);
      else setMaxVisible(5);
    };

    updateMaxVisible();
    window.addEventListener("resize", updateMaxVisible);
    return () => window.removeEventListener("resize", updateMaxVisible);
  }, []);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let left = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let right = Math.min(totalPages, left + maxVisible - 1);

      if (right - left + 1 < maxVisible) {
        left = Math.max(1, right - maxVisible + 1);
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
      <nav
        className="inline-flex rounded-md shadow-sm space-x-1"
        aria-label="Pagination"
      >
        {/* Previous button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 md:px-3 py-0.5 md:py-1.5 rounded-md border text-sm font-medium 
                     border-gray-300 bg-white text-gray-700 hover:bg-gray-50 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {maxVisible == 3 ? "<" : "Previous"}
        </button>

        <div className="inline-flex space-x-1">
          {/* Page numbers */}
          {pages.map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={idx}
                onClick={() => onPageChange(page)}
                className={`px-2 md:px-3 py-0.5 md:py-1.5 rounded-md border text-sm font-medium 
                        ${page === currentPage
                    ? "bg-superOfficeGreen text-white border-superOfficeGreen"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ) : (
              <span
                key={idx}
                className={`py-1.5 text-sm text-gray-500 select-none px-0 md:px-2 lg:px-3 `}
              >
                ...
              </span>
            )
          )}
        </div>

        {/* Next button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 md:px-3 py-0.5 md:py-1.5 rounded-md border text-sm font-medium 
                     border-gray-300 bg-white text-gray-700 hover:bg-gray-50 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {maxVisible == 3 ? ">" : "Next"}

        </button>
      </nav>
    </div>
  );
};

export default Pagination;
