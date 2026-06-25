import { Bell, MessageSquareText, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { leadDashboardData } from "../mock/leadDashboardData";

export function LeadNotificationsPanel() {
  const { notifications } = leadDashboardData;

  const getIconForType = (type: string) => {
    switch (type) {
      case "application":
        return <Bell className="h-4 w-4 text-primary-500" />;
      case "query":
        return <MessageSquareText className="h-4 w-4 text-warning-500" />;
      case "system":
        return <ShieldAlert className="h-4 w-4 text-slate-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
            >
              <div className="mt-0.5 rounded-full bg-slate-100 p-1.5 dark:bg-slate-800">
                {getIconForType(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                  {notification.message}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
