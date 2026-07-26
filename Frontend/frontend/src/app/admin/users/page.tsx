
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
import UserDetailsModal from "@/components/admin/users/UserDetailsModal";

import { commonSortOptions } from "@/lib/sortOptions";

import {
  getUsers,
  getUserById,
  updateUserStatus,
} from "@/services/admin";

import { User } from "@/types/admin";
import { getImageUrl } from "@/lib/utils";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await getUsers({
        page,
        limit: 10,
        search,
        role,
        isActive,
        sort,
      });

      setData(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, role, isActive, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, role, isActive, sort]);

  /* ---------------- ACTIONS ---------------- */

  const handleView = async (id: string) => {
    try {
      const response = await getUserById(id);

      setSelectedUser(response.data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user details");
    }
  };

  const handleStatusToggle = async (user: User) => {
    try {
      await updateUserStatus(user._id, {
        isActive: !user.isActive,
      });

      toast.success(
        `User ${
          user.isActive ? "deactivated" : "activated"
        } successfully`
      );

      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };

  /* ---------------- TABLE ---------------- */

  const columns = [
    {
      key: "name",
      label: "User",
      render: (row: User) => {
        const initial = row.name ? row.name.charAt(0).toUpperCase() : "U";

        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/60">
              {row.avatar ? (
                <img src={getImageUrl(row.avatar)}
                  alt={row.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="truncate font-semibold text-sm text-slate-900 dark:text-zinc-100">
                {row.name}
              </span>

              <span className="truncate text-xs text-slate-500 dark:text-zinc-400">
                {row.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      render: (row: User) => (
        <span className="text-sm text-slate-600 dark:text-zinc-400">
          {row.email}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row: User) => (
        <span className="font-mono text-xs text-slate-700 dark:text-zinc-300">
          {row.addresses?.find((a) => a.isDefault)?.phone ?? "—"}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row: User) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
          {row.role}
        </span>
      ),
    },
    {
      key: "verified",
      label: "Verified",
      render: (row: User) => (
        <StatusBadge
          status={
            row.isVerified
              ? "VERIFIED"
              : "UNVERIFIED"
          }
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: User) => (
        <StatusBadge
          status={
            row.isActive
              ? "ACTIVE"
              : "INACTIVE"
          }
        />
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (row: User) => (
        <span className="text-xs text-slate-600 dark:text-zinc-400">
          {new Date(row.createdAt).toLocaleDateString("en-IN", {
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
      render: (row: User) => (
        <ActionButtons
          actions={[
            {
              label: "View",
              variant: "primary",
              onClick: () => handleView(row._id),
            },
            {
              label: row.isActive
                ? "Deactivate"
                : "Activate",
              variant: row.isActive
                ? "danger"
                : "success",
              onClick: () =>
                handleStatusToggle(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">

        {/* Header */}

        <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              User Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
            Users
          </h1>

          <p className="text-sm text-slate-500 dark:text-zinc-400">
            View and manage all registered marketplace accounts and permissions.
          </p>
        </div>

        {/* Filters */}

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">

            <div className="w-full sm:w-72">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email..."
              />
            </div>

            <div className="flex flex-wrap gap-3">

              <FilterSelect
                value={role}
                onChange={setRole}
                placeholder="All Roles"
                options={[
                  {
                    label: "Buyer",
                    value: "BUYER",
                  },
                  {
                    label: "Seller",
                    value: "SELLER",
                  },
                  {
                    label: "Admin",
                    value: "ADMIN",
                  },
                  {
                    label: "Agent",
                    value: "AGENT",
                  },
                ]}
              />

              <FilterSelect
                value={isActive}
                onChange={setIsActive}
                placeholder="All Status"
                options={[
                  {
                    label: "Active",
                    value: "true",
                  },
                  {
                    label: "Inactive",
                    value: "false",
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

        {/* Table */}

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

      {/* User Details Modal */}

      <UserDetailsModal
        open={showModal}
        user={selectedUser}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
      />
    </>
  );
}