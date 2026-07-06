import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminNavigation, superAdminNavigation } from "@/config/navigation";
import { useAuthStore } from "@/store/authStore";

export function AdminLayout() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const nav = currentUser?.role === "super_admin" ? superAdminNavigation : adminNavigation;
  const label = currentUser?.role === "super_admin" ? "Super Admin portal" : "Admin portal";
  
  return <DashboardLayout label={label} navigation={nav} variant="admin" />;
}
