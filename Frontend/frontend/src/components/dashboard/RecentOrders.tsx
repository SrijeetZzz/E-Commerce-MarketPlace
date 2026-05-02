
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";

import { getRecentOrders } from "@/services/dashboard";
import { RecentOrder } from "@/types/dashboard";
import { useRouter } from "next/navigation";

/* ✅ FIXED: use classes instead of invalid variants */
const statusStyles: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
  PACKING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  NEW: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function RecentOrders() {
  const [data, setData] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const result = await getRecentOrders();
        setData(result || []);
      } catch (err) {
        console.error("Failed to fetch recent orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  return (
    <Card className="border-slate-200/60 shadow-sm bg-white overflow-hidden transition-all hover:shadow-md">
      
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold tracking-tight flex items-center gap-2 text-slate-900">
            <ShoppingCart className="h-4 w-4" />
            Recent Orders
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Review the latest transactions from your store.
          </CardDescription>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-slate-500 hover:text-slate-900"
          onClick={() => router.push("/seller/orders")}
        >
          View All
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="h-75 flex flex-col items-center justify-center text-center p-6">
            <p className="text-sm font-medium text-slate-900">
              No orders yet
            </p>
            <p className="text-xs text-slate-500">
              Your recent sales will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              
              {/* TABLE HEADER */}
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Order
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Product
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-right text-slate-500">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-right text-slate-500">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* TABLE BODY */}
              <TableBody>
                {data.map((order) => (
                  <TableRow
                    key={order._id}
                    className="group border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    
                    {/* ORDER */}
                    <TableCell className="py-4 font-mono text-xs font-semibold text-slate-500">
                      #{order.orderId.slice(-6).toUpperCase()}
                    </TableCell>

                    {/* PRODUCT */}
                    <TableCell className="py-4">
                      <span className="text-sm font-medium text-slate-900 line-clamp-1">
                        {order.productName}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>

                    {/* AMOUNT */}
                    <TableCell className="py-4 text-right font-semibold text-slate-900">
                      ₹{order.amount.toLocaleString()}
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="py-4 text-right text-xs font-medium text-slate-500">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}