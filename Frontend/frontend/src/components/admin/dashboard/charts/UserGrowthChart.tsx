"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
} from "@/components/ui/chart";

import { DashboardAnalytics } from "@/types/admin.dashboard";

interface Props {
  data: DashboardAnalytics["userGrowth"];
}

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function UserGrowthChart({
  data,
}: Props) {
  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Acquisition
          </span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          User Growth
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-zinc-400">
          New users registered over time
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-4">
        <ChartContainer
          config={chartConfig}
          className="h-350px w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient
                id="fillUsers"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

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
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  "en-IN",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
              }
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              className="text-xs font-mono text-slate-500 dark:text-zinc-400"
            />

            <ChartTooltip
              cursor={{ stroke: "rgba(0, 0, 0, 0.05)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    Number(value),
                    "Users",
                  ]}
                />
              }
            />

            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--color-users)"
              fill="url(#fillUsers)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}