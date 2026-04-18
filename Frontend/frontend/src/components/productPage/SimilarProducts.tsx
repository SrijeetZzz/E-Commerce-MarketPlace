"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

const SimilarProducts = ({ product }: any) => {
  const router = useRouter();

  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      // 🚨 PROPER GUARD (not just product)
      if (!product?.category) {
        setLoading(false);
        return;
      }

      try {
        let url = `/products/search?categoryId=${product.category}`;

        if (product.subCategory) {
          url += `&subCategoryId=${product.subCategory}`;
        }

        const res = await api.get(url);

        const filtered = (res.data || []).filter(
          (p: any) => p._id !== product._id
        );

        setSimilarProducts(filtered.slice(0, 8));
      } catch (err) {
        console.error("Similar products fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [product?.category, product?.subCategory, product?._id]);

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <div className="mt-16">
        <p className="text-gray-500">Loading similar products...</p>
      </div>
    );
  }

  // 🔥 NO DATA
//   if (!similarProducts.length) {
//     return null;
//   }

  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold mb-6">
        Similar Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {similarProducts.map((item: any) => (
          <div
            key={item._id}
            onClick={() => router.push(`/products/${item._id}`)}
            className="cursor-pointer border rounded-lg p-3 hover:shadow-md transition"
          >
            <img
              src={item.images?.[0] || "/placeholder.png"}
              className="w-full h-40 object-cover rounded"
              alt={item.title}
            />

            <p className="mt-2 text-sm font-medium line-clamp-2">
              {item.title}
            </p>

            <p className="text-purple-600 font-semibold">
              ₹{item.minPrice || item.price || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;