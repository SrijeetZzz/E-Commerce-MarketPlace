"use client";

import { format } from "date-fns";

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
  data: DashboardTables["recentOrders"];
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "default";

    case "DELIVERED":
      return "secondary";

    case "SHIPPED":
      return "outline";

    case "CANCELLED":
      return "destructive";

    default:
      return "outline";
  }
};

export default function RecentOrdersTable({
  data,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Fulfillment
          </span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Recent Orders
        </CardTitle>

        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          Latest orders placed on the marketplace
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/40">
            <TableRow className="border-b border-slate-100 dark:border-zinc-800">
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Order</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Buyer</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Items</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-slate-500 dark:text-zinc-400"
                >
                  No recent orders found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((order) => (
                <TableRow
                  key={order._id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30"
                >
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-800 dark:bg-zinc-800 dark:text-zinc-200">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                        {order.buyerName}
                      </span>

                      <span className="truncate text-xs text-slate-500 dark:text-zinc-400">
                        {order.buyerEmail}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 dark:text-zinc-400">
                    {order.totalItems} {order.totalItems === 1 ? "item" : "items"}
                  </TableCell>

                  <TableCell className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-50">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={getStatusVariant(order.status)}
                      className="text-[11px] font-semibold"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 dark:text-zinc-400">
                    {format(
                      new Date(order.createdAt),
                      "dd MMM yyyy"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}