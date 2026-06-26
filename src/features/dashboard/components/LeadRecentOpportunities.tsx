import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getSupabaseClient } from "@/lib/supabase";

interface Opportunity {
  id: string;
  title: string;
  status: string;
  applications_count: number;
  created_at: string;
}

export function LeadRecentOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpportunities() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("opportunities")
          .select("id, title, status, applications_count, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (!error && data) {
          setOpportunities(data);
        }
      } catch (err) {
        console.error("Failed to fetch recent opportunities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOpportunities();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
            Loading...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              No opportunities yet
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              Opportunities created by the admin will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell className="font-medium">{opportunity.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(opportunity.status)}>
                      {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{opportunity.applications_count ?? 0}</TableCell>
                  <TableCell>{formatDate(opportunity.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
