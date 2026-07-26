"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { ProductListing } from "@/types/admin";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { getImageUrl } from "@/lib/utils";

interface Props {
  open: boolean;
  listing: ProductListing | null;
  onClose: () => void;
}

export default function ListingDetailsModal({ open, listing, onClose }: Props) {

  if (!open || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Listing Details
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Listing ID: {listing._id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8 p-6">
          {/* Images */}
          <section>
            <h3 className="mb-4 text-lg font-semibold">Product Images</h3>

            {listing.productId.images?.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {listing.productId.images.map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-700"
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Product ${index + 1}`}
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/400x400?text=No+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-zinc-700">
                <span className="text-sm text-slate-500 dark:text-zinc-400">
                  No product images available
                </span>
              </div>
            )}
          </section>

          {/* Product Information */}
          <section>
            <h3 className="mb-4 text-lg font-semibold">Product Information</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoItem label="Title" value={listing.productId.title} />

              <InfoItem label="Brand" value={listing.productId.brand} />

              <InfoItem
                label="Category"
                value={listing.productId.categoryId?.name}
              />

              <InfoItem
                label="Subcategory"
                value={listing.productId.subCategoryId?.name}
              />

              <div className="md:col-span-2">
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Description
                </p>

                <div className="rounded-lg border bg-slate-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                  {listing.productId.description}
                </div>
              </div>
            </div>
          </section>

          {/* Seller */}
          <section>
            <h3 className="mb-4 text-lg font-semibold">Seller Information</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoItem label="Seller Name" value={listing.sellerId.name} />

              <InfoItem label="Email" value={listing.sellerId.email} />

              <InfoItem
                label="Shop Name"
                value={listing.sellerId.shopName || "-"}
              />

              <InfoItem label="Phone" value={listing.sellerId.phone || "-"} />
            </div>
          </section>

          {/* Inventory */}
          <section>
            <h3 className="mb-4 text-lg font-semibold">Inventory & Pricing</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoItem
                label="Price"
                value={`₹${listing.price.toLocaleString("en-IN")}`}
              />

              <InfoItem label="Stock" value={listing.stock} />

              <InfoItem label="Reserved Stock" value={listing.reservedStock} />

              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Status
                </p>

                <StatusBadge status={listing.status} />
              </div>

              {listing.approvalReason && (
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm font-medium text-slate-500">
                    Approval / Rejection Reason
                  </p>

                  <div className="rounded-lg border bg-slate-50 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                    {listing.approvalReason}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Metadata */}
          <section>
            <h3 className="mb-4 text-lg font-semibold">Metadata</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoItem
                label="Created"
                value={new Date(listing.createdAt).toLocaleString()}
              />

              <InfoItem
                label="Last Updated"
                value={new Date(listing.updatedAt).toLocaleString()}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-slate-500">{label}</p>

      <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-800">
        {value || "-"}
      </div>
    </div>
  );
}
