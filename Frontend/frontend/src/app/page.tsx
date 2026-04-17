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

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products/search", {
        params: {
          q: query,
          minPrice,
          maxPrice,
        },
      });
      setProducts(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query, minPrice, maxPrice]);

  return (
    <div className="p-6 space-y-6">
      <SearchBar value={query} onChange={setQuery} />

      <FilterPanel
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />

      {loading && <p>Loading...</p>}
      {!loading && (!products || products.length === 0) && (
        <p>No products found</p>
      )}

      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
