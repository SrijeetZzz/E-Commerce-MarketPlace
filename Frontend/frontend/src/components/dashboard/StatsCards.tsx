"use client";

import { 
  ShoppingBag, 
  IndianRupee, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardSummary } from "@/types/dashboard";

interface Props {
  data: DashboardSummary | null;
}

export default function StatsCards({ data }: Props) {
  if (!data) return null;

  const stats = [
    { 
      key: "orders", 
      label: "Total Orders", 
      value: data.totalOrders, 
      icon: ShoppingBag, 
      color: "from-blue-500/10 to-transparent",
      iconColor: "text-blue-600",
      border: "hover:border-blue-200"
    },
    { 
      key: "revenue", 
      label: "Revenue", 
      value: `₹${data.revenue.toLocaleString()}`, 
      icon: IndianRupee, 
      color: "from-emerald-500/10 to-transparent",
      iconColor: "text-emerald-600",
      border: "hover:border-emerald-200"
    },
    { 
      key: "aov", 
      label: "Avg. Value", 
      value: `₹${Math.round(data.aov).toLocaleString()}`, 
      icon: TrendingUp,
      color: "from-slate-500/10 to-transparent",
      iconColor: "text-slate-600",
      border: "hover:border-slate-300"
    },
    { 
      key: "listings", 
      label: "Active Items", 
      value: data.activeListings, 
      icon: Package,
      color: "from-purple-500/10 to-transparent",
      iconColor: "text-purple-600",
      border: "hover:border-purple-200"
    },
    { 
      key: "lowStock", 
      label: "Low Stock", 
      value: data.lowStockItems, 
      icon: AlertTriangle,
      color: data.lowStockItems > 0 ? "from-orange-500/10 to-transparent" : "from-slate-500/10 to-transparent",
      iconColor: data.lowStockItems > 0 ? "text-orange-600" : "text-slate-400",
      border: data.lowStockItems > 0 ? "hover:border-orange-200" : "hover:border-slate-300"
    },
  ];

  return (
    <div className="grid w-full gap-4 
      grid-cols-1          
      sm:grid-cols-2        
      md:grid-cols-3         
      lg:grid-cols-5        
      xl:grid-cols-5"       
    >
      {stats.map((s) => (
        <Card 
          key={s.key} 
          className="group relative overflow-hidden bg-white border-slate-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
        >
           {/* Card Content... */}
           <CardContent className="p-5">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-slate-50 ${s.iconColor}`}>
                  <s.icon className="h-5 w-5" />
                </div>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
             <h3 className="text-xl font-bold text-slate-900">{s.value}</h3>
           </CardContent>
        </Card>
      ))}
    </div>
  );
}