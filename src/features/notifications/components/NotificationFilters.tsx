import { NotificationFilter } from "../types";
import { cn } from "@/utils/cn";

interface NotificationFiltersProps {
  currentFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  unreadCount?: number;
}

export function NotificationFilters({
  currentFilter,
  onFilterChange,
  unreadCount = 0,
}: NotificationFiltersProps) {
  const filters: { id: NotificationFilter; label: string; count?: number }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "opportunity", label: "Opportunities" },
    { id: "application", label: "Applications" },
    { id: "query", label: "Queries" },
    { id: "system", label: "System" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              "flex items-center gap-2",
              isActive
                ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            )}
          >
            {filter.label}
            {filter.count !== undefined && filter.count > 0 && (
              <span 
                className={cn(
                  "inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-xs font-bold",
                  isActive 
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-slate-900" 
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
