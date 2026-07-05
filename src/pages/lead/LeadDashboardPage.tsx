import { LeadKPICards } from "@/features/dashboard/components/LeadKPICards";
import { LeadRecentOpportunities } from "@/features/dashboard/components/LeadRecentOpportunities";
import { LeadQuickActions } from "@/features/dashboard/components/LeadQuickActions";
import { LeadNotificationsPanel } from "@/features/dashboard/components/LeadNotificationsPanel";
import { LeadMatchedVendors } from "@/features/dashboard/components/LeadMatchedVendors";

export function LeadDashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Dashboard
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back. Here's an overview of your opportunities and vendors.
        </p>
      </header>

      <LeadKPICards />

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        <div className="space-y-6 md:col-span-4 lg:col-span-5">
          <LeadRecentOpportunities />
          <LeadMatchedVendors />
          <LeadNotificationsPanel />
        </div>
        <div className="md:col-span-3 lg:col-span-2">
          <LeadQuickActions />
        </div>
      </div>
    </div>
  );
}

