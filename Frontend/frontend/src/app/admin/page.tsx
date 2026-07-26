"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  getDashboardStats,
  getDashboardAnalytics,
  getDashboardTables,
} from "@/services/admin.dashboard";

import {
  DashboardAnalytics,
  DashboardStats,
  DashboardTables,
} from "@/types/admin.dashboard";

import StatsGrid from "@/components/admin/dashboard/cards/StatsGrid";
import RevenueChart from "@/components/admin/dashboard/charts/RevenueChart";
import OrdersPieChart from "@/components/admin/dashboard/charts/OrdersPieChart";
import CategorySalesChart from "@/components/admin/dashboard/charts/CategorySalesChart";
import UserGrowthChart from "@/components/admin/dashboard/charts/UserGrowthChart";

import RecentOrdersTable from "@/components/admin/dashboard/tables/RecentOrdersTable";
import RecentUsersTable from "@/components/admin/dashboard/tables/RecentUsersTable";
import TopProductsTable from "@/components/admin/dashboard/tables/TopProductsTable";
import TopSellersTable from "@/components/admin/dashboard/tables/TopSellersTable";
import LowStockProductsTable from "@/components/admin/dashboard/tables/LowStockTable";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("30d");

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] =
    useState<DashboardAnalytics | null>(null);
  const [tables, setTables] =
    useState<DashboardTables | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [range]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        statsData,
        analyticsData,
        tablesData,
      ] = await Promise.all([
        getDashboardStats(range),
        getDashboardAnalytics(range),
        getDashboardTables(range),
      ]);

      setStats(statsData);
      setAnalytics(analyticsData);
      setTables(tablesData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-5 dark:border-zinc-800">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-8 w-56 rounded-md" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-28 rounded-xl border border-slate-100 dark:border-zinc-800"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-400px rounded-xl lg:col-span-2 border border-slate-100 dark:border-zinc-800" />
          <Skeleton className="h-400px rounded-xl border border-slate-100 dark:border-zinc-800" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-400px rounded-xl border border-slate-100 dark:border-zinc-800" />
          <Skeleton className="h-400px rounded-xl border border-slate-100 dark:border-zinc-800" />
        </div>
      </div>
    );
  }

  if (!stats || !analytics || !tables) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
        <div className="rounded-full bg-slate-100 p-3 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
          ⚠️
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Marketplace Analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 sm:text-3xl">
            Executive Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Real-time platform metrics, financial performance, and fulfillment status.
          </p>
        </div>

        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-180px rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="dark:border-zinc-700 dark:bg-zinc-800">
            <SelectItem value="7d" className="text-xs font-medium">
              Last 7 Days
            </SelectItem>
            <SelectItem value="30d" className="text-xs font-medium">
              Last 30 Days
            </SelectItem>
            <SelectItem value="6m" className="text-xs font-medium">
              Last 6 Months
            </SelectItem>
            <SelectItem value="1y" className="text-xs font-medium">
              Last 1 Year
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Primary Metrics Grid */}
      <StatsGrid stats={stats} />

      {/* Revenue Trend & Order Status Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RevenueChart data={analytics.revenueTrend} />
        </div>

        <div className="min-w-0">
          <OrdersPieChart data={analytics.orderStatus} />
        </div>
      </div>

      {/* Category Distribution & User Growth */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <CategorySalesChart data={analytics.categorySales} />
        </div>

        <div className="min-w-0">
          <UserGrowthChart data={analytics.userGrowth} />
        </div>
      </div>

      {/* Recent Orders & Users Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrdersTable data={tables.recentOrders} />
        <RecentUsersTable data={tables.recentUsers} />
      </div>

      {/* Top Products & Top Sellers Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopProductsTable data={tables.topProducts} />
        <TopSellersTable data={tables.topSellers} />
      </div>

      {/* Low Stock Alerts Table */}
      <LowStockProductsTable data={tables.lowStockProducts} />
    </div>
  );
}