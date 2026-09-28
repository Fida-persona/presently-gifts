import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminRequest())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-cream-100/40">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden px-6 py-8 sm:px-10">{children}</div>
    </div>
  );
}
