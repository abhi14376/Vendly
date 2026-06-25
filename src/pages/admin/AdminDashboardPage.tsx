import { 
  BriefcaseBusiness, 
  Building2, 
  CircleHelp, 
  ShieldAlert, 
  Users 
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { mockOpportunities, mockUsers, mockLeadVerifications, mockVendorVerifications, mockAdminQueries } from "@/features/admin/utils/mockData";

export function AdminDashboardPage() {
  const totalLeads = mockUsers.filter(u => u.role === "lead").length;
  const totalVendors = mockUsers.filter(u => u.role === "vendor").length;
  const pendingVerifications = mockLeadVerifications.filter(v => v.status === "pending").length + mockVendorVerifications.filter(v => v.status === "pending").length;
  const liveOpportunities = mockOpportunities.filter(o => o.status === "Open").length;
  const openQueries = mockAdminQueries.filter(q => q.status === "open").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Platform overview and key performance indicators.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <Users className="mr-2 size-4 text-blue-500" />
            Total Leads
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalLeads}</div>
        </Card>
        
        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <Building2 className="mr-2 size-4 text-indigo-500" />
            Total Vendors
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalVendors}</div>
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <ShieldAlert className="mr-2 size-4 text-amber-500" />
            Pending Verifs
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{pendingVerifications}</div>
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <BriefcaseBusiness className="mr-2 size-4 text-emerald-500" />
            Live Opps
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{liveOpportunities}</div>
        </Card>

        <Card className="flex flex-col gap-2 p-4">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <CircleHelp className="mr-2 size-4 text-rose-500" />
            Open Queries
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{openQueries}</div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Verifications</h3>
          <div className="space-y-4">
            {mockLeadVerifications.slice(0, 3).map(lv => (
              <div key={lv.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{lv.companyName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Lead</p>
                </div>
                <div className={`rounded-full px-2 py-1 text-xs font-medium ${lv.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : lv.status === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"}`}>
                  {lv.status}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Queries</h3>
          <div className="space-y-4">
            {mockAdminQueries.slice(0, 3).map(q => (
              <div key={q.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{q.subject}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">By {q.senderName}</p>
                </div>
                <div className={`rounded-full px-2 py-1 text-xs font-medium ${q.status === "open" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : q.status === "answered" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                  {q.status}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
