"use client";

import { useState } from "react";
import { ProductListItem } from "@/types/product";
import { createListing } from "@/services/listings";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Props {
  product: ProductListItem;
  open: boolean;
  onClose: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AddListingModal({ product, open, onClose }: Props) {
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  const image = product.images?.[0]
    ? `${BASE_URL}${product.images[0]}`
    : "/placeholder.png";

  const handleSubmit = async () => {
    if (!price || !stock) {
      toast.error("Fill all fields");
      return;
    }

    if (Number(price) <= 0 || Number(stock) <= 0) {
      toast.error("Invalid values");
      return;
    }

    try {
      setLoading(true);

      await createListing({
        productId: product._id,
        price: Number(price),
        stock: Number(stock),
      });

      toast.success("Listing created");

      setPrice("");
      setStock("");

      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Add Listing</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <img
              src={image}
              alt={product.title}
              className="w-24 h-24 rounded-2xl object-cover bg-slate-50"
            />

            <div className="space-y-2">
              <h3 className="font-bold text-sm">{product.title}</h3>

              <p className="text-sm text-slate-500">{product.brand}</p>

              <div className="text-xs font-semibold bg-slate-100 rounded-lg px-3 py-2 inline-block">
                Allowed Range: ₹{product.minPrice} - ₹{product.maxPrice}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Selling Price
              </label>

              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Stock Quantity
              </label>

              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter stock"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
