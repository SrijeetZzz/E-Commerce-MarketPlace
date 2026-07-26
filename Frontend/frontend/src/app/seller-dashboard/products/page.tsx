"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { fetchProducts } from "@/services/product";
import { getMyListings } from "@/services/listings";

import SellerProductCard from "@/components/seller/SellerProductCard";
import AddListingModal from "@/components/seller/AddListingModal";
import Pagination from "@/components/category/Pagination";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Search,
  FilterX,
  PackagePlus,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { ProductListItem } from "@/types/product";
import { SellerListing } from "@/types/listings";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [listedIds, setListedIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductListItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // APPLIED FILTERS
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("price_asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  // DRAFT FILTERS
  const [searchDraft, setSearchDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [sortDraft, setSortDraft] = useState("price_asc");
  const [priceDraft, setPriceDraft] = useState<[number, number]>([0, 100000]);

  const [bounds, setBounds] = useState<[number, number]>([0, 100000]);

  const buildUrl = () => {
    let url = `/products/catalog?page=${page}&limit=12`;
    if (search) url += `&q=${search}`;
    if (category) url += `&categoryId=${category}`;
    url += `&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&sortBy=${sort}`;
    return url;
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productRes = await fetchProducts(buildUrl());
      setProducts(productRes.data || []);
      setTotalPages(productRes.pagination?.totalPages || 1);

      if (productRes.priceRange) {
        const { min, max } = productRes.priceRange;
        setBounds([min, max]);
        if (priceRange[0] === 0 && priceRange[1] === 100000) {
          setPriceRange([min, max]);
          setPriceDraft([min, max]);
        }
      }

      const listingsRes = await getMyListings({
        page: 1,
        limit: 1000, // grab all seller listings for "already listed"
      });

      setListedIds(
        (listingsRes.data || []).map((l: SellerListing) =>
          typeof l.productId === "object" ? l._id : l.productId,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setPage(1);
    setSearch(searchDraft);
    setCategory(categoryDraft);
    setSort(sortDraft);
    setPriceRange(priceDraft);
  };

  const resetFilters = () => {
    setSearch("");
    setSearchDraft("");
    setCategory("");
    setCategoryDraft("");
    setSort("price_asc");
    setSortDraft("price_asc");
    setPriceRange(bounds);
    setPriceDraft(bounds);
    setPage(1);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    loadProducts();
  }, [page, search, category, sort, priceRange]);

  return (
    <div className="max-w-400 mx-auto space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
            <PackagePlus size={14} className="font-bold" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Product Sourcing
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Browse Global Catalog
          </h1>
          <p className="text-slate-500 font-medium max-w-xl">
            Click any product card to create a listing for your store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="rounded-xl font-bold gap-2 border-slate-200 hover:bg-slate-50 h-12"
          >
            <FilterX size={16} /> Reset
          </Button>
          <Button
            onClick={applyFilters}
            className="rounded-xl bg-slate-900 text-white font-bold h-12 px-8 hover:bg-slate-800 transition-all gap-2"
          >
            <SlidersHorizontal size={16} /> Apply Filters
          </Button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap lg:flex-nowrap items-center gap-6">
        {/* SEARCH */}
        {/* Search Input */}
        <div className="relative flex-1 min-w-70">
          {/* The Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
            <Search size={18} />
          </div>

          {/* The Input - Added pl-11 to ensure text starts after the icon */}
          <Input
            placeholder="Search the global catalog..."
            value={searchDraft}
            onChange={(e) => {
              setSearchDraft(e.target.value);
            }}
            className="pl-11 h-12 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-black transition-all font-medium w-full"
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <Select
            value={categoryDraft}
            onValueChange={(v) => setCategoryDraft(v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-full lg:w-50 h-14 rounded-2xl border-slate-100 bg-white font-semibold text-slate-600 focus:ring-0 shadow-none">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortDraft} onValueChange={setSortDraft}>
            <SelectTrigger className="w-full lg:w-50 h-14 rounded-2xl border-slate-100 bg-white font-semibold text-slate-600 focus:ring-0 shadow-none">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Latest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PRICE SLIDER */}
        <div className="flex-1 min-w-70 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
              Budget Range
            </span>
            <span className="text-xs font-bold text-slate-700 font-mono">
              ₹{priceDraft[0]} — ₹{priceDraft[1]}
            </span>
          </div>
          <Slider
            min={bounds[0]}
            max={bounds[1]}
            step={100}
            value={priceDraft}
            onValueChange={(v) => setPriceDraft(v as [number, number])}
            className="py-1"
          />
        </div>
      </div>

      {/* PRODUCTS DISPLAY */}
      <div className="min-h-125">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-5">
                <div className="aspect-4/5 rounded-[2.5rem] bg-slate-100 animate-pulse border border-slate-50" />
                <div className="space-y-3 px-2">
                  <div className="h-5 w-3/4 bg-slate-100 rounded-full" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="p-6 bg-white rounded-full shadow-sm border border-slate-100">
              <Search size={40} className="text-slate-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                No products found
              </h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Try adjusting your filters or search terms to see more products.
              </p>
            </div>
            <Button
              onClick={resetFilters}
              variant="link"
              className="text-blue-600 font-bold hover:no-underline"
            >
              Clear all filters <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* ADDED px-2 AND INCREASED GAP FOR BETTER SPACING */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="flex justify-center">
                  <SellerProductCard
                    product={product}
                    alreadyListed={listedIds.includes(product._id)}
                    onAddListing={setSelectedProduct}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center border-t border-slate-100 pt-10">
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <AddListingModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}
