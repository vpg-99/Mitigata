import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}
export default function pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);
  const goToFirst = () => goToPage(1);
  const goToLast = () => goToPage(totalPages);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex justify-center items-center gap-2 p-0.5 mt-3">
      <button onClick={goToFirst}>
        {!isFirstPage ? <FaAngleDoubleLeft size={16} /> : null}
      </button>
      <button onClick={goToPrevious}>
        {!isFirstPage ? <FaAngleLeft size={16} /> : null}
      </button>
      <span className="text-gray-700 text-sm">Page</span>
      <select
        className="w-10 text-center bg-white border border-gray-300 rounded-md text-sm"
        value={currentPage}
        onChange={(e) => goToPage(Number(e.target.value))}
      >
        {Array.from({ length: totalPages }, (_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
      <span className="text-gray-700 text-sm">of {totalPages}</span>
      <button onClick={goToNext}>
        {!isLastPage ? <FaAngleRight size={16} /> : null}
      </button>
      <button onClick={goToLast}>
        {!isLastPage ? <FaAngleDoubleRight size={16} /> : null}
      </button>
    </div>
  );
}
