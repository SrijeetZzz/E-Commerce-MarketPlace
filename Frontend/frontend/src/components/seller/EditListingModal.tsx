"use client";

import { useState, useEffect } from "react";
import { SellerListing } from "@/types/listings";
import { updateListing } from "@/services/listings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Tag, Layers, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;

  listing: SellerListing | null;

  onUpdated: () => void;
}

export default function EditListingModal({
  open,
  onClose,
  listing,
  onUpdated,
}: Props) {
  const [price, setPrice] = useState<number>(0);

  const [stock, setStock] = useState<number>(0);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (listing) {
      setPrice(listing.price);

      setStock(listing.stock);
    }
  }, [listing]);

  const submit = async () => {
    if (!listing) return;

    if (price <= 0 || stock < 0) {
      toast.error("Enter valid values");
      return;
    }

    /*
 optional range validation
 */
    if (listing.product?.priceRange) {
      const min = listing.product.priceRange.min;

      const max = listing.product.priceRange.max;

      if (price < min || price > max) {
        toast.error(`Price must be between ₹${min} and ₹${max}`);
        return;
      }
    }

    try {
      setSaving(true);

      await updateListing(listing._id, {
        price,
        stock,
      });

      toast.success("Listing updated");

      onUpdated();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-8 bg-slate-900 text-white">
          <DialogTitle className="text-2xl font-black flex items-center gap-3 ">
            <Package size={22} />
            Edit Listing
          </DialogTitle>

          <DialogDescription className="text-slate-400 font-medium">
            {listing?.product?.title || "Update offer details"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 bg-white space-y-8">
          {/* product summary */}
          {listing && (
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Current Offer
              </p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">
                    ₹{listing.price.toLocaleString()}
                  </p>

                  <p className="text-sm text-slate-500">
                    Stock: {listing.stock}
                  </p>
                </div>

                <div className="text-xs font-black uppercase text-slate-400">
                  {listing.status}
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Tag size={14} />
              Listing Price
            </label>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <IndianRupee size={16} />
              </div>

              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="pl-11 h-14 rounded-2xl border-slate-200 font-semibold"
                placeholder="Enter price"
              />
            </div>

            {listing?.product?.priceRange && (
              <p className="text-[11px] text-slate-400 italic">
                Allowed range: ₹{listing.product.priceRange.min}
                {" - "}₹{listing.product.priceRange.max}
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers size={14} />
              Inventory Stock
            </label>

            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="h-14 rounded-2xl border-slate-200 font-semibold"
              placeholder="Enter stock"
            />
          </div>

          {/* footer */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="flex-1 h-12 rounded-2xl font-bold"
            >
              Cancel
            </Button>

            <Button
              onClick={submit}
              disabled={saving}
              className="flex-1 h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold shadow-xl"
            >
              {saving ? "Saving..." : "Update Listing"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
