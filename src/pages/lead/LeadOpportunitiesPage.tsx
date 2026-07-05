import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Grid, List, MapPin, Calendar, IndianRupee, Download, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { opportunityService } from "@/services/opportunityService";
import { Opportunity, OpportunityStatus } from "@/types/Opportunity";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router";
import { generatePdf } from "@/utils/generatePdf";

export function LeadOpportunitiesPage() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [stateFilter, setStateFilter] = useState<string>("All");

  useEffect(() => {
    const fetchOpps = async () => {
      setIsLoading(true);
      const data = await opportunityService.getOpportunities();
      setOpportunities(data);
      setIsLoading(false);
    };
    fetchOpps();
  }, []);

  // ── Derive unique option lists from live data ─────────────────────────────
  const industryOptions = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => {
      const val = o.industryType || o.category;
      if (val) set.add(val);
    });
    return [
      { label: "All Industries", value: "All" },
      ...Array.from(set)
        .sort()
        .map((v) => ({ label: v, value: v })),
    ];
  }, [opportunities]);

  const stateOptions = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => {
      // Only use stateLocationName — it holds the proper state name.
      // Ignore opp.location which may contain city names or address strings.
      if (o.stateLocationName) set.add(o.stateLocationName);
    });
    return [
      { label: "All States", value: "All" },
      ...Array.from(set)
        .sort()
        .map((v) => ({ label: v, value: v })),
    ];
  }, [opportunities]);

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Open", value: "Open" },
    { label: "Published", value: "Published" },
    { label: "In Progress", value: "In Progress" },
    { label: "Review", value: "Review" },
    { label: "Closed", value: "Closed" },
  ];

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const industry = opp.industryType || opp.category || "";
      const state = opp.stateLocationName || opp.location || "";

      const matchesSearch =
        opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || opp.status === statusFilter;
      const matchesIndustry = industryFilter === "All" || industry === industryFilter;
      const matchesState = stateFilter === "All" || state === stateFilter;

      return matchesSearch && matchesStatus && matchesIndustry && matchesState;
    });
  }, [opportunities, searchQuery, statusFilter, industryFilter, stateFilter]);

  // Active filter count (excluding search)
  const activeFilterCount = [
    statusFilter !== "All",
    industryFilter !== "All",
    stateFilter !== "All",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setIndustryFilter("All");
    setStateFilter("All");
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Open": return "success";
      case "Published": return "success";
      case "In Progress": return "warning";
      case "Review": return "info";
      case "Closed": return "default";
      default: return "default";
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and track your active sourcing opportunities.
          </p>
        </div>
        <div className="flex shrink-0">
          <Button onClick={() => navigate("/dashboard/opportunities/new")} className="w-full sm:w-auto">
            <Plus className="size-4 mr-2" /> New Opportunity
          </Button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md">

        {/* Row 1: Search + view toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search by title, industry, or state..."
              className="bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-800/50"
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Active filter badge */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 px-2.5 py-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
              </button>
            )}

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "card"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
                aria-label="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
                aria-label="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filter dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Industry filter */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <Select
              className="flex-1 bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-800/50 text-sm"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              options={industryOptions}
            />
          </div>

          {/* State filter */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <Select
              className="flex-1 bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-800/50 text-sm"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              options={stateOptions}
            />
          </div>

          {/* Status filter */}
          <div className="flex-1 min-w-0">
            <Select
              className="w-full bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-800/50 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OpportunityStatus | "All")}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-0.5">
          <span>
            Showing{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {filteredOpportunities.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {opportunities.length}
            </span>{" "}
            opportunities
          </span>
          {activeFilterCount > 0 && (
            <span className="text-indigo-500 dark:text-indigo-400 font-medium">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </span>
          )}
        </div>
      </div>

      {/* ── Content Area ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading opportunities...</p>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No opportunities found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="secondary" className="mt-6" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <Card
              key={opp.id}
              className="group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden flex flex-col"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {opp.industryType || opp.category}
                  </Badge>
                  <Badge variant={getStatusVariant(opp.status)}>{opp.status}</Badge>
                </div>
                <CardTitle
                  className="text-xl text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/opportunities/${opp.id}`)}
                >
                  {opp.title}
                </CardTitle>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {opp.authorityName || "Authority Not Specified"}
                </div>
                <CardDescription className="line-clamp-2 mt-2">{opp.summary || opp.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-1">
                <div className="space-y-3 mt-2">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <IndianRupee className="mr-2 h-4 w-4 text-slate-400" />
                    <span className="font-medium">{formatCurrency(opp.budget)}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                    <span>Due {formatDate(opp.deadline)}</span>
                  </div>
                  {(opp.stateLocationName || opp.location) && (
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                      <span>{opp.stateLocationName || opp.location}</span>
                    </div>
                  )}
                  {opp.documents && opp.documents.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                        Attached Documents
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {opp.documents.map((doc, idx) => (
                          <a
                            key={idx}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                          >
                            {doc.name ? doc.name.split(".").pop()?.toUpperCase() : "DOC"}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/50 flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{opp.applicationsCount}</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">applicants</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generatePdf(opp)} title="Download Report">
                    <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    onClick={() => navigate(`/dashboard/opportunities/${opp.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50/80 dark:bg-slate-950/80 border-b-slate-200/50 dark:border-b-slate-800/50">
                  <TableHead className="w-[300px]">Opportunity</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((opp) => (
                  <TableRow
                    key={opp.id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-b-slate-100 dark:border-b-slate-800/60 transition-colors"
                  >
                    <TableCell>
                      <div
                        className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                        onClick={() => navigate(`/dashboard/opportunities/${opp.id}`)}
                      >
                        {opp.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[280px]">
                        {opp.authorityName || ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs">
                        {opp.industryType || opp.category || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {opp.stateLocationName || opp.location || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(opp.status)}>{opp.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(opp.budget)}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                      {formatDate(opp.deadline)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full w-8 h-8 text-xs font-semibold">
                        {opp.applicationsCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      {opp.documents && opp.documents.length > 0 ? (
                        <div className="flex gap-2 flex-wrap">
                          {opp.documents.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                            >
                              {doc.name ? `(${doc.name.split(".").pop()})` : "Download"}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => generatePdf(opp)} title="Download Report">
                          <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </Button>
                        <Button variant="ghost" size="default" onClick={() => navigate(`/dashboard/opportunities/${opp.id}`)}>
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
