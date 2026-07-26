// "use client";

// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// import DataTable from "@/components/admin/tables/DataTable";
// import Pagination from "@/components/admin/tables/Pagination";

// import SearchInput from "@/components/admin/inputs/SearchInput";
// import FilterSelect from "@/components/admin/inputs/FilterSelect";
// import SortSelect from "@/components/admin/inputs/SortSelect";

// import StatusBadge from "@/components/admin/ui/StatusBadge";
// import ActionButtons from "@/components/admin/ui/ActionButtons";

// import { commonSortOptions } from "@/lib/sortOptions";

// import {
//   getSellerApplications,
//   approveSellerApplication,
//   rejectSellerApplication,
// } from "@/services/admin";

// import { SellerApplication } from "@/types/admin";

// export default function SellersPage() {
//   const [data, setData] = useState<SellerApplication[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");
//   const [sort, setSort] = useState("latest");

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   /* ---------------- FETCH ---------------- */

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const response = await getSellerApplications({
//         page,
//         limit: 10,
//         search,
//         status,
//         sort,
//       });

//       setData(response.data);
//       setTotalPages(response.pagination.pages);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load seller applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [page, search, status, sort]);

//   useEffect(() => {
//     setPage(1);
//   }, [search, status, sort]);

//   /* ---------------- ACTIONS ---------------- */

//   const handleApprove = async (id: string) => {
//     try {
//       await approveSellerApplication(id);

//       toast.success("Seller application approved");

//       fetchData();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to approve seller");
//     }
//   };

//   const handleReject = async (id: string) => {
//     const reason = prompt("Enter rejection reason");

//     if (!reason) return;

//     try {
//       await rejectSellerApplication(id, reason);

//       toast.success("Seller application rejected");

//       fetchData();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reject seller");
//     }
//   };

//   /* ---------------- TABLE ---------------- */

//   const columns = [
//     {
//       key: "name",
//       label: "Seller",
//       render: (row: SellerApplication) => row.userId?.name || "-",
//     },
//     {
//       key: "email",
//       label: "Email",
//       render: (row: SellerApplication) => row.userId?.email || "-",
//     },
//     {
//       key: "businessName",
//       label: "Business",
//     },
//     {
//       key: "location",
//       label: "Location",
//       render: (row: SellerApplication) =>
//         [row.city, row.state].filter(Boolean).join(", ") || "-",
//     },
//     {
//       key: "status",
//       label: "Status",
//       render: (row: SellerApplication) => (
//         <StatusBadge status={row.status} />
//       ),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (row: SellerApplication) =>
//         row.status === "PENDING" ? (
//           <ActionButtons
//             onApprove={() => handleApprove(row._id)}
//             onReject={() => handleReject(row._id)}
//           />
//         ) : (
//           <span className="text-xs text-slate-400">
//             No actions
//           </span>
//         ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}

//       <div>
//         <h1 className="text-xl font-semibold">
//           Seller Applications
//         </h1>

//         <p className="text-sm text-slate-500">
//           Review and manage seller onboarding requests
//         </p>
//       </div>

//       {/* Filters */}

//       <div className="flex flex-wrap items-center gap-4">
//         <SearchInput
//           value={search}
//           onChange={setSearch}
//           placeholder="Search seller..."
//         />

//         <FilterSelect
//           value={status}
//           onChange={setStatus}
//           placeholder="All Status"
//           options={[
//             {
//               label: "Pending",
//               value: "PENDING",
//             },
//             {
//               label: "Approved",
//               value: "APPROVED",
//             },
//             {
//               label: "Rejected",
//               value: "REJECTED",
//             },
//           ]}
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
//         data={data}
//         isLoading={loading}
//       />

//       {/* Pagination */}

//       <Pagination
//         page={page}
//         totalPages={totalPages}
//         onPageChange={setPage}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DataTable from "@/components/admin/tables/DataTable";
import Pagination from "@/components/admin/tables/Pagination";

import SearchInput from "@/components/admin/inputs/SearchInput";
import FilterSelect from "@/components/admin/inputs/FilterSelect";
import SortSelect from "@/components/admin/inputs/SortSelect";

import StatusBadge from "@/components/admin/ui/StatusBadge";
import ActionButtons from "@/components/admin/ui/ActionButtons";

import { commonSortOptions } from "@/lib/sortOptions";

import {
  getSellerApplications,
  approveSellerApplication,
  rejectSellerApplication,
} from "@/services/admin";

import { SellerApplication } from "@/types/admin";

export default function SellersPage() {
  const [data, setData] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await getSellerApplications({
        page,
        limit: 10,
        search,
        status,
        sort,
      });

      setData(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load seller applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, status, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  /* ---------------- ACTIONS ---------------- */

  const handleApprove = async (id: string) => {
    try {
      await approveSellerApplication(id);

      toast.success("Seller application approved");

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve seller");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      await rejectSellerApplication(id, reason);

      toast.success("Seller application rejected");

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject seller");
    }
  };

  /* ---------------- TABLE ---------------- */

  const columns = [
    {
      key: "name",
      label: "Seller",
      render: (row: SellerApplication) => {
        const name = row.userId?.name || "Applicant";
        const initial = name.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/80">
              {initial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                {name}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (row: SellerApplication) => (
        <span className="text-sm text-slate-600 dark:text-zinc-400">
          {row.userId?.email || "—"}
        </span>
      ),
    },
    {
      key: "businessName",
      label: "Business Name",
      render: (row: SellerApplication) => (
        <span className="font-medium text-sm text-slate-800 dark:text-zinc-200">
          {row.businessName || "—"}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row: SellerApplication) => {
        const locationStr = [row.city, row.state].filter(Boolean).join(", ");
        return (
          <span className="text-sm text-slate-600 dark:text-zinc-400">
            {locationStr || "—"}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: SellerApplication) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: SellerApplication) =>
        row.status === "PENDING" ? (
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
            No actions
          </span>
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Merchant Portal
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
          Seller Applications
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Review, approve, or reject new merchant onboarding requests.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, business, email..."
            />
          </div>

          <div className="flex items-center gap-3">
            <FilterSelect
              value={status}
              onChange={setStatus}
              placeholder="All Status"
              options={[
                {
                  label: "Pending",
                  value: "PENDING",
                },
                {
                  label: "Approved",
                  value: "APPROVED",
                },
                {
                  label: "Rejected",
                  value: "REJECTED",
                },
              ]}
            />

            <SortSelect
              value={sort}
              onChange={setSort}
              options={commonSortOptions}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <DataTable
          columns={columns}
          data={data}
          isLoading={loading}
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
    </div>
  );
}