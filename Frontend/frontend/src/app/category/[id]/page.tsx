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

  // 🔥 FETCH SUBCATEGORIES
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await api.get(
          `/categories/subcategories?categoryId=${categoryId}`,
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

  // 🔥 HANDLE SUBCATEGORY CHANGE
  const handleSubChange = (subId: string) => {
    const query = new URLSearchParams(searchParams.toString());

    if (subId === "all") {
      query.delete("subCategory");
    } else {
      query.set("subCategory", subId);
    }

    router.push(`/category/${categoryId}?${query.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SubCategoryTabs
        subcategories={subcategories}
        active={subCategoryId}
        setActive={handleSubChange}
      />

      <div className="flex gap-6 mt-6">
        <FilterSidebar priceBounds={priceBounds}/>

        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default CategoryPage;
