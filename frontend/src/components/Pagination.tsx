// Pagination controls.
import { ReactElement } from "react";

interface IPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: IPaginationProps): ReactElement => {
  const safeTotalPages = Math.max(totalPages, 1);
  const isFirstPage = page <= 1;
  const isLastPage = page >= safeTotalPages;
  const previousPage = page - 1;
  const nextPage = page + 1;

  const handlePreviousClick = (): void => {
    onPageChange(previousPage);
  };

  const handleNextClick = (): void => {
    onPageChange(nextPage);
  };

  return (
    <nav className="flex items-center justify-between px-3 py-1">
      <button
        type="button"
        onClick={handlePreviousClick}
        disabled={isFirstPage}
        className="rounded-full border border-slate-300 px-3.5 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span className="rounded-full bg-[#eef7f2] px-3 py-1 text-sm font-semibold text-emerald-700">
        Page {page} of {safeTotalPages}
      </span>
      <button
        type="button"
        onClick={handleNextClick}
        disabled={isLastPage}
        className="rounded-full border border-slate-300 px-3.5 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
};
