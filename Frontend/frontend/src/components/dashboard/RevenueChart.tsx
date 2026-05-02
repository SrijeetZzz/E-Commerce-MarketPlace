"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getRevenueOverTime } from "@/services/dashboard";
import { RevenueOverTime } from "@/types/dashboard";

export default function RevenueChart({ range }: { range: string }) {
  const [data, setData] = useState<RevenueOverTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const result = await getRevenueOverTime(range);
        setData(result || []);
      } catch (err) {
        console.error("Revenue chart error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [range]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 hover:shadow-md transition-all duration-200">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Revenue Trend</h2>
        <p className="text-xs text-slate-500">
          Daily revenue performance for selected period
        </p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="h-65 flex items-center justify-center text-sm text-slate-400">
          Loading chart...
        </div>
      ) : data.length === 0 ? (
        <div className="h-65 flex items-center justify-center text-sm text-slate-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="99%" height={260}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            {/* GRID */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            {/* X AXIS */}
            <XAxis
              dataKey="_id"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              }
            />

            {/* Y AXIS */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />

            {/* TOOLTIP */}
            <Tooltip
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN")
              }
              formatter={(value) => {
                if (typeof value === "number") {
                  return `₹${value.toLocaleString()}`;
                }
                return value;
              }}
            />

            {/* LINE */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#16a34a" // green for revenue
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#16a34a",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
