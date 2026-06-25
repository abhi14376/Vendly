import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminNavigation } from "@/config/navigation";

export function AdminLayout() {
  return <DashboardLayout label="Admin portal" navigation={adminNavigation} variant="admin" />;
}
