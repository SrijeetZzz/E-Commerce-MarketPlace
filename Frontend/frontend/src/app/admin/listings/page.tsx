"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

import DataTable from "@/components/admin/tables/DataTable";
import Pagination from "@/components/admin/tables/Pagination";

import FilterSelect from "@/components/admin/inputs/FilterSelect";
import SortSelect from "@/components/admin/inputs/SortSelect";

import StatusBadge from "@/components/admin/ui/StatusBadge";
import ActionButtons from "@/components/admin/ui/ActionButtons";

import ListingDetailsModal from "@/components/admin/listings/ListingDetailsModal";

import { commonSortOptions, listingStatusOptions } from "@/lib/sortOptions";

import {
  getListings,
  approveListing,
  rejectListing,
  getSellers,
  getListingById,
} from "@/services/admin";

import { ProductListing, SellerUser } from "@/types/admin";

export default function ListingsPage() {
  const [data, setData] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [sort, setSort] = useState("latest");

  const [sellers, setSellers] = useState<SellerUser[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedListing, setSelectedListing] = useState<ProductListing | null>(
    null,
  );

  const [open, setOpen] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await getListings({
        page,
        limit: 10,
        sellerId,
        status,
        sort,
      });

      setData(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      const response = await getSellers();
      setSellers(response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sellerId, status, sort]);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [sellerId, status, sort]);

  /* ---------------- ACTIONS ---------------- */

  const handleView = async (id: string) => {
    try {
      const listing = await getListingById(id);

      setSelectedListing(listing);
      setOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load listing details");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveListing(id);

      toast.success("Listing approved");

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve listing");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      await rejectListing(id, reason);

      toast.success("Listing rejected");

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject listing");
    }
  };

  /* ---------------- TABLE ---------------- */

  const columns = [
    {
      key: "product",
      label: "Product Title",
      render: (row: ProductListing) => (
        <div className="flex flex-col min-w-45">
          <span className="font-semibold text-sm text-slate-900 dark:text-zinc-100 truncate">
            {row.productId?.title || "Untitled Product"}
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
            ID: {row._id.slice(-6).toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      key: "seller",
      label: "Seller",
      render: (row: ProductListing) => {
        const name = row.sellerId?.name || "Merchant";
        const initial = name.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/60">
              {initial}
            </div>

            <span className="truncate text-sm font-medium text-slate-800 dark:text-zinc-200">
              {name}
            </span>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Contact Email",
      render: (row: ProductListing) => (
        <span className="text-sm text-slate-600 dark:text-zinc-400">
          {row.sellerId?.email || "—"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: ProductListing) => (
        <span className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-50">
          ₹{row.price.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock Level",
      render: (row: ProductListing) => {
        const isLow = row.stock <= 5;
        const isOutOfStock = row.stock === 0;

        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium font-mono ${
              isOutOfStock
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                : isLow
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                  : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {row.stock} units
          </span>
        );
      },
    },

    {
      key: "status",
      label: "Status",
      render: (row: ProductListing) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: ProductListing) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row._id)}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Eye size={15} />
            View
          </button>

          {row.status === "PENDING_APPROVAL" ? (
            <ActionButtons
              actions={[
                {
                  label: "Approve",
                  variant: "success",
                  onClick: () => handleApprove(row._id),
                },
                {
                  label: "Reject",
                  variant: "danger",
                  onClick: () => handleReject(row._id),
                },
              ]}
            />
          ) : (
            <span className="inline-flex items-center text-xs font-medium text-slate-400 dark:text-zinc-500">
              No pending actions
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Catalog Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
            Product Listings
          </h1>

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Review, approve, or reject merchant product listings for the
            marketplace.
          </p>
        </div>

        {/* Control Bar */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="w-full sm:w-60">
              <FilterSelect
                value={sellerId}
                onChange={setSellerId}
                placeholder="All Sellers"
                options={sellers.map((seller) => ({
                  label: seller.name,
                  value: seller._id,
                }))}
              />
            </div>

            <div className="w-full sm:w-48">
              <FilterSelect
                value={status}
                onChange={setStatus}
                placeholder="All Status"
                options={listingStatusOptions}
              />
            </div>

            <div className="w-full sm:w-48">
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
          <DataTable columns={columns} data={data} isLoading={loading} />
        </div>
        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-zinc-800">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ListingDetailsModal
        open={open}
        listing={selectedListing}
        onClose={() => {
          setOpen(false);
          setSelectedListing(null);
        }}
      />
    </>
  );
}
