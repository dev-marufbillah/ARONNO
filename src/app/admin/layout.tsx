import { requireAdmin } from "@/lib/auth-helpers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans antialiased text-neutral-900">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-8 items-start">
          <AdminSidebar user={user} />
          <main className="w-full min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}