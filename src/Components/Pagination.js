import React from "react";

function Pagination({ payload, setPayload, totalCount }) {
  const { pageNo, pageCount } = payload;

  // total pages
  const totalPages = Math.ceil(parseInt(totalCount) / pageCount);

  // function to handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setPayload((prev) => ({ ...prev, pageNo: page }));
  };

  // function to handle per page change
  const handlePageCountChange = (e) => {
    const newPageCount = parseInt(e.target.value);
    setPayload((prev) => ({ ...prev, pageCount: newPageCount, pageNo: 1 })); // page reset to 1
  };

  // options for per page dropdown
  const pageOptions = [20, 50, 100].filter((opt) => opt <= totalCount);

  return (
    <div className="pagination-container">
      {/* Per Page Dropdown */}

      {/* Pagination */}
      <nav aria-label="Page navigation ">
        <ul className="custom-pagination align-items-center">
          {totalCount>20 && <div className="d-flex align-items-center">
            <label htmlFor="perPage" className="me-2">Show </label>
            <select
              id="perPage"
              value={pageCount}
              onChange={handlePageCountChange}
              className="form-control"
            >
              {pageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>}
          
          {/* Prev button */}
          <li className={`page-item ${pageNo === 1 ? "disabled" : ""}`}>
            <button
              className="page-link prev"
              onClick={() => handlePageChange(pageNo - 1)}
            >
              ←
            </button>
          </li>

          {/* Pages */}
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <li
                key={page}
                className={`page-item ${pageNo === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}

          {/* Next button */}
          <li
            className={`page-item ${pageNo === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link next"
              onClick={() => handlePageChange(pageNo + 1)}
            >
              →
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;