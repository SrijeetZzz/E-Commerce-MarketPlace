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
// import { maskAccountNumber } from "@/lib/admin";

// import {
//   getBankDetails,
//   verifyBank,
//   rejectBank,
// } from "@/services/admin";

// import { BankDetails } from "@/types/admin";

// export default function KycPage() {
//   const [data, setData] = useState<BankDetails[]>([]);
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

//       const response = await getBankDetails({
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
//       toast.error("Failed to load bank verification requests");
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

//   const handleVerify = async (id: string) => {
//     try {
//       await verifyBank(id);

//       toast.success("Bank details verified");

//       fetchData();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to verify bank details");
//     }
//   };

//   const handleReject = async (id: string) => {
//     const reason = prompt("Enter rejection reason");

//     if (!reason) return;

//     try {
//       await rejectBank(id, reason);

//       toast.success("Bank details rejected");

//       fetchData();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to reject bank details");
//     }
//   };

//   /* ---------------- TABLE ---------------- */

//   const columns = [
//     {
//       key: "seller",
//       label: "Seller",
//       render: (row: BankDetails) => row.sellerId?.name || "-",
//     },
//     {
//       key: "email",
//       label: "Email",
//       render: (row: BankDetails) => row.sellerId?.email || "-",
//     },
//     {
//       key: "accountHolder",
//       label: "Account Holder",
//       render: (row: BankDetails) => row.accountHolderName,
//     },
//     {
//       key: "ifsc",
//       label: "IFSC",
//       render: (row: BankDetails) => row.ifscCode,
//     },
//     {
//       key: "account",
//       label: "Account Number",
//       render: (row: BankDetails) =>
//         maskAccountNumber(row.accountNumber),
//     },
//     {
//       key: "status",
//       label: "Status",
//       render: (row: BankDetails) => (
//         <StatusBadge status={row.status} />
//       ),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (row: BankDetails) =>
//         row.status === "PENDING" ? (
//           <ActionButtons
//             onApprove={() => handleVerify(row._id)}
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
//           Bank KYC Verification
//         </h1>

//         <p className="text-sm text-slate-500">
//           Review and verify seller bank account details
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
//               label: "Verified",
//               value: "VERIFIED",
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
import { maskAccountNumber } from "@/lib/admin";

import { getBankDetails, verifyBank, rejectBank } from "@/services/admin";

import { BankDetails } from "@/types/admin";

export default function KycPage() {
  const [data, setData] = useState<BankDetails[]>([]);
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

      const response = await getBankDetails({
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
      toast.error("Failed to load bank verification requests");
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

  const handleVerify = async (id: string) => {
    try {
      await verifyBank(id);

      toast.success("Bank details verified");

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify bank details");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      await rejectBank(id, reason);

      toast.success("Bank details rejected");

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject bank details");
    }
  };

  /* ---------------- TABLE ---------------- */

  const columns = [
    {
      key: "seller",
      label: "Seller",
      render: (row: BankDetails) => {
        const name = row.sellerId?.name || "Unknown Seller";
        const initial = name.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/60">
              {initial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-slate-900 dark:text-zinc-100">
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
      render: (row: BankDetails) => (
        <span className="text-sm text-slate-600 dark:text-zinc-400">
          {row.sellerId?.email || "—"}
        </span>
      ),
    },
    {
      key: "accountHolder",
      label: "Account Holder",
      render: (row: BankDetails) => (
        <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
          {row.accountHolderName || "—"}
        </span>
      ),
    },
    {
      key: "ifsc",
      label: "IFSC Code",
      render: (row: BankDetails) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
          {row.ifscCode}
        </span>
      ),
    },
    {
      key: "account",
      label: "Account Number",
      render: (row: BankDetails) => (
        <span className="font-mono text-sm tracking-wider text-slate-700 dark:text-zinc-300">
          {maskAccountNumber(row.accountNumber)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: BankDetails) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: BankDetails) =>
        row.status === "PENDING" ? (
          <ActionButtons
            actions={[
              {
                label: "Approve",
                variant: "success",
                onClick: () => handleVerify(row._id),
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
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Verification Portal
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
          Bank KYC Verification
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Review, approve, or reject merchant bank account information for
          payouts.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-72">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search seller name or email..."
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
                  label: "Verified",
                  value: "VERIFIED",
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
  );
}
