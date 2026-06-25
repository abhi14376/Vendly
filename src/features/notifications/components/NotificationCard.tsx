import { Link } from "react-router";
import { Briefcase, FileText, MessageSquare, Info, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Notification } from "../types";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { cn } from "@/utils/cn";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "opportunity":
      return <Briefcase className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
    case "application":
      return <FileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
    case "query":
      return <MessageSquare className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
    case "system":
      return <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
  }
};

export function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const { id, title, message, createdAt, isRead, link, type } = notification;

  const content = (
    <>
      <div className="flex-shrink-0 mt-1">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {getIcon(type)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "text-sm font-semibold text-slate-900 dark:text-slate-50",
              !isRead && "text-indigo-600 dark:text-indigo-400"
            )}>
              {title}
            </h4>
            {!isRead && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500" aria-label="Unread" />
            )}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {message}
        </p>
        
        {!isRead && (
          <div className="mt-3 flex">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation if wrapped in link
                e.stopPropagation();
                onMarkAsRead(id);
              }}
              className="text-xs h-8 gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark as read
            </Button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <Card 
      className={cn(
        "p-4 md:p-5 flex gap-4 transition-colors relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700",
        !isRead ? "bg-indigo-50/50 dark:bg-indigo-950/20" : "bg-white dark:bg-slate-900"
      )}
    >
      {!isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-l-xl" />
      )}
      
      {link ? (
        <Link to={link} className="flex gap-4 w-full flex-1 hover:opacity-90">
          {content}
        </Link>
      ) : (
        <div className="flex gap-4 w-full flex-1">
          {content}
        </div>
      )}
    </Card>
  );
}
