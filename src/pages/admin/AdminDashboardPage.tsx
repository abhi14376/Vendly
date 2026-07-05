import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  ShieldAlert,
  Users
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getSupabaseClient } from "@/lib/supabase";

interface DashboardStats {
  totalLeads: number;
  totalVendors: number;
  pendingVerifications: number;
  liveOpportunities: number;
  openQueries: number;
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
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalVendors: 0,
    pendingVerifications: 0,
    liveOpportunities: 0,
    openQueries: 0,
  });
  const [recentProfiles, setRecentProfiles] = useState<RecentProfile[]>([]);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = getSupabaseClient();
      if (!supabase) { setLoading(false); return; }

      try {
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

        setStats({
          totalLeads: leadsRes.count ?? 0,
          totalVendors: vendorsRes.count ?? 0,
          pendingVerifications: pendingRes.count ?? 0,
          liveOpportunities: oppsRes.count ?? 0,
          openQueries: queriesRes.count ?? 0,
        });
        setRecentProfiles(recentProfilesRes.data ?? []);
        setRecentQueries((recentQueriesRes.data as any) ?? []);
      } catch (err) {
        console.error("Failed to fetch admin dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Leads", value: stats.totalLeads, icon: Users, color: "text-blue-500" },
    { label: "Total Vendors", value: stats.totalVendors, icon: Building2, color: "text-indigo-500" },
    { label: "Pending Verifs", value: stats.pendingVerifications, icon: ShieldAlert, color: "text-amber-500" },
    { label: "Live Opps", value: stats.liveOpportunities, icon: BriefcaseBusiness, color: "text-emerald-500" },
    { label: "Open Queries", value: stats.openQueries, icon: CircleHelp, color: "text-rose-500" },
  ];

  const emptyMessage = (label: string) => (
    <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">No {label} yet</p>
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Platform overview and key performance indicators.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.label} className="flex flex-col gap-2 p-4">
            <div className={`flex items-center text-sm font-medium text-slate-500 dark:text-slate-400`}>
              <card.icon className={`mr-2 size-4 ${card.color}`} />
              {card.label}
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {loading ? <span className="text-slate-300 dark:text-slate-600 animate-pulse">—</span> : card.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Registrations</h3>
          {loading ? (
            <p className="text-sm text-slate-400 py-4 text-center">Loading...</p>
          ) : recentProfiles.length === 0 ? emptyMessage("registrations") : (
            <div className="space-y-4">
              {recentProfiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{p.full_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{p.role} · {p.email}</p>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs font-medium ${
                    p.verification === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : p.verification === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                  }`}>
                    {p.verification}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Queries</h3>
          {loading ? (
            <p className="text-sm text-slate-400 py-4 text-center">Loading...</p>
          ) : recentQueries.length === 0 ? emptyMessage("queries") : (
            <div className="space-y-4">
              {recentQueries.map((q) => (
                <div key={q.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{q.subject}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">By {q.profiles?.full_name ?? "Unknown"}</p>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs font-medium ${
                    q.status === "open" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                    : q.status === "answered" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                    {q.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
