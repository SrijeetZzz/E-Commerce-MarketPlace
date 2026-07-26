import AdminGuard from "@/components/admin/guard/AdminGuard";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";

export default function AdminLayout({ children }: any) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">

        <AdminSidebar />

        <main className="flex-1 bg-gray-100 p-6">
          {children}
        </main>

      </div>
    </AdminGuard>
  );
}