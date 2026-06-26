import { useEffect, useState } from "react";
import { BriefcaseBusiness, Building2, FileCheck2, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

interface KPIData {
  totalOpportunities: number;
  activeVendors: number;
  pendingApplications: number;
  newQueries: number;
}

export function LeadKPICards() {
  const [kpis, setKpis] = useState<KPIData>({
    totalOpportunities: 0,
    activeVendors: 0,
    pendingApplications: 0,
    newQueries: 0,
  });
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    async function fetchKPIs() {
      const supabase = getSupabaseClient();
      if (!supabase || !currentUser) {
        setLoading(false);
        return;
      }

      try {
        const [oppsResult, vendorsResult, appsResult, queriesResult] = await Promise.all([
          supabase.from("opportunities").select("id", { count: "exact", head: true }),
          supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "vendor").eq("is_active", true),
          supabase.from("applications").select("id", { count: "exact", head: true }).eq("applicant_id", currentUser.id).eq("status", "submitted"),
          supabase.from("queries").select("id", { count: "exact", head: true }).eq("created_by", currentUser.id).eq("status", "open"),
        ]);

        setKpis({
          totalOpportunities: oppsResult.count ?? 0,
          activeVendors: vendorsResult.count ?? 0,
          pendingApplications: appsResult.count ?? 0,
          newQueries: queriesResult.count ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard KPIs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchKPIs();
  }, [currentUser]);

  const cards = [
    {
      title: "Total Opportunities",
      value: kpis.totalOpportunities,
      icon: BriefcaseBusiness,
      description: "Available on platform",
    },
    {
      title: "Active Vendors",
      value: kpis.activeVendors,
      icon: Building2,
      description: "Registered vendors",
    },
    {
      title: "Pending Applications",
      value: kpis.pendingApplications,
      icon: FileCheck2,
      description: "Awaiting review",
    },
    {
      title: "New Queries",
      value: kpis.newQueries,
      icon: MessageSquareText,
      description: "Open queries",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <span className="text-slate-300 dark:text-slate-600 animate-pulse">—</span>
              ) : (
                card.value
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
