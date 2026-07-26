
"use client";

import {
  Pie,
  PieChart,
  Cell,
} from "recharts";

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { DashboardAnalytics } from "@/types/admin.dashboard";

interface Props {
  data: DashboardAnalytics["orderStatus"];
}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#9333ea",
  "#0891b2",
];

const chartConfig = {
  value: {
    label: "Orders",
  },
} satisfies ChartConfig;

export default function OrderStatusChart({
  data,
}: Props) {
  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Fulfillment Breakdown
          </span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Order Status
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          Distribution of all orders
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-350px min-h-350px"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _, item) => [
                    `${Number(value).toLocaleString("en-IN")} Orders`,
                    item.payload.status,
                  ]}
                />
              }
            />

            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={2}
              strokeWidth={2}
              className="stroke-white dark:stroke-zinc-900"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.status}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>

            <ChartLegend
              content={<ChartLegendContent />}
              className="flex-wrap justify-center gap-3 pt-4 text-xs"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}