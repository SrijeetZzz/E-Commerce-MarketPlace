
"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { SlidersHorizontal, RotateCcw, ChevronRight } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FilterSidebar = ({ priceBounds, onApply }: any) => {
  const router = useRouter();
  const params = useSearchParams();
  const routeParams = useParams();

  const categoryId = routeParams.id as string;

  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [sort, setSort] = useState(params.get("sortBy") || "price_asc");
  const [categories, setCategories] = useState([]);

  // 🔥 SYNC URL → STATE
  useEffect(() => {
    if (!priceBounds) return;

    setRange([
      Number(params.get("minPrice") || priceBounds[0]),
      Number(params.get("maxPrice") || priceBounds[1]),
    ]);

    setSort(params.get("sortBy") || "price_asc");
  }, [params, priceBounds]);

  // 🔥 FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    };

    fetchCategories();
  }, []);

  const applyFilters = () => {
    const query = new URLSearchParams(params.toString());

    query.set("minPrice", String(range[0]));
    query.set("maxPrice", String(range[1]));
    query.set("sortBy", sort);

    router.push(`/category/${categoryId}?${query.toString()}`);

    if (onApply) onApply();
  };

  const clearFilters = () => {
    router.push(`/category/${categoryId}`);
    if (priceBounds) setRange(priceBounds);
    setSort("price_asc");
  };

  return (
    <aside className="w-full lg:w-72 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm h-fit space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-slate-900" />
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Filters</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="h-8 px-2 text-slate-400 hover:text-slate-900 font-bold text-[11px] uppercase tracking-wider transition-colors"
        >
          <RotateCcw size={12} className="mr-1" />
          Reset
        </Button>
      </div>

      <Separator className="bg-slate-100" />

      {/* CATEGORY SECTION */}
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Category
        </label>
        <Select
          value={categoryId}
          onValueChange={(value) => router.push(`/category/${value}`)}
        >
          <SelectTrigger className="w-full bg-slate-50 border-none rounded-2xl h-12 focus:ring-2 focus:ring-slate-100 transition-all">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
            {categories.map((cat: any) => (
              <SelectItem key={cat._id} value={cat._id} className="py-3 text-sm">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SORT SECTION */}
      <div className="space-y-4">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Sort Results
        </label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full bg-slate-50 border-none rounded-2xl h-12 focus:ring-2 focus:ring-slate-100 transition-all">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
            <SelectItem value="price_asc" className="py-3 text-sm">Price: Low to High</SelectItem>
            <SelectItem value="price_desc" className="py-3 text-sm">Price: High to Low</SelectItem>
            <SelectItem value="newest" className="py-3 text-sm">Newest Arrivals</SelectItem>
            <SelectItem value="popularity" className="py-3 text-sm">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* PRICE RANGE SECTION */}
      <div className="space-y-6">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Price Range
        </label>
        <div className="px-2">
          <Slider
            min={priceBounds?.[0] || 0}
            max={priceBounds?.[1] || 100000}
            step={500}
            value={range}
            onValueChange={(val) => setRange(val as [number, number])}
            className="py-4"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-colors hover:border-slate-200">
            <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Min Price</p>
            <p className="text-sm font-bold text-slate-900">₹{range[0]}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-right transition-colors hover:border-slate-200">
            <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Max Price</p>
            <p className="text-sm font-bold text-slate-900">₹{range[1]}</p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="pt-2">
        <Button 
          onClick={applyFilters}
          className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] group"
        >
          Update Results
          <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;