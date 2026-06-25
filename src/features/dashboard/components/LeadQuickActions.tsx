import { Users, FileCheck2, Settings, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useNavigate } from "react-router";

export function LeadQuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Vendor Directory",
      description: "Browse the directory and manage registered vendors.",
      icon: Users,
      path: "/dashboard/vendors",
      iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
      hoverBg: "hover:border-indigo-200 dark:hover:border-indigo-850",
    },
    {
      label: "Review Applications",
      description: "Monitor applications submitted for your opportunities.",
      icon: FileCheck2,
      path: "/dashboard/applied-projects",
      iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
      hoverBg: "hover:border-emerald-200 dark:hover:border-emerald-850",
    },
    {
      label: "Settings & Profile",
      description: "Update profile photo, mobile, and address details.",
      icon: Settings,
      path: "/dashboard/settings",
      iconBg: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
      hoverBg: "hover:border-purple-200 dark:hover:border-purple-850",
    },
  ];

  return (
    <Card className="border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
        <CardDescription>Commonly used operations and links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        {actions.map((action) => (
          <div
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`group flex items-start gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 cursor-pointer transition-all duration-300 ${action.hoverBg} hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className={`p-2.5 rounded-xl transition-all duration-305 group-hover:scale-110 ${action.iconBg}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {action.label}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                {action.description}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
