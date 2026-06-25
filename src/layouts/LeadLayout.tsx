import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { leadNavigation } from "@/config/navigation";

export function LeadLayout() {
  return <DashboardLayout label="Lead portal" navigation={leadNavigation} variant="lead" />;
}
