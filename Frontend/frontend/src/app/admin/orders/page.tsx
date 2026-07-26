

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Eye } from "lucide-react";
// import toast from "react-hot-toast";

// import DataTable, {
//   Column,
// } from "@/components/admin/tables/DataTable";
// import Pagination from "@/components/admin/tables/Pagination";

// import SearchInput from "@/components/admin/inputs/SearchInput";
// import FilterSelect from "@/components/admin/inputs/FilterSelect";
// import SortSelect from "@/components/admin/inputs/SortSelect";

// import StatusBadge from "@/components/admin/ui/StatusBadge";
// import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";

// import {
//   commonSortOptions,
//   orderStatusOptions,
// } from "@/lib/sortOptions";

// import {
//   getAdminOrders,
//   getAdminOrderById,
// } from "@/services/orders";

// import { Order } from "@/types/order";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");
//   const [sort, setSort] = useState("latest");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [selectedOrder, setSelectedOrder] =
//     useState<Order | null>(null);

//   const [open, setOpen] = useState(false);

//   /* ---------------- FETCH ---------------- */

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const response = await getAdminOrders({
//         page,
//         limit: 10,
//         search,
//         status,
//         sort,
//       });

//       setOrders(response.data);
//       setTotalPages(response.pagination.pages);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [page, search, status, sort]);

//   useEffect(() => {
//     setPage(1);
//   }, [search, status, sort]);

//   /* ---------------- VIEW ORDER ---------------- */

//   const handleView = async (orderId: string) => {
//     try {
//       const data = await getAdminOrderById(orderId);

//       setSelectedOrder(data);
//       setOpen(true);
//     } catch {
//       toast.error("Failed to load order details");
//     }
//   };

//   /* ---------------- TABLE ---------------- */

//   const columns: Column<Order>[] = useMemo(
//     () => [
//       {
//         key: "_id",
//         label: "Order ID",
//         render: (order) => (
//           <span className="font-medium">
//             #{order._id.slice(-8)}
//           </span>
//         ),
//       },

//       {
//         key: "buyer",
//         label: "Buyer",
//         render: (order) => (
//           <div>
//             <p className="font-medium">
//               {order.buyerId?.name || "-"}
//             </p>

//             <p className="text-xs text-slate-500">
//               {order.buyerId?.email || "-"}
//             </p>
//           </div>
//         ),
//       },

//       {
//         key: "items",
//         label: "Items",
//         render: (order) => order.items.length,
//       },

//       {
//         key: "amount",
//         label: "Amount",
//         render: (order) => (
//           <span className="font-medium">
//             ₹{order.totalAmount.toLocaleString("en-IN")}
//           </span>
//         ),
//       },

//       {
//         key: "status",
//         label: "Status",
//         render: (order) => (
//           <StatusBadge status={order.status} />
//         ),
//       },

//       {
//         key: "createdAt",
//         label: "Created",
//         render: (order) =>
//           new Date(order.createdAt).toLocaleDateString(
//             "en-IN"
//           ),
//       },

//       {
//         key: "actions",
//         label: "Actions",
//         render: (order) => (
//           <button
//             onClick={() => handleView(order._id)}
//             className="flex items-center gap-1 rounded-md border px-3 py-1 text-sm hover:bg-slate-100"
//           >
//             <Eye size={16} />
//             View
//           </button>
//         ),
//       },
//     ],
//     []
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}

//       <div>
//         <h1 className="text-2xl font-bold">
//           Orders
//         </h1>

//         <p className="text-slate-500">
//           Manage customer orders
//         </p>
//       </div>

//       {/* Filters */}

//       <div className="flex flex-wrap items-center gap-4">
//         <SearchInput
//           value={search}
//           onChange={setSearch}
//           placeholder="Search orders..."
//         />

//         <FilterSelect
//           value={status}
//           onChange={setStatus}
//           placeholder="All Status"
//           options={orderStatusOptions}
//         />

//         <SortSelect
//           value={sort}
//           onChange={setSort}
//           options={commonSortOptions}
//         />
//       </div>

//       {/* Table */}

//       <DataTable
//         columns={columns}
//         data={orders}
//         isLoading={loading}
//         emptyText="No orders found"
//       />

//       {/* Pagination */}

//       <Pagination
//         page={page}
//         totalPages={totalPages}
//         onPageChange={setPage}
//       />

//       {/* Order Details */}

//       <OrderDetailsModal
//         order={selectedOrder}
//         open={open}
//         onClose={() => {
//           setOpen(false);
//           setSelectedOrder(null);
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

import DataTable, {
  Column,
} from "@/components/admin/tables/DataTable";
import Pagination from "@/components/admin/tables/Pagination";

import SearchInput from "@/components/admin/inputs/SearchInput";
import FilterSelect from "@/components/admin/inputs/FilterSelect";
import SortSelect from "@/components/admin/inputs/SortSelect";

import StatusBadge from "@/components/admin/ui/StatusBadge";
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";

import {
  commonSortOptions,
  orderStatusOptions,
} from "@/lib/sortOptions";

import {
  getAdminOrders,
  getAdminOrderById,
} from "@/services/orders";

import { Order } from "@/types/order";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [open, setOpen] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getAdminOrders({
        page,
        limit: 10,
        search,
        status,
        sort,
      });

      setOrders(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, status, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  /* ---------------- VIEW ORDER ---------------- */

  const handleView = async (orderId: string) => {
    try {
      const data = await getAdminOrderById(orderId);

      setSelectedOrder(data);
      setOpen(true);
    } catch {
      toast.error("Failed to load order details");
    }
  };

  /* ---------------- TABLE ---------------- */

  const columns: Column<Order>[] = useMemo(
    () => [
      {
        key: "_id",
        label: "Order ID",
        render: (order) => (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono font-semibold text-slate-800 ring-1 ring-inset ring-slate-200/60 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/60">
            #{order._id.slice(-8).toUpperCase()}
          </span>
        ),
      },

      {
        key: "buyer",
        label: "Buyer",
        render: (order) => {
          const name = order.buyerId?.name || "Guest Customer";
          const initial = name.charAt(0).toUpperCase();

          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/60">
                {initial}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  {name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                  {order.buyerId?.email || "—"}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        key: "items",
        label: "Items",
        render: (order) => (
          <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:ring-zinc-700/50">
            {order.items.length} {order.items.length === 1 ? "item" : "items"}
          </span>
        ),
      },

      {
        key: "amount",
        label: "Amount",
        render: (order) => (
          <span className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-50">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </span>
        ),
      },

      {
        key: "status",
        label: "Status",
        render: (order) => <StatusBadge status={order.status} />,
      },

      {
        key: "createdAt",
        label: "Created",
        render: (order) => (
          <span className="text-xs text-slate-600 dark:text-zinc-400">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        ),
      },

      {
        key: "actions",
        label: "Actions",
        render: (order) => (
          <button
            onClick={() => handleView(order._id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-50 transition-colors"
          >
            <Eye size={14} className="text-slate-400 dark:text-zinc-400" />
            View Details
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Order Management
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
          Orders Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Track customer purchases, status changes, and fulfillment history.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by order ID or buyer..."
            />
          </div>

          <div className="flex items-center gap-3">
            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="All Status"
              options={orderStatusOptions}
            />

            <SortSelect
              value={sort}
              onChange={setSort}
              options={commonSortOptions}
            />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={loading}
          emptyText="No orders found"
        />
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-zinc-800">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}