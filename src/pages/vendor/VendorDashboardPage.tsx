import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useShareStore } from "@/features/opportunities/store/useShareStore";
import { useApplicationStore } from "@/features/opportunities/store/useApplicationStore";
import { mockOpportunities } from "@/lib/mockOpportunities";
import { formatCurrency } from "@/utils/formatCurrency";
import { Calendar, IndianRupee, Share2, Briefcase, FileCheck2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { OpportunityApplyAction } from "@/features/opportunities/components/OpportunityApplyAction";

export function VendorDashboardPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { isOpportunityShared } = useShareStore();
  const appliedOpportunityIds = useApplicationStore((state) => state.appliedOpportunityIds);

  const vendorId = currentUser?.id || "demo-vendor-id";

  // Filter opportunities shared by lead
  const sharedOpportunities = mockOpportunities.filter((opp) =>
    isOpportunityShared(vendorId, opp.id)
  );

  // Filter applied opportunities
  const appliedOpportunities = mockOpportunities.filter((opp) =>
    appliedOpportunityIds.includes(opp.id)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Vendor Dashboard
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back, {currentUser?.fullName || "Partner"}. Review opportunities and tracking status here.
        </p>
      </header>

      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-indigo-100 bg-indigo-50/10 dark:border-indigo-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Shared by Lead</CardTitle>
            <Share2 className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedOpportunities.length}</div>
            <p className="text-xs text-slate-500 mt-1">Opportunities recommended for you</p>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-100 bg-emerald-50/10 dark:border-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Submitted Applications</CardTitle>
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedOpportunities.length}</div>
            <p className="text-xs text-slate-500 mt-1">Proposals submitted to leads</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/10 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Available Openings</CardTitle>
            <Briefcase className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOpportunities.filter(o => o.status === "Open").length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Active market opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Shared Opportunities Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-100 dark:border-emerald-950/30">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Shared Opportunities
              </CardTitle>
              <CardDescription>
                Pushed by your industry Lead for direct consideration.
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500 text-white">Recommended</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {sharedOpportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                <Share2 className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No shared opportunities yet</p>
                <p className="text-xs text-slate-400">Ask your Lead to push opportunities to you.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sharedOpportunities.map((opp) => {
                  return (
                    <div key={opp.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {opp.title}
                        </h4>
                        <div className="flex gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {formatCurrency(opp.budget)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(opp.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <OpportunityApplyAction
                        opportunityId={opp.id}
                        opportunityTitle={opp.title}
                        className="h-8 text-xs px-3"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applied Opportunities Tracking */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Application Status
              </CardTitle>
              <CardDescription>
                Track your active proposals and review status.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary-600" onClick={() => navigate("/vendor/opportunities")}>
              Browse All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {appliedOpportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
                <Briefcase className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No applications yet</p>
                <p className="text-xs text-slate-400">Browse opportunities and start applying.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {appliedOpportunities.map((opp) => (
                  <div key={opp.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Submitted recently</p>
                    </div>
                    <Badge variant="info">In Review</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
