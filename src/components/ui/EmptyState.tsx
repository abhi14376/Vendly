import { FolderSearch, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = <FolderSearch className="size-10 text-slate-400 dark:text-slate-500" />,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-medium text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <Plus className="mr-2 size-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
