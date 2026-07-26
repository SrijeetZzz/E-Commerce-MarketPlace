// import {
//   Users,
//   Store,
//   Package,
//   ShoppingCart,
//   IndianRupee,
//   ShieldCheck,
// } from "lucide-react";

// import { DashboardStats } from "@/types/admin.dashboard";
// import StatCard from "./StatCard";

// interface Props {
//   stats: DashboardStats;
// }

// export default function StatsGrid({ stats }: Props) {
//   const cards = [
//     {
//       title: "Total Users",
//       value: stats.totalUsers.toLocaleString("en-IN"),
//       icon: Users,
//       color: "bg-blue-100",
//       iconColor: "text-blue-600",
//     },
//     {
//       title: "Total Sellers",
//       value: stats.totalSellers.toLocaleString("en-IN"),
//       icon: Store,
//       color: "bg-green-100",
//       iconColor: "text-green-600",
//     },
//     {
//       title: "Total Products",
//       value: stats.totalProducts.toLocaleString("en-IN"),
//       icon: Package,
//       color: "bg-purple-100",
//       iconColor: "text-purple-600",
//     },
//     {
//       title: "Total Orders",
//       value: stats.totalOrders.toLocaleString("en-IN"),
//       icon: ShoppingCart,
//       color: "bg-orange-100",
//       iconColor: "text-orange-600",
//     },
//     {
//       title: "Total Revenue",
//       value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
//       icon: IndianRupee,
//       color: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//     {
//       title: "Pending KYC",
//       value: stats.pendingKyc.toLocaleString("en-IN"),
//       icon: ShieldCheck,
//       color: "bg-red-100",
//       iconColor: "text-red-600",
//     },
//   ];

//   return (
//     <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
//       {cards.map((card) => {
//         const Icon = card.icon;

//         return (
//           <StatCard
//             key={card.title}
//             title={card.title}
//             value={card.value}
//             icon={<Icon className={`h-7 w-7 ${card.iconColor}`} />}
//             iconBg={card.color}
//           />
//         );
//       })}
//     </div>
//   );
// }

import {
  Users,
  Store,
  Package,
  ShoppingCart,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

import { DashboardStats } from "@/types/admin.dashboard";
import StatCard from "./StatCard";

interface Props {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: Props) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString("en-IN"),
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Sellers",
      value: stats.totalSellers.toLocaleString("en-IN"),
      icon: Store,
      color: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString("en-IN"),
      icon: Package,
      color: "bg-purple-50 dark:bg-purple-950/40",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      icon: ShoppingCart,
      color: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-teal-50 dark:bg-teal-950/40",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
    {
      title: "Pending KYC",
      value: stats.pendingKyc.toLocaleString("en-IN"),
      icon: ShieldCheck,
      color: "bg-rose-50 dark:bg-rose-950/40",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={<Icon className={`h-6 w-6 stroke-[2.2] ${card.iconColor}`} />}
            iconBg={card.color}
          />
        );
      })}
    </div>
  );
}