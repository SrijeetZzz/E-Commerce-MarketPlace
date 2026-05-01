"use client";

import { useEffect, useState, Fragment } from "react";
import { getSellerOrders, updateOrderItemStatus } from "@/services/orders";
import { Order, FulfillmentStatus, SellerOrderTab } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Box,
  LayoutDashboard,
  Calendar,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SellerOrderTab>("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    NEW: 0,
    PACKING: 0,
    SHIPPED: 0,
    DELIVERED: 0,
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await getSellerOrders({
        page,
        limit: 10,
        fulfillmentStatus: tab === "all" ? undefined : tab,
        sort: "newest",
      });
      setOrders(result.data || []);
      setPagination(result.pagination);
      if (result.counts) setStats(result.counts);
    } catch (e) {
      toast.error("Failed loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, tab]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const advanceStatus = async (
    orderId: string,
    itemId: string,
    current: string,
  ) => {
    let next: FulfillmentStatus | "" = "";
    if (current === "NEW") next = "PACKING";
    else if (current === "PACKING") next = "SHIPPED";
    else if (current === "SHIPPED") next = "DELIVERED";
    if (!next) return;

    try {
      await updateOrderItemStatus(orderId, itemId, next);
      toast.success(`Pipeline updated to ${next}`);
      loadOrders();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-12 pb-24 max-w-400 mx-auto px-6 lg:px-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-10 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 w-fit px-4 py-1 rounded-full border border-indigo-100 shadow-sm">
            <LayoutDashboard size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Logistics Operations
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">
            Orders Pipeline
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Grouped order management and fulfillment tracking.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Incoming"
          value={stats.NEW}
          icon={<ClipboardList size={24} className="text-blue-600" />}
          color="border-b-blue-500"
        />
        <StatCard
          title="Packing"
          value={stats.PACKING}
          icon={<Box size={24} className="text-amber-500" />}
          color="border-b-amber-500"
        />
        <StatCard
          title="Dispatched"
          value={stats.SHIPPED}
          icon={<Truck size={24} className="text-indigo-500" />}
          color="border-b-indigo-500"
        />
        <StatCard
          title="Completed"
          value={stats.DELIVERED}
          icon={<PackageCheck size={24} className="text-emerald-500" />}
          color="border-b-emerald-500"
        />
      </div>

      {/* FILTERS - PROFESSIONAL SEGMENTED CONTROL */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-3 md:p-4 shadow-sm relative overflow-hidden">
        {/* subtle mobile edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 md:hidden" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 md:hidden" />

        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap md:justify-center scrollbar-none px-1 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            ["all", "All Shipments", "bg-slate-900"],
            ["NEW", "New Requests", "bg-blue-600"],
            ["PACKING", "In Packing", "bg-amber-500"],
            ["SHIPPED", "Dispatched", "bg-indigo-600"],
            ["DELIVERED", "Completed", "bg-emerald-600"],
          ].map(([status, label, activeColor]) => (
            <button
              key={status}
              onClick={() => {
                setPage(1);
                setTab(status as any);
              }}
              className={`
              shrink-0
              px-5 md:px-6
              py-3
              rounded-2xl
              text-xs font-bold
              transition-all
              relative overflow-hidden
          ${
            tab === status
              ? `text-white ${activeColor}`
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          }
        `}
            >
              <span className="relative z-10">{label}</span>

              {tab === status && (
                <div className="absolute inset-0 bg-black/10 animate-in fade-in duration-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-[3rem] border border-slate-200 bg-white overflow-hidden shadow-xl shadow-slate-100">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Tracking Reference
              </TableHead>
              <TableHead className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Customer
              </TableHead>
              <TableHead className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Net Revenue
              </TableHead>
              <TableHead className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Fulfillment
              </TableHead>
              <TableHead className="text-right p-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-64 text-center text-slate-400 font-bold italic animate-pulse"
                >
                  Syncing logistics data...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <Search size={48} />
                    <p className="text-xl font-bold">No active orders found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const delivered = order.items.filter(
                  (i) => i.fulfillmentStatus === "DELIVERED",
                ).length;
                const isFullyDelivered = delivered === order.items.length;

                return (
                  <Fragment key={order._id}>
                    <TableRow
                      className={`cursor-pointer transition-all border-none ${expanded[order._id] ? "bg-slate-50/50 shadow-inner" : "hover:bg-slate-50/30"}`}
                      onClick={() => toggleExpand(order._id)}
                    >
                      <TableCell className="p-8">
                        <p className="font-black text-lg text-slate-900 tracking-tighter">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-black uppercase tracking-tight">
                          <Calendar size={12} className="text-indigo-400" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-bold text-slate-800 text-sm">
                        {order.buyerId?.name || "Guest Customer"}
                      </TableCell>

                      <TableCell className="text-center">
                        <p className="font-black text-slate-900 text-lg tracking-tighter">
                          ₹{(order.sellerAmount || 0).toLocaleString()}
                        </p>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="space-y-3 flex flex-col items-center">
                          <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                            <div
                              className={`h-full transition-all duration-1000 ${isFullyDelivered ? "bg-emerald-500" : "bg-indigo-500"}`}
                              style={{
                                width: `${(delivered / order.items.length) * 100}%`,
                              }}
                            />
                          </div>
                          <p
                            className={`text-[10px] font-black uppercase tracking-widest ${isFullyDelivered ? "text-emerald-600" : "text-slate-400"}`}
                          >
                            {order.items.length} Units • {delivered} Shipped
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="text-right p-8">
                        <div
                          className={`inline-flex p-3 rounded-2xl transition-all duration-500 ${expanded[order._id] ? "bg-slate-900 text-white rotate-180 shadow-lg" : "bg-slate-100 text-slate-400"}`}
                        >
                          <ChevronDown size={20} />
                        </div>
                      </TableCell>
                    </TableRow>

                    {expanded[order._id] && (
                      <TableRow className="bg-slate-50/50 border-none">
                        <TableCell colSpan={5} className="p-10">
                          <div className="space-y-4 max-w-5xl mx-auto">
                            {order.items.map((item) => (
                              <div
                                key={item._id}
                                className="bg-white border border-slate-200 rounded-[2rem] p-6 flex flex-col sm:flex-row justify-between items-center shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-6">
                                  <div className="h-24 w-24 rounded-3xl overflow-hidden border border-slate-100 shadow-inner group">
                                    <img
                                      alt=""
                                      src={
                                        item.listingId.productId.images?.[0]
                                          ? `${BASE_URL}${item.listingId.productId.images[0]}`
                                          : "/placeholder.png"
                                      }
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-bold text-slate-900 text-lg tracking-tight">
                                      {item.listingId.productId.title}
                                    </p>
                                    <div className="flex items-center gap-4">
                                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        Qty: {item.quantity}
                                      </span>
                                      <span className="text-sm font-black text-emerald-600 tracking-tight">
                                        ₹{item.price.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                  <StatusBadge
                                    status={item.fulfillmentStatus}
                                  />
                                  <ActionButton
                                    status={item.fulfillmentStatus}
                                    onClick={(e: any) => {
                                      e.stopPropagation();
                                      advanceStatus(
                                        order._id,
                                        item._id,
                                        item.fulfillmentStatus,
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          Showing Page <span className="text-white">{pagination.page}</span> of{" "}
          {pagination.totalPages}
        </p>
        <div className="flex gap-4">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-slate-800 rounded-2xl hover:bg-slate-700 w-14 h-14 transition-all"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="bg-slate-800 rounded-2xl hover:bg-slate-700 w-14 h-14 transition-all"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card
      className={`p-8 rounded-[2.5rem] border-slate-200 border-b-4 ${color} shadow-sm hover:shadow-xl transition-all duration-300 bg-white group`}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="p-4 rounded-[1.5rem] bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">
          {title}
        </p>
      </div>
      <h2 className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
        {value}
      </h2>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    NEW: "bg-blue-50 text-blue-700 border-blue-100",
    PACKING: "bg-amber-50 text-amber-700 border-amber-100",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-100",
    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return (
    <span
      className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActionButton({ status, onClick }: any) {
  if (status === "DELIVERED") {
    return (
      <div className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex gap-2 items-center px-4">
        <CheckCircle2 size={18} /> Verified
      </div>
    );
  }

  const config: any = {
    NEW: { label: "Pack", icon: <ArrowRight size={16} /> },
    PACKING: { label: "Ship", icon: <Truck size={16} /> },
    SHIPPED: { label: "Deliver", icon: <PackageCheck size={16} /> },
  };

  const c = config[status];

  return (
    <Button
      size="sm"
      onClick={onClick}
      className="rounded-2xl bg-slate-900 hover:bg-black px-8 py-6 font-bold text-sm tracking-tight shadow-lg shadow-slate-200 transition-all hover:scale-105"
    >
      {c.label} {c.icon}
    </Button>
  );
}
