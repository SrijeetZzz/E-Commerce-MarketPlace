"use client";

import { format } from "date-fns";
import { Shield, Store, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DashboardTables } from "@/types/admin.dashboard";

interface Props {
  data: DashboardTables["recentUsers"];
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "ADMIN":
      return <Shield className="h-3.5 w-3.5 text-rose-500" />;

    case "SELLER":
      return <Store className="h-3.5 w-3.5 text-blue-500" />;

    default:
      return <User className="h-3.5 w-3.5 text-emerald-500" />;
  }
};

export default function RecentUsersTable({ data }: Props) {
  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Accounts
          </span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Recent Users
        </CardTitle>

        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          Latest registered users
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/40">
            <TableRow className="border-b border-slate-100 dark:border-zinc-800">
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">User</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Role</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Verified</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Joined</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-slate-500 dark:text-zinc-400"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => {
                const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

                return (
                  <TableRow
                    key={user._id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/60 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/60">
                          {initial}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                            {user.name}
                          </span>

                          <span className="truncate text-xs text-slate-500 dark:text-zinc-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300">
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          user.isVerified
                            ? "default"
                            : "secondary"
                        }
                        className="text-[11px] font-semibold"
                      >
                        {user.isVerified
                          ? "Verified"
                          : "Pending"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          user.isActive
                            ? "default"
                            : "destructive"
                        }
                        className="text-[11px] font-semibold"
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 dark:text-zinc-400">
                      {format(
                        new Date(user.createdAt),
                        "dd MMM yyyy"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}