import { useEffect, useState } from "react";
import { Bell, MessageSquareText, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export function LeadNotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    async function fetchNotifications() {
      const supabase = getSupabaseClient();
      if (!supabase || !currentUser) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("profile_id", currentUser.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setNotifications(data ?? []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [currentUser]);

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

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-sm text-slate-400">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-1">
            <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No notifications yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">You'll be notified of updates here.</p>
          </div>
        ) : (
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
                    {notification.title}
                  </p>
                  {notification.body && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{notification.body}</p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500">{formatTime(notification.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
