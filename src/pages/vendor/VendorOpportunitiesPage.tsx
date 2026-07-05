import { OpportunityApplyAction } from "@/features/opportunities/components/OpportunityApplyAction";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { useShareStore } from "@/features/opportunities/store/useShareStore";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Calendar, IndianRupee, MapPin, Share2 } from "lucide-react";

export function VendorOpportunitiesPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isOpportunityShared } = useShareStore();

  const vendorId = currentUser?.id || "demo-vendor-id";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Opportunities</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Browse and apply to available vendor opportunities.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {([] as any[]).map((opportunity) => {
          const shared = isOpportunityShared(vendorId, opportunity.id);
          return (
            <Card key={opportunity.id} className={`group relative border transition-all duration-300 ${
              shared 
                ? "border-emerald-500/30 bg-emerald-50/5 dark:bg-emerald-950/5 shadow-emerald-500/5 shadow-lg" 
                : "border-slate-200 dark:border-slate-800 hover:shadow-md"
            }`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    {shared && (
                      <Badge variant="success" className="mb-2 bg-emerald-500 text-white flex items-center gap-1 w-fit">
                        <Share2 className="h-3 w-3" /> Shared by your Lead
                      </Badge>
                    )}
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {opportunity.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 text-sm">
                      {opportunity.description}
                    </CardDescription>
                  </div>
                  <Badge variant={opportunity.status === "Open" ? "success" : "default"}>
                    {opportunity.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pb-4">
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-4 w-4 text-slate-400" />
                    <span>{formatCurrency(opportunity.budget)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{formatDate(opportunity.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{opportunity.location || "Remote"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-slate-50/50 dark:bg-slate-950/20 pt-4 rounded-b-2xl">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {opportunity.category}
                </span>
                <OpportunityApplyAction
                  opportunityId={opportunity.id}
                  opportunityTitle={opportunity.title}
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
