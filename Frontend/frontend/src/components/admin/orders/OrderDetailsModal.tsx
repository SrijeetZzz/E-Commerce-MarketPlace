"use client";

import { Order } from "@/types/order";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { X } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

type Props = {
  order: Order | null;
  open: boolean;
  onClose: () => void;
};

export default function OrderDetailsModal({
  order,
  open,
  onClose,
}: Props) {
    
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-5xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">
              Order Details
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              #{order._id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8 p-6">

          {/* Order Summary */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">
              Order Summary
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  Order Status
                </p>

                <StatusBadge status={order.status} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Amount
                </p>

                <p className="font-semibold">
                  ₹{order.totalAmount.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Created
                </p>

                <p>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

            </div>
          </section>

          {/* Buyer */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">
              Buyer
            </h3>

            <div className="rounded-lg border p-4">

              <p className="font-medium">
                {order.buyerId?.name}
              </p>

              <p className="text-slate-600">
                {order.buyerId?.email}
              </p>

            </div>
          </section>

          {/* Shipping */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">
              Shipping Address
            </h3>

            <div className="rounded-lg border p-4">

              <p>{order.address?.fullName}</p>

              <p>{order.address?.phone}</p>

              <p>{order.address?.street}</p>

              <p>
                {order.address?.city},{" "}
                {order.address?.state}
              </p>

              <p>{order.address?.pincode}</p>

            </div>
          </section>

          {/* Items */}
          <section>

            <h3 className="mb-3 text-lg font-semibold">
              Ordered Items
            </h3>

            <div className="space-y-4">

              {order.items.map((item) => {
                const seller =
                  typeof item.listingId.sellerId === "string"
                    ? null
                    : item.listingId.sellerId;

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 rounded-lg border p-4"
                  >
                    <img
                      src={getImageUrl(
                        item.listingId.productId.images?.[0]
                      )}
                      alt={item.listingId.productId.title}
                      className="h-20 w-20 rounded object-cover border"
                    />

                    <div className="flex-1">

                      <h4 className="font-semibold">
                        {item.listingId.productId.title}
                      </h4>

                      {item.listingId.productId.description && (
                        <p className="mt-1 text-sm text-slate-500">
                          {item.listingId.productId.description}
                        </p>
                      )}

                      <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">

                        <p>
                          <strong>Quantity:</strong>{" "}
                          {item.quantity}
                        </p>

                        <p>
                          <strong>Price:</strong> ₹
                          {item.price.toLocaleString()}
                        </p>

                        <p>
                          <strong>Seller:</strong>{" "}
                          {seller?.shopName ||
                            seller?.name ||
                            "-"}
                        </p>

                        <div>
                          <strong>Status:</strong>{" "}
                          <StatusBadge
                            status={item.fulfillmentStatus}
                          />
                        </div>

                        {item.trackingId && (
                          <p>
                            <strong>Tracking:</strong>{" "}
                            {item.trackingId}
                          </p>
                        )}

                        {item.shippedAt && (
                          <p>
                            <strong>Shipped:</strong>{" "}
                            {new Date(
                              item.shippedAt
                            ).toLocaleDateString()}
                          </p>
                        )}

                        {item.deliveredAt && (
                          <p>
                            <strong>Delivered:</strong>{" "}
                            {new Date(
                              item.deliveredAt
                            ).toLocaleDateString()}
                          </p>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>

        </div>
      </div>
    </div>
  );
}