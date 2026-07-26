"use client";

import { AlertTriangle } from "lucide-react";

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
  data: DashboardTables["lowStockProducts"];
}

const getStockVariant = (stock: number) => {
  if (stock <= 5) return "destructive";
  if (stock <= 10) return "secondary";
  return "outline";
};

const getStockLabel = (stock: number) => {
  if (stock <= 5) return "Critical";
  if (stock <= 10) return "Low";
  return "Available";
};

export default function LowStockProductsTable({
  data,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Inventory Warning
          </span>
        </div>
        <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          <AlertTriangle className="h-4 w-4 text-amber-500 stroke-[2.5]" />
          Low Stock Products
        </CardTitle>

        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          Products that require inventory replenishment
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/40">
            <TableRow className="border-b border-slate-100 dark:border-zinc-800">
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Product</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Seller</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Price</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Stock</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-sm text-slate-500 dark:text-zinc-400"
                >
                  🎉 No low stock products found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((product) => (
                <TableRow
                  key={product._id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30"
                >
                  <TableCell className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {product.title}
                  </TableCell>

                  <TableCell className="text-sm text-slate-600 dark:text-zinc-400">
                    {product.seller}
                  </TableCell>

                  <TableCell className="font-mono text-sm font-bold text-slate-900 dark:text-zinc-50">
                    ₹{product.price.toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`font-mono text-sm font-bold ${
                        product.stock <= 5
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={getStockVariant(product.stock)}
                      className="text-[11px] font-semibold"
                    >
                      {getStockLabel(product.stock)}
                    </Badge>
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