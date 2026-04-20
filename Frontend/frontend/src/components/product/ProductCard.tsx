// "use client";

// import { useRouter } from "next/navigation";
// import { ProductListItem } from "@/types/product";
// import { Card, CardContent } from "@/components/ui/card";

// interface Props {
//   product: ProductListItem;
// }

// const BASE_URL = "http://localhost:5000";

// const getImageUrl = (img?: string) => {
//   if (!img || img.trim() === "") return "/placeholder.png";
//   return `${BASE_URL}${img}`;
// };

// const ProductCard = ({ product }: Props) => {
//   const router = useRouter();

//   const handleClick = () => {
//     router.push(`/product/${product._id}`);
//   };

//   const validImage =
//     product.images?.find((img) => img && img.trim() !== "") || "";

//   return (
//     <Card
//       onClick={handleClick}
//       className="cursor-pointer hover:shadow-lg transition"
//     >
//       <CardContent className="p-4 space-y-3">

//         {/* 🔥 IMAGE */}
//         <img
//           src={getImageUrl(validImage)}
//           alt={product.title}
//           className="h-40 w-full object-cover rounded-md"
//         />

//         <h2 className="font-semibold text-sm line-clamp-2">
//           {product.title}
//         </h2>

//         <p className="text-xs text-gray-500">
//           {product.brand}
//         </p>

//         <p className="text-sm font-medium">
//           From ₹{product.minPrice}
//         </p>

//         <p className="text-xs text-gray-400">
//           {product.listings?.length || 0} seller(s)
//         </p>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCard;

"use client";

import { useRouter } from "next/navigation";
import { ProductListItem } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Tag } from "lucide-react";
import { addToCart } from "@/services/cart"; // Ensure this is imported

interface Props {
  product: ProductListItem;
}

const BASE_URL = "http://localhost:5000";

const getImageUrl = (img?: string) => {
  if (!img || img.trim() === "") return "/placeholder.png";
  return `${BASE_URL}${img}`;
};

const ProductCard = ({ product }: Props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${product._id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 🔥 Prevents navigating to product page
    
    // Find the cheapest or first active listing
    const targetListing = product.listings?.[0]; 
    if (!targetListing?._id) {
      router.push(`/product/${product._id}`);
      return;
    }

    try {
      await addToCart(targetListing._id, 1);
      // Optional: Add a toast notification here
      console.log("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const validImage = product.images?.find((img) => img && img.trim() !== "") || "";

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
    >
      <CardContent className="p-0 relative">
        {/* 🔥 Badge: Listings Count */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.listings?.length && product.listings.length > 1 ? (
            <Badge className="bg-blue-600/90 hover:bg-blue-600 text-[10px] font-bold">
              {product.listings.length} SELLERS
            </Badge>
          ) : null}
        </div>

        {/* 🔥 IMAGE with Hover Zoom */}
        <div className="h-52 w-full overflow-hidden bg-slate-50">
          <img
            src={getImageUrl(validImage)}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
        </div>

        <div className="p-4 space-y-1.5">
          {/* Brand & Rating */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {product.brand || "Generic"}
            </span>
            <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-700">
              <Star size={10} fill="currentColor" />
              <span className="text-[10px] font-black">4.2</span>
            </div>
          </div>

          <h2 className="font-bold text-sm line-clamp-2 text-slate-800 min-h-10 leading-tight">
            {product.title}
          </h2>

          <div className="pt-1 flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              ₹{product.minPrice?.toLocaleString()}
            </span>
            {/* Optional fake original price for professional look */}
            <span className="text-xs text-slate-400 line-through">
              ₹{(product.minPrice * 1.2).toFixed(0)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-slate-900 hover:bg-primary text-white rounded-lg h-10 font-bold text-xs gap-2 transition-colors"
        >
          <ShoppingCart size={16} />
          ADD TO BAG
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;