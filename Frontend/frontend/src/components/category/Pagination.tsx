"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    let start = Math.max(1, page - 2);

    let end = Math.min(totalPages, page + 2);

    // keep 5 visible when possible
    if (page <= 3) {
      end = Math.min(5, totalPages);
    }

    if (page >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    const pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex justify-center items-center gap-3 mt-12 mb-10 flex-wrap">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="rounded-xl border-slate-200 shadow-sm"
      >
        <ChevronLeft size={18} />
      </Button>

      {/* first page */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="
h-10 min-w-10
rounded-xl
font-bold
hover:bg-slate-50
"
          >
            1
          </button>

          {pages[0] > 2 && <span className="px-1">...</span>}
        </>
      )}

      {/* middle pages */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-2xl">
        {pages.map((p) => {
          const active = page === p;

          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`
h-10
min-w-10
px-2
rounded-xl
text-sm
font-bold
transition-all
${
  active
    ? "bg-slate-900 text-white scale-105"
    : "text-slate-500 hover:bg-slate-50"
}
`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* last page */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1">...</span>
          )}

          <button
            onClick={() => setPage(totalPages)}
            className="
h-10 min-w-10
rounded-xl
font-bold
hover:bg-slate-50
"
          >
            {totalPages}
          </button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="rounded-xl border-slate-200 shadow-sm"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};

export default Pagination;
