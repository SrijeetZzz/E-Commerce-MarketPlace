"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubCategoryTabs from "@/components/page/SubCategoryTabs";
import ProductGrid from "@/components/page/ProductGrid";
import FilterSidebar from "@/components/page/FilterSidebar";
import api from "@/services/api";

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = params.id as string;

  const subCategoryId = searchParams.get("subCategory") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);

  const [showFilters, setShowFilters] = useState(false);

  // 🔥 FETCH SUBCATEGORIES
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await api.get(
          `/categories/subcategories?categoryId=${categoryId}`
        );
        setSubcategories(res.data || []);
      } catch (err) {
        console.error("Subcategory fetch failed", err);
      }
    };

    fetchSub();
  }, [categoryId]);

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `/products/search?categoryId=${categoryId}`;

        if (subCategoryId !== "all") {
          url += `&subCategoryId=${subCategoryId}`;
        }

        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;

        const res = await api.get(url);
        setProducts(res.data || []);

        if (res.data.length > 0) {
          const min = Math.min(...res.data.map((p: any) => p.minPrice));
          const max = Math.max(...res.data.map((p: any) => p.maxPrice));
          setPriceBounds([min, max]);
        }
      } catch (err) {
        console.error("Product fetch failed", err);
      }
    };

    fetchProducts();
  }, [categoryId, subCategoryId, minPrice, maxPrice]);

  const handleSubChange = (subId: string) => {
    const query = new URLSearchParams(searchParams.toString());

    if (subId === "all") query.delete("subCategory");
    else query.set("subCategory", subId);

    router.push(`/category/${categoryId}?${query.toString()}`);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
          <FilterSidebar priceBounds={priceBounds} />
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col">

          {/* MOBILE BUTTON */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              Open Filters
            </button>
          </div>

          {/* TOP */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-4">
              Category Name
            </h1>

            <SubCategoryTabs
              subcategories={subcategories}
              active={subCategoryId}
              setActive={handleSubChange}
            />
          </div>

          {/* PRODUCTS */}
          <ProductGrid products={products} />
        </div>
      </div>

      {/* 🔥 MOBILE FULL SCREEN FILTER */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showFilters ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowFilters(false)}
        />

        {/* SLIDE PANEL */}
        <div
          className={`absolute right-0 top-0 h-full w-full bg-white transform transition-transform duration-300 ${
            showFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>✕</button>
          </div>

          {/* CONTENT */}
          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <FilterSidebar
              priceBounds={priceBounds}
              onApply={() => setShowFilters(false)} // 🔥 auto close
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;