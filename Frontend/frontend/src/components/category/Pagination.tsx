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

  return (
    <div className="flex justify-center items-center gap-3 mt-12 mb-10 flex-wrap">
      {/* PREVIOUS BUTTON */}
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="rounded-xl border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all active:scale-90 disabled:opacity-30 shadow-sm"
      >
        <ChevronLeft size={18} />
      </Button>

      {/* PAGE NUMBERS */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-2xl ">
        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          const isActive = page === p;

          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`
                h-10 min-w-10 px-2 rounded-xl text-sm font-bold transition-all duration-200
                ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200 scale-105"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }
              `}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* NEXT BUTTON */}
      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="rounded-xl border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all active:scale-90 disabled:opacity-30 shadow-sm"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
};

export default Pagination;