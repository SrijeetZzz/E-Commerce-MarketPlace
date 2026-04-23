"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const OrderContent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        const data = res?.data?.data || [];
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: <CheckCircle2 size={14} />,
          label: "Confirmed",
        };
      case "CANCELLED":
        return {
          color: "bg-red-50 text-red-700 border-red-100",
          icon: <XCircle size={14} />,
          label: "Cancelled",
        };
      default:
        return {
          color: "bg-amber-50 text-amber-700 border-amber-100",
          icon: <Clock size={14} />,
          label: "Placed",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Retrieving your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBag size={40} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">No orders yet</h2>
        <p className="text-slate-500 mt-2 max-w-xs font-medium">
          Your purchase history is empty. Time to refresh your wardrobe!
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-8 rounded-full px-10 h-12 bg-slate-900 hover:bg-slate-800 font-bold shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 md:py-12 space-y-10 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Orders</h1>
        <p className="text-slate-500 font-medium tracking-tight">Track and manage your recent purchases</p>
      </header>

      <div className="space-y-6">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);
          return (
            <Card
              key={order._id}
              className="group border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[32px] cursor-pointer overflow-hidden bg-white"
              onClick={() => router.push(`/orders/${order._id}`)}
            >
              <CardContent className="p-0">
                {/* Header info */}
                <div className="flex items-center justify-between p-5 md:px-8 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <Package size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date Placed</p>
                      <p className="text-sm font-bold text-slate-900">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`rounded-full px-3 py-1 border flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </Badge>
                </div>

                {/* Product Preview Row */}
                <div className="p-5 md:px-8 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-5 overflow-hidden">
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item, i) => {
                        const product = item.listingId?.productId;
                        const image = product?.images?.[0]
                          ? `${baseUrl}${product.images[0]}`
                          : "/placeholder.png";
                        return (
                          <div
                            key={i}
                            className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden bg-slate-50 shadow-sm shrink-0"
                          >
                            <img src={image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="product" />
                          </div>
                        );
                      })}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 rounded-2xl border-4 border-white bg-slate-900 flex items-center justify-center text-white text-[10px] font-black shadow-sm shrink-0">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="hidden md:block">
                      <p className="text-sm font-bold text-slate-800 line-clamp-1 max-w-50">
                        {order.items[0]?.listingId?.productId?.title}
                        {order.items.length > 1 && (
                          <span className="text-slate-400 font-medium">
                            {" "}
                            + {order.items.length - 1} more
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Paid</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="bg-slate-50/50 p-4 md:px-8 flex justify-between items-center group-hover:bg-slate-900 transition-all duration-500">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-300 uppercase tracking-[0.2em]">
                    Order Details
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

const OrderPage = () => {
  return (
    <ProtectedRoute>
      <OrderContent />
    </ProtectedRoute>
  );
};

export default OrderPage;