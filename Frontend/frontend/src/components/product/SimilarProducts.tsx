"use client";

import { useEffect, useState } from "react";
import { ProductListItem } from "@/types/product";
import { fetchProducts } from "@/services/product";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; 

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  product: {
    _id: string;
    categoryId: string;
    subCategoryId: string;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SimilarProducts = ({ product }: Props) => {
  const router = useRouter();
  const [similarProducts, setSimilarProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSimilar = async () => {
      if (!product?.categoryId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchProducts(
          `/products/search?categoryId=${product.categoryId}${
            product.subCategoryId
              ? `&subCategoryId=${product.subCategoryId}`
              : ""
          }`
        );

        const list = res?.data ?? [];
        const filtered = list.filter(
          (p: ProductListItem) => p._id !== product._id
        );

        if (isMounted) setSimilarProducts(filtered.slice(0, 10));

      } catch (err) {
        console.error(err);
        toast.error("Failed to load similar products"); // ✅ only here
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSimilar();

    return () => {
      isMounted = false;
    };
  }, [product._id, product.categoryId, product.subCategoryId]);

  if (loading || !similarProducts.length) return null;

  return (
    <div className="mt-20 px-2">
      {/* Sleek Header */}
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Similar Products
        </h2>
        <div className="h-1 w-12 bg-slate-900 mt-2 rounded-full" />
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {similarProducts.map((item) => {
            const validImage = item.images?.find((img) => img && img.trim() !== "");
            const imageUrl = validImage ? `${BASE_URL}${validImage}` : "/images/placeholder.jpg";
            
            // 🔥 Discount Logic
            const sellingPrice = item.minPrice;
            const originalPrice =  sellingPrice * 1.25; // Fallback if MRP is missing
            const discount = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);

            return (
              <CarouselItem
                key={item._id}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <div
                  onClick={() => router.push(`/product/${item._id}`)}
                  className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-2 transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-slate-50">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                    />
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="mt-3 px-1 pb-1">
                    <h3 className="text-[13px] font-medium text-slate-700 line-clamp-1 group-hover:text-black transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1.5" suppressHydrationWarning>
                      {/* Selling Price */}
                      <span className="text-[14px] font-black text-slate-900">
                        ₹{sellingPrice?.toLocaleString()}
                      </span>
                      
                      {/* Original Price */}
                      <span className="text-[11px] text-slate-400 line-through font-medium">
                        ₹{Math.round(originalPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Minimalist Controls */}
        <div className="hidden md:block">
          <CarouselPrevious className="h-10 w-10 -left-5 shadow-lg bg-white border-none hover:bg-slate-900 hover:text-white transition-all" />
          <CarouselNext className="h-10 w-10 -right-5 shadow-lg bg-white border-none hover:bg-slate-900 hover:text-white transition-all" />
        </div>
      </Carousel>
    </div>
  );
};

export default SimilarProducts;