"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductListItem } from "@/types/product";
import { fetchProducts } from "@/services/product";

interface Props {
  product: {
    _id: string;
    categoryId: string;
    subCategoryId: string;
  };
}

const SimilarProducts = ({ product }: Props) => {
  const router = useRouter();

  const [similarProducts, setSimilarProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // prevent state update after unmount

    const fetchSimilar = async () => {
      if (!product?.categoryId) {
        setLoading(false);
        return;
      }

      try {
        let url = `/products/search?categoryId=${product.categoryId}`;

        if (product.subCategoryId) {
          url += `&subCategoryId=${product.subCategoryId}`;
        }

        const res = await fetchProducts(url);

        // 🔥 SAFE ACCESS
        const list = res?.data ?? [];

        const filtered = list.filter(
          (p) => p._id !== product._id
        );

        if (isMounted) {
          setSimilarProducts(filtered.slice(0, 8));
        }

      } catch (err) {
        console.error("Similar products fetch failed", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSimilar();

    return () => {
      isMounted = false;
    };
  }, [product._id, product.categoryId, product.subCategoryId]);

  if (loading) {
    return (
      <div className="mt-16">
        <p className="text-gray-500">Loading similar products...</p>
      </div>
    );
  }

  if (!similarProducts.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl font-semibold mb-6">
        Similar Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {similarProducts.map((item) => (
          <div
            key={item._id}
            onClick={() => router.push(`/product/${item._id}`)}
            className="cursor-pointer border rounded-lg p-3 hover:shadow-md transition"
          >
            <img
              src={item.images[0] || "/placeholder.png"}
              className="w-full h-40 object-cover rounded"
              alt={item.title}
            />

            <p className="mt-2 text-sm font-medium line-clamp-2">
              {item.title}
            </p>

            <p className="text-purple-600 font-semibold">
              ₹{item.minPrice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;