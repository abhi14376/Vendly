import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  ShieldAlert,
  Users,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

interface DashboardStats {
  totalLeads: number;
  totalVendors: number;
  pendingVerifications: number;
  liveOpportunities: number;
  openQueries: number;
  totalOppsCreated: number;
  totalOppsApplied: number;
  totalOppsFinalised: number;
}

interface RecentProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  verification: string;
  created_at: string;
}

interface RecentQuery {
  id: string;
  subject: string;
  status: string;
  profiles: { full_name: string } | null;
}

export function AdminDashboardPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalVendors: 0,
    pendingVerifications: 0,
    liveOpportunities: 0,
    openQueries: 0,
    totalOppsCreated: 0,
    totalOppsApplied: 0,
    totalOppsFinalised: 0,
  });
  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>([]);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = getSupabaseClient();
      if (!supabase) { setLoading(false); return; }

      try {
        if (isSuperAdmin) {
          const [
            leadsRes,
            vendorsRes,
            pendingRes,
            oppsRes,
            queriesRes,
            recentProfilesRes,
            recentQueriesRes,
          ] = await Promise.all([
            supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "lead"),
            supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "vendor"),
            supabase.from("profiles").select("id", { count: "exact", head: true }).eq("verification", "pending"),
            supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("status", "published"),
            supabase.from("queries").select("id", { count: "exact", head: true }).eq("status", "open"),
            supabase.from("profiles").select("id, full_name, email, role, verification, created_at")
              .neq("role", "admin").order("created_at", { ascending: false }).limit(3),
            supabase.from("queries").select("id, subject, status, profiles(full_name)")
              .order("created_at", { ascending: false }).limit(3),
          ]);

          setStats((prev) => ({
            ...prev,
            totalLeads: leadsRes.count ?? 0,
            totalVendors: vendorsRes.count ?? 0,
            pendingVerifications: pendingRes.count ?? 0,
            liveOpportunities: oppsRes.count ?? 0,
            openQueries: queriesRes.count ?? 0,
          }));
          setRecentProfiles(recentProfilesRes.data ?? []);
          setRecentQueries((recentQueriesRes.data as any) ?? []);
        } else {
          const [
            allOppsRes,
            awardedOppsRes,
          ] = await Promise.all([
            supabase.from("opportunities").select("id", { count: "exact", head: true }),
            supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("status", "Awarded"),
          ]);

          const mockTotalApplied = Math.floor((allOppsRes.count ?? 0) * 3.5);

          setStats((prev) => ({
            ...prev,
            totalOppsCreated: allOppsRes.count ?? 0,
            totalOppsApplied: mockTotalApplied,
            totalOppsFinalised: awardedOppsRes.count ?? 0,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [isSuperAdmin]);

  const superAdminCards = [
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "text-blue-500" },
    { label: "Total Vendors", value: stats.totalVendors, icon: Building2, color: "text-indigo-500" },
    { label: "Pending Verifs", value: stats.pendingVerifications, icon: ShieldAlert, color: "text-amber-500" },
    { label: "Live Opps", value: stats.liveOpportunities, icon: BriefcaseBusiness, color: "text-emerald-500" },
    { label: "Open Queries", value: stats.openQueries, icon: CircleHelp, color: "text-rose-500" },
  ];

  const adminCards = [
    { label: "Total Opportunities Created", value: stats.totalOppsCreated, icon: BriefcaseBusiness, color: "text-blue-500" },
    { label: "Total Applied", value: stats.totalOppsApplied, icon: FileText, color: "text-indigo-500" },
    { label: "Total Finalised", value: stats.totalOppsFinalised, icon: CheckCircle2, color: "text-emerald-500" },
  ];

  const statCards = isSuperAdmin ? superAdminCards : adminCards;

  const emptyMessage = (label: string) => (
    <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-sm text-slate-500 dark:text-slate-400">No {label.toLowerCase()} found.</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600 dark:border-slate-800 dark:border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isSuperAdmin ? "Super Admin Dashboard" : "Admin Overview"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {isSuperAdmin ? "System-wide metrics and pending verifications." : "Quick overview of platform opportunities."}
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-${isSuperAdmin ? '5' : '3'}`}>
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isSuperAdmin && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">Recent Registrations</h2>
            </div>
            <div className="flex-1 p-6">
              {recentProfiles.length > 0 ? (
                <div className="space-y-4">
                  {recentProfiles.map((profile) => (
                    <div key={profile.id} className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {profile.full_name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {profile.full_name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {profile.email} • {profile.role}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        profile.verification === "approved"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : profile.verification === "rejected"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      }`}>
                        {profile.verification}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                emptyMessage("recent registrations")
              )}
            </div>
          </Card>

          <Card className="flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">Recent Queries</h2>
            </div>
            <div className="flex-1 p-6">
              {recentQueries.length > 0 ? (
                <div className="space-y-4">
                  {recentQueries.map((query) => (
                    <div key={query.id} className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                          {query.subject}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          From: {query.profiles?.full_name || "Unknown"}
                        </p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        query.status === "open"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      }`}>
                        {query.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                emptyMessage("recent queries")
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
