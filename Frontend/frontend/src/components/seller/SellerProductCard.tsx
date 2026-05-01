"use client";

import { ProductListItem } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, Store } from "lucide-react";

interface Props {
  product: ProductListItem;
  alreadyListed: boolean;
  onAddListing: (product: ProductListItem) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getImageUrl = (img?: string) => {
  if (!img) return "/images/product-placeholder.jpg";
  return img.startsWith("http") ? img : `${BASE_URL}${img}`;
};

export default function SellerProductCard({
  product,
  alreadyListed,
  onAddListing,
}: Props) {
  const image = product.images?.[0] || "";

  const handleOpenListing = () => {
    if (alreadyListed) return;
    onAddListing(product);
  };

  return (
    <Card
      onClick={handleOpenListing}
      className={`
        group relative flex flex-col h-full w-full max-w-[320px] 
        rounded-[24px] overflow-hidden transition-all duration-200 border-slate-200
        ${alreadyListed ? "bg-slate-50/50" : "hover:border-slate-400 cursor-pointer"}
      `}
    >
      <CardContent className="p-0 flex-1">
        {/* Fixed Aspect Ratio Container ensures all cards are the same height */}
        <div className="relative aspect-square w-full bg-slate-100 border-b overflow-hidden">
          {alreadyListed && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-emerald-600 text-white border-none px-3 py-1 rounded-full text-[10px] font-bold">
                <Check className="mr-1 h-3 w-3" />
                LISTED
              </Badge>
            </div>
          )}

          <img
            src={getImageUrl(image)}
            alt={product.title}
            className={`w-full h-full object-cover ${alreadyListed ? "opacity-60 grayscale-[0.5]" : ""}`}
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.jpg";
            }}
          />
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {product.brand || "Generic"}
            </span>
            <Store size={14} className="text-slate-300" />
          </div>

          <h3 className="font-bold text-sm text-slate-800 line-clamp-2 h-10 leading-tight">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-lg font-black text-slate-900">
              ₹{product.minPrice.toLocaleString()}
            </span>
            {product.maxPrice !== product.minPrice && (
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                to ₹{product.maxPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          disabled={alreadyListed}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenListing();
          }}
          className={`
            w-full h-10 rounded-xl font-bold text-xs transition-all
            ${
              alreadyListed
                ? "bg-slate-200 text-slate-500 border-none"
                : "bg-slate-900 text-white hover:bg-black"
            }
          `}
        >
          {alreadyListed ? (
            "Already in Store"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
