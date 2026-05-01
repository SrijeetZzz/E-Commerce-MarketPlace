"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CreditCard, ArrowLeft, Package, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import toast from "react-hot-toast"; // ✅ added

const OrderDetailsContent = () => {
  const { orderId } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        const data = res?.data?.data;

        if (!data) {
          toast.error("Order not found"); // ✅ important
        }

        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
        toast.error("Failed to load order details"); // ✅
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusStyle = (status: string) => {
    if (status === "CONFIRMED")
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (status === "CANCELLED") return "bg-red-50 text-red-700 border-red-100";
    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order)
    return (
      <div className="p-8 text-center font-bold text-slate-500">
        Order not found.
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-[10px] uppercase tracking-[0.2em] mb-4 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to History
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Order Details
            </h1>
            <Badge
              className={`rounded-full px-3 py-1 font-bold uppercase text-[9px] tracking-widest border shadow-sm ${getStatusStyle(order.status)}`}
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-slate-400 font-medium text-sm">
            Ref:{" "}
            <span className="text-slate-900 font-bold">
              #{order._id.slice(-8).toUpperCase()}
            </span>{" "}
            •{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-2xl font-bold text-xs h-12 px-6 border-slate-200 hover:bg-slate-50"
          >
            Download Invoice
          </Button>
          <Button className="rounded-2xl font-bold text-xs h-12 px-6 bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
            Track Shipment
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT: Product List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Items in your package
          </h3>
          <div className="space-y-4">
            {order.items.map((item, index) => {
              const product = item.listingId?.productId;
              const image = product?.images?.[0]
                ? `${baseUrl}${product.images[0]}`
                : "/placeholder.png";

              return (
                <div
                  key={index}
                  className="group flex gap-6 items-center bg-white p-3 rounded-[28px] border border-slate-50 hover:border-slate-200 transition-all shadow-sm"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-[20px] overflow-hidden shrink-0 border border-slate-50">
                    <img
                      src={image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt="item"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-lg leading-tight truncate">
                      {product?.title}
                    </h4>
                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                      <Package size={12} /> Quantity:{" "}
                      <span className="text-slate-900">{item.quantity}</span>
                    </p>
                  </div>

                  <div className="text-right pr-4">
                    <p className="font-black text-xl text-slate-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-slate-300">
                      ₹{item.price.toLocaleString()} / unit
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Logistics & Summary */}
        <aside className="space-y-8">
          {/* Shipping Address Box */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Delivery Address
            </h3>
            <Card className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden border border-slate-50">
              <CardContent className="p-6">
                {order.address ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <MapPin size={16} className="text-slate-900" />
                      </div>
                      <p className="font-bold text-slate-900">
                        {order.address.fullName}
                      </p>
                    </div>
                    <div className="pl-11 text-sm text-slate-500 leading-relaxed font-medium">
                      <p>{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state} -{" "}
                        {order.address.pincode}
                      </p>
                    </div>
                    <div className="pl-11 pt-2 flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Phone size={14} className="text-slate-300" />{" "}
                      {order.address.phone}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-red-500 italic px-2">
                    No delivery details recorded.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Payment & Summary Box */}
          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Order Summary
            </h3>
            <Card className="border-none shadow-xl shadow-slate-100 rounded-[32px] bg-slate-900 text-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3 border-b border-white/10 pb-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Items Total</span>
                    <span className="text-white font-black">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-black">FREE</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                    <CreditCard size={16} className="text-slate-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                      Payment Successful
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">
                    Total Paid
                  </span>
                  <span className="text-3xl font-black text-white tracking-tighter">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full h-12 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              Continue Shopping
            </Button>
            <p className="text-[10px] text-center text-slate-400 font-medium px-6 leading-relaxed">
              Need help with this order?{" "}
              <span className="text-slate-900 font-bold underline cursor-pointer hover:text-slate-700">
                Contact Support
              </span>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

const OrderDetailsPage = () => {
  return (
    <ProtectedRoute>
      <OrderDetailsContent />
    </ProtectedRoute>
  );
};

export default OrderDetailsPage;
