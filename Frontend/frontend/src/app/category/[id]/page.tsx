
"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubCategoryTabs from "@/components/category/SubCategoryTabs";
import ProductGrid from "@/components/category/ProductGrid";
import FilterSidebar from "@/components/category/FilterSidebar";
import Pagination from "@/components/category/Pagination";

import api from "@/services/api";
import { fetchProducts } from "@/services/product";
import { ProductListItem } from "@/types/product";

const LIMIT = 10;

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = params.id as string;

  const subCategoryId = searchParams.get("subCategory") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  // 🔥 FETCH SUBCATEGORIES
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await api.get(
          `/categories/subcategories?categoryId=${categoryId}`
        );

        const payload = res?.data ?? res;
        setSubcategories(payload.data || []);
      } catch (err) {
        console.error("Subcategory fetch failed", err);
      }
    };

    fetchSub();
  }, [categoryId]);

  // 🔥 RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setPage(1);
  }, [categoryId, subCategoryId, minPrice, maxPrice]);

  // 🔥 FETCH PRODUCTS (SERVICE BASED)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const params = new URLSearchParams();

        params.set("categoryId", categoryId);
        params.set("page", String(page));
        params.set("limit", String(LIMIT));

        if (subCategoryId !== "all") {
          params.set("subCategoryId", subCategoryId);
        }

        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        const res = await fetchProducts(
          `/products/search?${params.toString()}`
        );

        const list = res.data;
        const pagination = res.pagination;

        setProducts(list);
        setTotalPages(pagination?.totalPages || 1);

        if (list.length) {
          const min = Math.min(...list.map((p) => p.minPrice));
          const max = Math.max(...list.map((p) => p.maxPrice));
          setPriceBounds([min, max]);
        }

      } catch (err) {
        console.error("Product fetch failed", err);
      }
    };

    loadProducts();
  }, [categoryId, subCategoryId, minPrice, maxPrice, page]);

  const handleSubChange = (subId: string) => {
    const query = new URLSearchParams(searchParams.toString());

    if (subId === "all") query.delete("subCategory");
    else query.set("subCategory", subId);

    router.push(`/category/${categoryId}?${query.toString()}`);
  };

  // 🔥 SCROLL TO TOP ON PAGE CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* LEFT FILTER */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
          <FilterSidebar priceBounds={priceBounds} />
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col">

          {/* MOBILE FILTER BUTTON */}
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
              Category
            </h1>

            <SubCategoryTabs
              subcategories={subcategories}
              active={subCategoryId}
              setActive={handleSubChange}
            />
          </div>

          {/* PRODUCTS */}
          <ProductGrid products={products} />

          {/* PAGINATION */}
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />

        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showFilters ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowFilters(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full bg-white transform transition-transform duration-300 ${
            showFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>✕</button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <FilterSidebar
              priceBounds={priceBounds}
              onApply={() => setShowFilters(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;