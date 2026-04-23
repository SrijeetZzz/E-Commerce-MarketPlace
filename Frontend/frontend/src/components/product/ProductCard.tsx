"use client";

import { useRouter } from "next/navigation";
import { ProductListItem } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { addToCart } from "@/services/cart";
import toast from "react-hot-toast"; // ✅ added
import { useAuth } from "../context/AuthContext";

interface Props {
  product: ProductListItem;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getImageUrl = (img?: string) => {
  if (!img || img.trim() === "") return "/placeholder.png";
  return `${BASE_URL}${img}`;
};

const ProductCard = ({ product }: Props) => {
  const router = useRouter();
  const { setCartCount } = useAuth();

  const handleClick = () => {
    router.push(`/product/${product._id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const targetListing = product.listings?.[0];

    if (!targetListing?._id) {
      toast("Select a seller first"); // ✅ better than silent redirect
      router.push(`/product/${product._id}`);
      return;
    }

    try {
      await addToCart(targetListing._id, 1);
      setCartCount((prev: number) => prev + 1);
      // ✅ keep it short → avoids spam annoyance
      toast.success("Added");

    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error("Failed to add");
    }
  };

  const sellingPrice = product.minPrice || 0;
  const mrp = Math.round(sellingPrice * 1.2);

  const validImage =
    product.images?.find((img) => img && img.trim() !== "") || "";

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-[24px]"
    >
      <CardContent className="p-0 relative">

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <Badge className="bg-red-500 text-[10px] font-black px-2 py-0.5 rounded-full border-none shadow-lg">
            20% OFF
          </Badge>

          {product.listings?.length && product.listings.length > 1 ? (
            <Badge className="bg-slate-900/80 text-white text-[9px] font-bold border-none rounded-full px-2">
              {product.listings.length} SELLERS
            </Badge>
          ) : null}
        </div>

        <div className="h-56 w-full overflow-hidden bg-slate-50">
          <img
            src={getImageUrl(validImage)}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {product.brand || "Wearix"}
            </span>
            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md text-emerald-700">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-black">4.2</span>
            </div>
          </div>

          <h2 className="font-bold text-sm line-clamp-2 text-slate-800 min-h-10">
            {product.title}
          </h2>

          <div className="pt-1 flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              ₹{sellingPrice.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 line-through">
              ₹{mrp.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-bold text-xs gap-2"
        >
          <ShoppingCart size={16} />
          ADD TO BAG
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;