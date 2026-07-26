"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { DashboardAnalytics } from "@/types/admin.dashboard";

interface Props {
  data: DashboardAnalytics["revenueTrend"];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function RevenueChart({ data }: Props) {
  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Performance
          </span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Revenue Trend
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          Revenue generated over time
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-4">
        <ChartContainer config={chartConfig} className="h-350px w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-slate-100 dark:stroke-zinc-800"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs font-medium text-slate-500 dark:text-zinc-400"
              tickFormatter={(value: string) => {
                const [, month] = value.split("-");
                return [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ][Number(month) - 1];
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs font-mono text-slate-500 dark:text-zinc-400"
              tickFormatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <ChartTooltip
              cursor={{ stroke: "rgba(0, 0, 0, 0.05)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
              }
            />

            <Line
              type="linear"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#2563eb",
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 6,
                fill: "#2563eb",
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}