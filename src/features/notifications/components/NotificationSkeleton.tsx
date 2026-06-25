import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function NotificationSkeleton() {
  return (
    <Card className="p-4 md:p-5 flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex-1 space-y-3 py-1">
        <div className="flex justify-between items-start">
          <Skeleton className="w-1/3 h-5" />
          <Skeleton className="w-20 h-4" />
        </div>
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
        <div className="pt-2">
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
    </Card>
  );
}
