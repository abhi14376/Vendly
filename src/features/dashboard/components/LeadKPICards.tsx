import { BriefcaseBusiness, Building2, FileCheck2, MessageSquareText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { leadDashboardData } from "../mock/leadDashboardData";

export function LeadKPICards() {
  const { kpis } = leadDashboardData;

  const cards = [
    {
      title: "Total Opportunities",
      value: kpis.totalOpportunities,
      icon: BriefcaseBusiness,
      description: "+2 from last week",
      trend: "up",
    },
    {
      title: "Active Vendors",
      value: kpis.activeVendors,
      icon: Building2,
      description: "+14 from last month",
      trend: "up",
    },
    {
      title: "Pending Applications",
      value: kpis.pendingApplications,
      icon: FileCheck2,
      description: "Needs review",
      trend: "neutral",
    },
    {
      title: "New Queries",
      value: kpis.newQueries,
      icon: MessageSquareText,
      description: "Awaiting response",
      trend: "down",
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
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
