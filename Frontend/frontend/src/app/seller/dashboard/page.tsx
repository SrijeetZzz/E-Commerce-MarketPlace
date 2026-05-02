"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import StatsCards from "@/components/dashboard/StatsCards";
import OrdersChart from "@/components/dashboard/OrdersChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopProducts from "@/components/dashboard/TopProducts";
import RecentOrders from "@/components/dashboard/RecentOrders";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, LayoutDashboard } from "lucide-react";

export default function SellerDashboard() {
  const [range, setRange] = useState("this_month");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(`/seller/dashboard/summary?range=${range}`);
        setSummary(res.data.data);
      } catch (err) {
        console.error("Dashboard summary fetch failed", err);
      }
    };

    fetchSummary();
  }, [range]);

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-slate-900 rounded-md">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Overview
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            Manage your store performance and track sales metrics.
          </p>
        </div>

        {/* RANGE SWITCHER */}
        <div className="flex flex-col gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto">
          {/* ICON + LABEL */}
          <div className="flex items-center gap-2 px-1">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-500">Time Range</span>
          </div>

          {/* SCROLLABLE TABS */}
          <Tabs value={range} onValueChange={setRange}>
            <div className="w-full overflow-x-auto overflow-y-hidden">
              <TabsList className="bg-transparent border-none flex gap-1 min-w-max">
                <TabsTrigger
                  value="this_month"
                  className="text-xs px-3 whitespace-nowrap"
                >
                  This Month
                </TabsTrigger>

                <TabsTrigger
                  value="last_month"
                  className="text-xs px-3 whitespace-nowrap"
                >
                  Last Month
                </TabsTrigger>

                <TabsTrigger
                  value="last_3_months"
                  className="text-xs px-3 whitespace-nowrap"
                >
                  3 Months
                </TabsTrigger>

                <TabsTrigger
                  value="last_6_months"
                  className="text-xs px-3 whitespace-nowrap"
                >
                  6 Months
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>

      {/* STATS */}
      <section>
        <StatsCards data={summary} />
      </section>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart range={range} />
        <RevenueChart range={range} />
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col gap-6">
        <TopProducts range={range} />
        <RecentOrders />
      </div>
    </div>
  );
}
