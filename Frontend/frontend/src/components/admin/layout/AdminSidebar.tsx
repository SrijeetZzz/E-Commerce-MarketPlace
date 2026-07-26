
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  ShieldCheck,
  FolderTree,
  Package,
  Layers,
  ShoppingBag,
  RotateCcw,
  Truck,
  LucideIcon,
} from "lucide-react";

type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

type MenuSection = {
  section?: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    items: [
      { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    section: "User & Merchant Management",
    items: [
      { label: "Users", path: "/admin/users", icon: Users },
      { label: "Sellers", path: "/admin/sellers", icon: Store },
      { label: "KYC Verification", path: "/admin/kyc", icon: ShieldCheck },
    ],
  },
  {
    section: "Catalog & Products",
    items: [
      { label: "Category", path: "/admin/category", icon: FolderTree },
      { label: "Products", path: "/admin/products", icon: Package },
      { label: "Listings", path: "/admin/listings", icon: Layers },
    ],
  },
  {
    section: "Fulfillment & Operations",
    items: [
      { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
      { label: "Returns", path: "/admin/returns", icon: RotateCcw },
      { label: "Delivery", path: "/admin/delivery", icon: Truck },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-950 font-bold text-sm shadow-sm">
          W
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-white uppercase">
            WEARIX
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {menuSections.map((group, sectionIdx) => (
          <div key={sectionIdx} className="space-y-1">
            {group.section && (
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.section}
              </p>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.path ||
                (item.path !== "/admin" && pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100"
                  }`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 stroke-2 transition-colors ${
                      isActive
                        ? "text-slate-950"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800/80 p-4">
        <div className="flex items-center gap-2 rounded-lg bg-slate-900/60 p-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            System Operational
          </span>
        </div>
      </div>
    </aside>
  );
}