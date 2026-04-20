"use client";

import { Check } from "lucide-react";

interface SubCategory {
  _id: string;
  name: string;
}

interface Props {
  subcategories: SubCategory[];
  active: string;
  setActive: (id: string) => void;
}

const SubCategoryTabs = ({ subcategories, active, setActive }: Props) => {
  // We combine "All" with subcategories to map them easily into the grid
  const allTabs = [{ _id: "all", name: "All Products" }, ...subcategories];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-6">
      {allTabs.map((tab) => {
        const isActive = active === tab._id;

        return (
          <button
            key={tab._id}
            onClick={() => setActive(tab._id)}
            className={`
              relative h-14 w-full rounded-2xl text-[13px] font-bold px-2
              transition-all duration-300 flex items-center justify-center 
              border-2 box-border overflow-hidden
              ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 -translate-y-1"
                  : "bg-white text-slate-500 border-slate-100 hover:border-slate-900 hover:text-slate-900 hover:-translate-y-1 hover:shadow-lg"
              }
            `}
          >
            <div className="flex items-center justify-center gap-2 px-1">
              {isActive && <Check size={14} strokeWidth={3} className="shrink-0" />}
              <span className="truncate leading-tight">{tab.name}</span>
            </div>

            {/* Subtle bottom indicator for active state */}
            {isActive && (
              <div className="absolute bottom-1 w-8 h-1 bg-white/30 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SubCategoryTabs;