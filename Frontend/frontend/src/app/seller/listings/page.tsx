"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getMyListings,
  updateListing,
  deleteListing,
} from "@/services/listings";
import {
  SellerListing,
  PaginationMeta,
  ListingCounts,
  ListingSort,
} from "@/types/listings";
import EditListingModal from "@/components/seller/EditListingModal";
import {
  Package,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  Pencil,
  MoreHorizontal,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  LayoutGrid,
  XCircle,
  Ban,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ListingsPage() {
  type ListingTab =
    | "all"
    | "active"
    | "paused"
    | "pending"
    | "rejected"
    | "low";

  const [listings, setListings] = useState<SellerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SellerListing | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<ListingTab>("all");

  const [sortOrder, setSortOrder] = useState<ListingSort>("newest");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [counts, setCounts] = useState<ListingCounts>({
    total: 0,
    active: 0,
    paused: 0,
    pendingApproval: 0,
    rejected: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  /* ------------------------
Fetch Listings
------------------------- */

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);

      const statusMap = {
        active: "ACTIVE",
        paused: "PAUSED",
        pending: "PENDING_APPROVAL",
        rejected: "REJECTED",
      } as const;

      const status =
        activeTab in statusMap
          ? statusMap[activeTab as keyof typeof statusMap]
          : undefined;

      const result = await getMyListings({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status,
        lowStock: activeTab === "low" ? "true" : undefined,
        sort: sortOrder,
      });

      setListings(result.data || []);
      setPagination(result.pagination);

      if (result.counts) {
        setCounts(result.counts);
      }
    } catch (err) {
      toast.error("Failed loading listings");
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, sortOrder, search]);

  /* ------------------------
Debounced Search
------------------------- */

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  /* ------------------------
Single Fetch Effect
------------------------- */

  useEffect(() => {
    loadListings();
  }, [page, activeTab, sortOrder, search, loadListings]);

  /* ------------------------
Tabs
------------------------- */

  const listingTabs = [
    {
      key: "all",
      label: "All",
      count: counts.total,
    },
    {
      key: "active",
      label: "Active",
      count: counts.active,
    },
    {
      key: "paused",
      label: "Paused",
      count: counts.paused,
    },
    {
      key: "pending",
      label: "Pending",
      count: counts.pendingApproval,
    },
    {
      key: "rejected",
      label: "Rejected",
      count: counts.rejected,
    },
    {
      key: "low",
      label: "Low Stock",
      count: counts.lowStock,
    },
  ] as const;

  /* ------------------------
Pagination
------------------------- */
  const getPaginationRange = () => {
    const total = pagination.totalPages;
    const current = pagination.page;
    const delta = 1;

    const pages = new Set<number>();

    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(total, current + delta);
      i++
    ) {
      pages.add(i);
    }

    pages.add(1);
    pages.add(total);

    const sorted = [...pages].sort((a, b) => a - b);

    const result: (number | string)[] = [];
    let prev = 0;

    for (const p of sorted) {
      if (prev && p - prev > 1) {
        result.push("...");
      }
      result.push(p);
      prev = p;
    }

    return result;
  };

  /* ------------------------
Permissions Helpers
------------------------- */

  const canEditListing = (listing: SellerListing) =>
    listing.status !== "PENDING_APPROVAL" && listing.status !== "REJECTED";
  return (
    <div className="space-y-10 pb-24 max-w-400 mx-auto px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-8 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full mb-3 border border-blue-100 shadow-sm">
            <LayoutGrid size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">
              Inventory Hub
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Inventory Management
          </h1>

          <p className="text-slate-500 font-medium">
            Monitor stock health and manage product visibility.
          </p>
        </div>
      </div>

      {/* TOTAL HERO */}
      <div className="space-y-4">
        {/* TOTAL HERO */}
        <Card
          className="
      relative overflow-hidden
      rounded-[2.5rem] border-slate-200 shadow-sm
      p-10 bg-white group
    "
        >
          {/* Subtle soft glow in the corner */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative flex items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Total Listings
                </p>
              </div>

              <h2 className="text-6xl font-black tracking-tighter text-slate-900 tabular-nums">
                {counts.total}
              </h2>

              <p className="text-sm text-slate-500 font-medium">
                Products currently {counts.total} in your catalog
              </p>
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group-hover:bg-slate-100 transition-colors duration-300">
              <LayoutGrid
                size={42}
                className="text-slate-700 group-hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </Card>

        {/* Metrics Section */}
        <div className="bg-slate-50/50 rounded-[2.5rem] p-2 border border-slate-200/50">
          <button
            onClick={() => setShowMetrics((v) => !v)}
            className="
        w-full flex items-center justify-between
        p-6 rounded-[2rem]
        font-bold text-slate-700
        hover:bg-white transition-all
      "
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-indigo-500 rounded-full" />
              <span className="tracking-tight text-lg">
                Inventory Breakdown
              </span>
            </div>

            <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                {showMetrics ? "Collapse" : "Expand Details"}
              </span>
              {showMetrics ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
          </button>

          {showMetrics && (
            <div className="p-4 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                  title="Active"
                  value={counts.active}
                  icon={<Package size={22} className="text-emerald-600" />}
                  bg="bg-emerald-50"
                  textColor="text-emerald-500"
                />
                <StatCard
                  title="Paused"
                  value={counts.paused}
                  icon={<PauseCircle size={22} className="text-amber-600" />}
                  bg="bg-amber-50"
                  textColor="text-amber-500"
                />
                <StatCard
                  title="Pending"
                  value={counts.pendingApproval}
                  icon={<RefreshCcw size={22} className="text-blue-600" />}
                  bg="bg-blue-50"
                />
                <StatCard
                  title="Low Stock"
                  value={counts.lowStock}
                  icon={<AlertTriangle size={22} className="text-orange-600" />}
                  bg="bg-orange-50"
                />
                <StatCard
                  title="Out Of Stock"
                  value={counts.outOfStock}
                  icon={<XCircle size={22} className="text-rose-600" />}
                  bg="bg-rose-50"
                />
                <StatCard
                  title="Rejected"
                  value={counts.rejected}
                  icon={<Ban size={22} className="text-red-600" />}
                  bg="bg-red-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
        {/* ROW 1 */}
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
          {/* STATUS TABS */}
          <div className="space-y-3 flex-1 min-w-0">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
              Market Status
            </label>

            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                {listingTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setPage(1);
                      setActiveTab(tab.key);
                    }}
                    className={`
                px-5 md:px-6 py-2.5
                rounded-xl
                text-xs font-bold
                whitespace-nowrap
                transition-all
                ${
                  activeTab === tab.key
                    ? "bg-slate-900 text-white shadow-lg scale-[1.02]"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
                }
              `}
                  >
                    {tab.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SORT */}
          <div className="space-y-3 w-full xl:w-72 shrink-0">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 xl:text-right block">
              Sort Catalog
            </label>

            <Select
              value={sortOrder}
              onValueChange={(v) => setSortOrder(v as ListingSort)}
            >
              <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50 font-bold text-xs shadow-none focus:ring-0 w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-2xl shadow-xl border-slate-100">
                <SelectItem value="newest">Newest Added</SelectItem>

                <SelectItem value="oldest">Oldest Added</SelectItem>

                <SelectItem value="priceLow">Price: Low to High</SelectItem>

                <SelectItem value="priceHigh">Price: High to Low</SelectItem>

                <SelectItem value="stockHigh">Stock: High to Low</SelectItem>

                <SelectItem value="stockLow">Stock: Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ROW 2 SEARCH (kept separate) */}
        <div className="space-y-3 pt-6 border-t border-slate-50">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
            Search Database
          </label>

          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product title or SKU..."
              className="
          px-6
          h-14
          rounded-2xl
          bg-slate-50
          border-none
          font-semibold
          text-sm
        "
            />

            {loading && (
              <RefreshCcw
                className="absolute right-5 top-4 animate-spin text-slate-300"
                size={18}
              />
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="p-8">Product Information</TableHead>

              <TableHead className="text-center">Price</TableHead>

              <TableHead className="text-center">Stock</TableHead>

              <TableHead className="text-center">Available</TableHead>

              <TableHead className="text-center">Status</TableHead>

              <TableHead className="text-right p-8">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  Syncing logistics data...
                </TableCell>
              </TableRow>
            ) : listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              listings.map((item) => (
                <TableRow
                  key={item._id}
                  className="group hover:bg-slate-50/30 border-none"
                >
                  {/* PRODUCT */}
                  <TableCell className="p-8">
                    <div className="flex items-center gap-5">
                      <div
                        className="
              h-16 w-16
              rounded-2xl
              overflow-hidden
              border border-slate-100
              bg-slate-50
              shrink-0
            "
                      >
                        <img
                          src={
                            item.product?.images?.[0]
                              ? `${BASE_URL}${item.product.images[0]}`
                              : "/images/placeholder.jpg"
                          }
                          className="w-full h-full object-cover"
                          alt={item.product?.title || "product"}
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm">
                          {item.product?.title}
                        </p>

                        {item.product?.brand && (
                          <p className="text-[11px] font-semibold text-slate-500">
                            {item.product.brand}
                          </p>
                        )}

                        {item.product?.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.product.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="
                        px-2 py-1
                        rounded-full
                        bg-slate-100
                        text-[9px]
                        font-black
                        uppercase
                        text-slate-500
                      "
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.stock <= 5 && (
                          <p className="text-[10px] text-rose-500 font-black uppercase">
                            Low Stock Alert
                          </p>
                        )}

                        {item.status === "REJECTED" && item.rejectionReason && (
                          <p className="text-[10px] text-red-500 font-bold">
                            {item.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* PRICE */}
                  <TableCell className="text-center font-black">
                    ₹{item.price.toLocaleString()}
                  </TableCell>

                  {/* STOCK */}
                  <TableCell className="text-center font-bold">
                    {item.stock}
                  </TableCell>

                  {/* AVAILABLE */}
                  <TableCell className="text-center font-black">
                    {item.stock - (item.reservedStock || 0)}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="p-8 text-right">
                    <div className="flex justify-end gap-3">
                      {canEditListing(item) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(item)}
                          className="
                  rounded-xl
                  h-10
                  px-5
                  font-bold
                  border-slate-200
                "
                        >
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </Button>
                      )}

                      {canEditListing(item) && (
                        <ActionMenu listing={item} onRefresh={loadListings} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl text-white">
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
          Showing Page
          <span className="text-white"> {pagination.page} </span>
          of {pagination.totalPages}
        </p>

        <div className="flex gap-4 items-center">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-slate-700 bg-slate-800"
          >
            <ChevronLeft size={18} />
          </Button>

          <div className="flex gap-2">
            {getPaginationRange().map((n, i) =>
              n === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="px-2 text-slate-500 font-bold self-end pb-2"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${n}-${i}`}
                  onClick={() => setPage(Number(n))}
                  className={`h-11 w-11 rounded-xl text-sm font-black transition-all ${
                    page === n
                      ? "bg-white text-slate-900 scale-110 shadow-lg"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ),
            )}
          </div>

          <Button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-slate-700 bg-slate-800"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {editing && (
        <EditListingModal
          listing={editing}
          open={!!editing}
          onClose={() => setEditing(null)}
          onUpdated={loadListings}
        />
      )}
    </div>
  );
}
function StatCard({ title, value, icon, bg, textColor }: any) {
  return (
    <Card
      className="
        relative overflow-hidden
        p-5 rounded-[1.25rem]
        border border-slate-200/60
        shadow-sm hover:shadow-md
        bg-white
        transition-all duration-300 ease-in-out
        hover:-translate-y-1
        group
      "
    >
      {/* Subtle background glow on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity ${bg}`}
      />

      <div className="relative flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div
            className={`
              p-2.5 rounded-xl
              transition-all duration-300
              group-hover:scale-110 group-hover:rotate-3
              ${bg}
            `}
          >
            {icon}
          </div>

          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
            {title}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-800 tabular-nums">
            {value}
          </h3>

          {/* Animated Progress Bar */}
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className={`
                absolute top-0 left-0 h-full w-2 
                rounded-full transition-all duration-500 ease-out
                group-hover:w-full opacity-60
                ${bg.replace("bg-", "bg-").split(" ")[0]} 
                ${textColor}
              `}
              style={{ backgroundColor: "currentColor" }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-100",

    PAUSED: "bg-amber-50 text-amber-700 border-amber-100",

    OUT_OF_STOCK: "bg-rose-50 text-rose-700 border-rose-100",

    PENDING_APPROVAL: "bg-blue-50 text-blue-700 border-blue-100",

    REJECTED: "bg-red-50 text-red-700 border-red-100",
  };

  const labels: any = {
    PENDING_APPROVAL: "Pending Approval",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${styles[status]}`}
    >
      {labels[status] || status}
    </span>
  );
}

function ActionMenu({ listing, onRefresh }: any) {
  if (listing.status === "PENDING_APPROVAL" || listing.status === "REJECTED") {
    return null;
  }

  const paused = listing.status === "PAUSED";

  const handleAction = async (action: any, msg: string) => {
    try {
      await action();
      toast.success(msg);
      onRefresh();
    } catch {
      toast.error("Failed");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-slate-200 h-10 w-10 shadow-none hover:bg-slate-50 transition-colors"
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-2xl w-56 p-2 shadow-2xl border-slate-100"
      >
        <DropdownMenuItem
          className="rounded-xl py-3 font-bold cursor-pointer group"
          onClick={() =>
            handleAction(
              () =>
                updateListing(listing._id, {
                  status: paused ? "ACTIVE" : "PAUSED",
                }),
              paused ? "Activated" : "Paused",
            )
          }
        >
          {paused ? (
            <>
              <PlayCircle
                size={16}
                className="mr-2 text-emerald-500 group-hover:scale-110 transition-transform"
              />{" "}
              Activate
            </>
          ) : (
            <>
              <PauseCircle
                size={16}
                className="mr-2 text-amber-500 group-hover:scale-110 transition-transform"
              />{" "}
              Pause Listing
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-xl py-3 font-bold cursor-pointer group"
          onClick={() =>
            handleAction(
              () => updateListing(listing._id, { stock: listing.stock + 5 }),
              "Stock Updated",
            )
          }
        >
          <RefreshCcw
            size={16}
            className="mr-2 text-blue-500 group-hover:rotate-180 transition-transform duration-500"
          />{" "}
          Quick Stock (+5)
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2 bg-slate-50" />
        <DropdownMenuItem
          className="rounded-xl py-3 font-bold cursor-pointer text-rose-600 hover:bg-rose-50 group"
          onClick={() => {
            if (confirm("Delete listing?"))
              handleAction(() => deleteListing(listing._id), "Deleted");
          }}
        >
          <Trash2
            size={16}
            className="mr-2 group-hover:shake transition-transform"
          />{" "}
          Delete Listing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
