"use client";

import Image from "next/image";
import { IndianRupee, Package } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { DashboardTables } from "@/types/admin.dashboard";
import { getImageUrl } from "@/lib/utils";

interface Props {
  data: DashboardTables["topProducts"];
}

export default function TopProductsTable({ data }: Props) {
  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Leaderboard
          </span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Top Products
        </CardTitle>

        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          Best selling products in the selected period
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-zinc-800/40">
            <TableRow className="border-b border-slate-100 dark:border-zinc-800">
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Product</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Units Sold</TableHead>
              <TableHead className="text-right text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Revenue
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-12 text-center text-sm text-slate-500 dark:text-zinc-400"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((product, index) => (
                <TableRow
                  key={product._id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/50 dark:border-zinc-800/80 dark:hover:bg-zinc-800/30"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-lg border border-slate-200/80 object-cover ring-1 ring-slate-100 dark:border-zinc-700 dark:ring-zinc-800"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800">
                          <Package className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <span className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                          {product.title}
                        </span>

                        {index < 3 && (
                          <Badge
                            variant="secondary"
                            className={`mt-1 w-fit text-[10px] font-bold tracking-wide uppercase ${
                              index === 0
                                ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300/60 dark:bg-amber-950/50 dark:text-amber-300"
                                : index === 1
                                ? "bg-slate-100 text-slate-800 ring-1 ring-slate-300/60 dark:bg-zinc-800 dark:text-zinc-200"
                                : "bg-orange-100 text-orange-800 ring-1 ring-orange-300/60 dark:bg-orange-950/50 dark:text-orange-300"
                            }`}
                          >
                            Top #{index + 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs font-medium text-slate-700 dark:text-zinc-300">
                      {product.totalSold} Sold
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-0.5 font-mono text-sm font-bold text-slate-900 dark:text-zinc-50">
                      <IndianRupee className="h-3.5 w-3.5 text-slate-500 dark:text-zinc-400" />
                      {product.revenue.toLocaleString("en-IN")}
                    </div>
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