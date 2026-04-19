"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/services/api";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Slider } from "@/components/ui/slider";

const FilterSidebar = ({ priceBounds, onApply }: any) => {
  const router = useRouter();
  const params = useSearchParams();
  const routeParams = useParams();

  const categoryId = routeParams.id as string;

  const getInitialRange = (): [number, number] => [
    Number(params.get("minPrice") || priceBounds?.[0] || 0),
    Number(params.get("maxPrice") || priceBounds?.[1] || 0),
  ];

  const initialSort = params.get("sortBy") || "price_asc";

  const [range, setRange] = useState<[number, number]>(getInitialRange());
  const [sort, setSort] = useState(initialSort);
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

    if (onApply) onApply(); // 🔥 close drawer
  };

  const clearFilters = () => {
    router.push(`/category/${categoryId}`);
    if (priceBounds) setRange(priceBounds);
    setSort("price_asc");
  };

  return (
    <div className="w-full max-w-65 sm:max-w-70 md:max-w-75 bg-gray-100 p-5 rounded-2xl space-y-6 h-fit">
      <h2 className="text-lg font-semibold">Filters</h2>

      {/* CATEGORY */}
      <div className="w-full">
        <p className="font-medium mb-2">Category</p>

        <Select
          value={categoryId}
          onValueChange={(value) => router.push(`/category/${value}`)}
        >
          <SelectTrigger className="w-full h-10">
            <span className="block w-full truncate">
              <SelectValue />
            </span>
          </SelectTrigger>

          <SelectContent className="max-w-65">
            {categories.map((cat: any) => (
              <SelectItem key={cat._id} value={cat._id} className="truncate">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SORT */}
      <div className="w-full">
        <p className="font-medium mb-2">Sort By</p>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full h-10">
            <span className="block w-full truncate">
              <SelectValue />
            </span>
          </SelectTrigger>

          <SelectContent className="max-w-65">
            <SelectItem value="price_asc" className="truncate">
              Price: Low → High
            </SelectItem>
            <SelectItem value="price_desc" className="truncate">
              Price: High → Low
            </SelectItem>
            <SelectItem value="newest" className="truncate">
              Newest
            </SelectItem>
            <SelectItem value="popularity" className="truncate">
              Most Popular
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* PRICE */}
      <div className="w-full">
        <p className="font-medium mb-2">Price Range</p>

        <Slider
          min={priceBounds?.[0] || 0}
          max={priceBounds?.[1] || 0}
          step={100}
          value={range}
          onValueChange={(val) => setRange(val as [number, number])}
        />

        <div className="flex justify-between text-sm mt-2">
          <span className="truncate">₹{range[0]}</span>
          <span className="truncate">₹{range[1]}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="space-y-3">
        <button
          onClick={applyFilters}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="w-full text-purple-600 text-sm text-left"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
