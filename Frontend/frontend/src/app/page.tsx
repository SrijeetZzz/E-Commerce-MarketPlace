"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import ProductCard from "@/components/product/ProductCard";
import SearchBar from "@/components/search/SearchBar";
import FilterPanel from "@/components/search/FilterPanel";
import { Product } from "@/types/product";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 CATEGORY STATES
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // 🔥 NEW STATES
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("price_asc");

  // 🔹 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products/search", {
        params: {
          q: query,
          minPrice,
          maxPrice,
          categoryId,
          subCategoryId,
          page,
          limit: 8,
          sortBy,
        },
      });
      setProducts(res.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // 🔹 FETCH SUBCATEGORIES
  const fetchSubCategories = async (categoryId: string) => {
    try {
      const res = await api.get("/categories/subcategories", {
        params: { categoryId },
      });
      setSubCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories", err);
    }
  };

  // 🔹 INITIAL LOAD
  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 CATEGORY CHANGE
  useEffect(() => {
    if (categoryId) {
      fetchSubCategories(categoryId);
    } else {
      setSubCategories([]);
    }
    setPage(1);
  }, [categoryId]);

  // 🔹 FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, [query, minPrice, maxPrice, categoryId, subCategoryId, page, sortBy]);

  // return (
  //   <div className="p-6 space-y-6">

  //     {/* 🔍 SEARCH */}
  //     <SearchBar value={query} onChange={setQuery} />

  //     {/* 🔥 FILTER BAR */}
  //     <div className="flex gap-4 flex-wrap">

  //       {/* CATEGORY */}
  //       <select
  //         value={categoryId}
  //         onChange={(e) => {
  //           setCategoryId(e.target.value);
  //           setSubCategoryId("");
  //         }}
  //         className="border p-2 rounded"
  //       >
  //         <option value="">All Categories</option>
  //         {categories.map((cat: any) => (
  //           <option key={cat._id} value={cat._id}>
  //             {cat.name}
  //           </option>
  //         ))}
  //       </select>

  //       {/* SUBCATEGORY */}
  //       <select
  //         value={subCategoryId}
  //         onChange={(e) => setSubCategoryId(e.target.value)}
  //         className="border p-2 rounded"
  //         disabled={!categoryId}
  //       >
  //         <option value="">All Subcategories</option>
  //         {subCategories.map((sub: any) => (
  //           <option key={sub._id} value={sub._id}>
  //             {sub.name}
  //           </option>
  //         ))}
  //       </select>

  //       {/* SORT */}
  //       <select
  //         value={sortBy}
  //         onChange={(e) => setSortBy(e.target.value)}
  //         className="border p-2 rounded"
  //       >
  //         <option value="price_asc">Price Low → High</option>
  //         <option value="price_desc">Price High → Low</option>
  //         <option value="newest">Newest</option>
  //         <option value="popularity">Popularity</option>
  //       </select>
  //     </div>

  //     {/* 💰 PRICE */}
  //     <FilterPanel
  //       minPrice={minPrice}
  //       maxPrice={maxPrice}
  //       setMinPrice={setMinPrice}
  //       setMaxPrice={setMaxPrice}
  //     />

  //     {/* ⏳ LOADING */}
  //     {loading && <p>Loading...</p>}

  //     {/* ❌ EMPTY */}
  //     {!loading && products.length === 0 && (
  //       <p>No products found</p>
  //     )}

  //     {/* 🛍 PRODUCTS */}
  //     <div className="grid grid-cols-4 gap-4">
  //       {products.map((product) => (
  //         <ProductCard key={product._id} product={product} />
  //       ))}
  //     </div>

  //     {/* 🔢 PAGINATION */}
  //     <div className="flex justify-center gap-4 mt-6">
  //       <button
  //         disabled={page === 1}
  //         onClick={() => setPage((p) => p - 1)}
  //         className="px-4 py-2 border rounded disabled:opacity-50"
  //       >
  //         Prev
  //       </button>

  //       <span>
  //         Page {page} / {totalPages}
  //       </span>

  //       <button
  //         disabled={page === totalPages}
  //         onClick={() => setPage((p) => p + 1)}
  //         className="px-4 py-2 border rounded disabled:opacity-50"
  //       >
  //         Next
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default HomePage;