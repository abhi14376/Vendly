import { useState } from "react";
import { Bell, Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/utils/cn";
import { useNotificationStore } from "@/store/notificationStore";

export function AdminNotificationsPage() {
  const { latestNotifications, markRead, markAllRead } = useNotificationStore();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Map store shape to page shape (body → message)
  const notifications = latestNotifications.map((n) => ({
    ...n,
    message: n.body,
  }));

  const filteredData = notifications.filter((n) => {
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !n.isRead) ||
      (statusFilter === "read" && n.isRead);
    return matchesType && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleMarkAsRead = (id: string) => markRead(id);
  const handleMarkAllAsRead = () => markAllRead();

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "security": return "error";
      case "system": return "info";
      case "billing": return "warning";
      case "user": return "default";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage system alerts and updates.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllAsRead} disabled={notifications.every(n => n.isRead)}>
          <Check className="mr-2 size-4" />
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-500" />
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-[140px]">
            <option value="all">All Types</option>
            <option value="system">System</option>
            <option value="user">User</option>
            <option value="security">Security</option>
            <option value="billing">Billing</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[140px]">
            <option value="all">All Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {currentData.length > 0 ? (
            currentData.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "flex items-start gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50",
                  !notification.isRead && "bg-blue-50/50 dark:bg-blue-950/20"
                )}
              >
                <div className="mt-1 flex-shrink-0">
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-full",
                    !notification.isRead ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    <Bell className="size-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium",
                      !notification.isRead ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                    )}>
                      {notification.title}
                    </p>
                    <span className="whitespace-nowrap text-xs text-slate-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant={getTypeBadgeVariant(notification.type)} className="capitalize">
                      {notification.type}
                    </Badge>
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8">
              <EmptyState 
                title="No notifications" 
                description="You're all caught up! No notifications match your filters." 
                icon={<Bell className="size-10 text-slate-400 dark:text-slate-500" />}
              />
            </div>
          )}
        </div>
        
        {filteredData.length > itemsPerPage && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
