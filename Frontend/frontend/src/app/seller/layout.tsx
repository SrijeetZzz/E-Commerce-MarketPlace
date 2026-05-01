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
      href: "/seller/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Browse Products",
      href: "/seller/products",
      icon: PackageSearch,
    },
    {
      name: "My Listings",
      href: "/seller/listings",
      icon: ListOrdered,
    },
    {
      name: "My Orders",
      href: "/seller/orders",
      icon: ShoppingBag,
    },
    {
      name: "Profile",
      href: "/seller/profile",
      icon: User,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["SELLER"]}>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <aside className="w-65 border-r bg-white hidden md:flex flex-col p-6 sticky top-0 h-screen">
          <h2 className="text-xl font-black mb-8 px-4 tracking-tight">
            Seller Panel
          </h2>

          <nav className="space-y-2">
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
                  text-sm font-semibold transition-all
                  ${
                    active
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-10 max-w-350">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
