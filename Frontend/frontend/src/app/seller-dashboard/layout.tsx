

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  ListOrdered,
  ShoppingBag,
  User,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
  {
    name: "Dashboard",
    href: "/seller-dashboard/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Browse Products",
    href: "/seller-dashboard/products",
    icon: PackageSearch,
  },
  {
    name: "My Listings",
    href: "/seller-dashboard/listings",
    icon: ListOrdered,
  },
  {
    name: "My Orders",
    href: "/seller-dashboard/orders",
    icon: ShoppingBag,
  },
  {
    name: "Profile",
    href: "/seller-dashboard/profile",
    icon: User,
  },
];

  return (
    <ProtectedRoute allowedRoles={["SELLER"]}>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar - Deep Black Background */}
        <aside className="w-64 bg-black hidden md:flex flex-col sticky top-0 h-screen">
          <div className="p-6">
            <h2 className="text-xl font-black mb-8 px-2 tracking-tight text-white">
             Seller Panel
            </h2>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3
                      rounded-xl px-4 py-3
                      text-sm font-bold transition-all duration-200
                      ${
                        active
                          ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
                          : "text-slate-400 hover:bg-zinc-900 hover:text-white"
                      }
                    `}
                  >
                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Section */}
          <div className="mt-auto p-6 border-t border-zinc-900">
            <div className="px-2">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                Verified Partner
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
