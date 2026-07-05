import { useState, useEffect, useMemo, useRef } from "react";
import { 
  Eye, 
  Search, 
  Filter, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Play, 
  RefreshCw, 
  BarChart3, 
  Layers, 
  Send, 
  ChevronRight, 
  Download, 
  Award, 
  BellRing,
  ExternalLink,
  ChevronDown,
  Activity,
  Check,
  X,
  Plus
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router";
import { tenderService } from "@/services/tenderService";
import { addLeadMatchedVendor } from "@/services/leadMatchedVendorsStore";
import { Tender, TenderMatch, TenderAlert, TenderCorrigendum, TenderAward, TenderStatus } from "@/types/Tender";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";

export function AdminOpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "new-tenders";
  const navigate = useNavigate();

  const [tenders, setTenders] = useState<Tender[]>([]);
  const [matches, setMatches] = useState<TenderMatch[]>([]);
  const [alerts, setAlerts] = useState<TenderAlert[]>([]);
  const [corrigenda, setCorrigenda] = useState<TenderCorrigendum[]>([]);
  const [awards, setAwards] = useState<TenderAward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  // UI Control States
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const filters = {
        state: stateFilter,
        department: deptFilter,
        category: categoryFilter,
        minBudget: minBudget ? Number(minBudget) : undefined,
        maxBudget: maxBudget ? Number(maxBudget) : undefined,
        search: searchTerm
      };

      const fetchedTenders = await tenderService.getTenders('all', filters);
      const fetchedMatches = await tenderService.getTenderMatches(searchTerm);
      const fetchedAlerts = await tenderService.getTenderAlerts();
      const fetchedCorrigenda = await tenderService.getCorrigendums();
      const fetchedAwards = await tenderService.getAwardedContracts();

      setTenders(fetchedTenders);
      setMatches(fetchedMatches);
      setAlerts(fetchedAlerts);
      setCorrigenda(fetchedCorrigenda);
      setAwards(fetchedAwards);
    } catch (error) {
      console.error("Failed to load tender data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, stateFilter, deptFilter, categoryFilter, minBudget, maxBudget, searchTerm]);

  // Submenu configuration
  const tabs = [
    { id: "new-tenders", label: "New Tenders", count: tenders.filter(t => t.status === "new").length },
    { id: "active-tenders", label: "Active Tenders", count: tenders.filter(t => t.status === "active").length },
    { id: "closing-soon", label: "Closing Soon", count: tenders.filter(t => {
      const days = Math.ceil((new Date(t.submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return t.status === 'active' && days > 0 && days <= 7;
    }).length },
    { id: "corrigendum", label: "Corrigenda", count: corrigenda.length },
    { id: "awarded-contracts", label: "Awarded Contracts", count: awards.length },
    { id: "department-analytics", label: "Department Analytics" },
    { id: "state-analytics", label: "State Analytics" },
    { id: "vendor-matches", label: "Vendor Matches", count: matches.length }
  ];

  // Unique lists for filter dropdowns
  const filterOptions = useMemo(() => {
    const statesList = ["All", "Uttar Pradesh", "Haryana", "Madhya Pradesh", "Rajasthan", "Jharkhand", "Uttarakhand", "Maharashtra", "Goa", "Bihar"];
    const deptsList = ["All", "PWD", "NHAI", "PHED", "Jal Nigam", "SECI", "HAREDA", "UPNEDA", "CPWD", "RVNL", "Coal India", "NTPC", "Development Authorities"];
    const catsList = ["All", "EPC", "Civil Construction", "Roads & Highways", "Bridges", "Solar EPC", "Electrical Works", "Water Supply", "Sewerage", "IT", "Consultancy", "Airport Infrastructure"];

    return {
      states: statesList.map(s => ({ label: s, value: s })),
      departments: deptsList.map(d => ({ label: d, value: d })),
      categories: catsList.map(c => ({ label: c, value: c }))
    };
  }, []);

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // Approve a newly discovered tender to active
  const handleApproveTender = async (id: string) => {
    const ok = await tenderService.updateTenderStatus(id, "active");
    if (ok) {
      toast.success("Tender approved and listed under Active Tenders.");
      loadData();
    }
  };

  // Reject/Archive a new tender
  const handleArchiveTender = async (id: string) => {
    const ok = await tenderService.updateTenderStatus(id, "closing_soon"); // map to close/archive
    if (ok) {
      toast.info("Tender archived.");
      loadData();
    }
  };

  // Dispatch manual notification to matched vendor
  const handleSendMatchAlert = (match: TenderMatch) => {
    const hash = match.vendorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const leads = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh'];
    const leadName = leads[hash % leads.length];
    
    addLeadMatchedVendor(match);
    toast.success(`Match alert dispatched successfully to Lead (${leadName}) for vendor ${match.vendorName}!`);
  };

  // Formatting currency helper
  const formatINR = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-950 shadow-xl relative overflow-hidden">
        {/* Glow highlights */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Tender Intelligence Engine
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-xl">
            Tender intelligence platform powered by AI.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2 shrink-0">
          <Button 
            onClick={() => navigate("/admin/opportunities/new")}
            variant="outline" 
            className="border-indigo-900 bg-indigo-950/20 text-indigo-300 hover:bg-indigo-950/60"
          >
            <Plus className="size-4 mr-2" /> Create Opportunity
          </Button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Discovered", value: tenders.filter(t => t.status === "new").length, icon: Cpu, color: "text-amber-500", bg: "from-amber-500/5 to-amber-600/5", border: "border-amber-500/10" },
          { label: "Active Tenders", value: tenders.filter(t => t.status === "active").length, icon: TrendingUp, color: "text-indigo-500", bg: "from-indigo-500/5 to-indigo-600/5", border: "border-indigo-500/10" },
          { label: "Closing Soon (<=7d)", value: tenders.filter(t => {
            const days = Math.ceil((new Date(t.submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return t.status === 'active' && days > 0 && days <= 7;
          }).length, icon: AlertTriangle, color: "text-rose-500", bg: "from-rose-500/5 to-rose-600/5", border: "border-rose-500/10" },
          { label: "Tender Match Pipeline", value: matches.length, icon: Layers, color: "text-emerald-500", bg: "from-emerald-500/5 to-emerald-600/5", border: "border-emerald-500/10" }
        ].map((stat, idx) => (
          <Card key={idx} className={`overflow-hidden border bg-white dark:bg-slate-900/60 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md ${stat.border}`}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Tabs Menu bar */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`whitespace-nowrap pb-3 px-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters bar (only for tender listing tabs) */}
      {["new-tenders", "active-tenders", "closing-soon"].includes(activeTab) && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-6 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              placeholder="Search tender no, title, authority..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="All">All States</option>
              {filterOptions.states.slice(1).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {filterOptions.categories.slice(1).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <div>
            <Input
              type="number"
              placeholder="Min value (₹)"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max value (₹)"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main content display panels */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <RefreshCw className="size-8 animate-spin text-indigo-500" />
            <span className="text-sm font-medium">Processing tender schemas...</span>
          </div>
        ) : (
          <>
            {/* 1. NEW TENDERS TAB */}
            {activeTab === "new-tenders" && (
              <div className="space-y-4">
                {tenders.filter(t => t.status === "new").length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                    <CheckCircle2 className="size-10 mx-auto text-emerald-500 mb-3" />
                    <h3 className="text-slate-900 dark:text-white font-semibold">All Tenders Reviewed</h3>
                    <p className="text-slate-500 text-xs mt-1">No new tenders are pending admin verification.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {tenders.filter(t => t.status === "new").map((t) => (
                      <Card key={t.id} className="border border-amber-500/10 hover:border-amber-500/30 transition-all bg-white dark:bg-slate-900/60 shadow-sm">
                        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="warning">New Discovered</Badge>
                              <span className="text-xs font-mono text-slate-500">{t.tenderNumber}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">{t.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {t.description}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                            <div className="flex items-center gap-1.5">
                              <IndianRupee className="size-3.5 text-slate-400" />
                              <span>{formatINR(t.estimatedValue)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="size-3.5 text-slate-400" />
                              <span className="truncate">{t.location}, {t.stateCode}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => { setSelectedTender(t); setIsDetailOpen(true); }}
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                            >
                              <Eye className="size-3.5 mr-1.5" /> AI Brief
                            </Button>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-950 dark:hover:bg-rose-950/30"
                                onClick={() => handleArchiveTender(t.id)}
                              >
                                Reject
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleApproveTender(t.id)}
                              >
                                Approve
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ACTIVE TENDERS TAB */}
            {activeTab === "active-tenders" && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tender Details</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Estimated Value</TableHead>
                      <TableHead>EMD / Fee</TableHead>
                      <TableHead>Submission Last Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenders.filter(t => t.status === "active").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                          No active tenders match selected filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tenders.filter(t => t.status === "active").map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="max-w-xs">
                            <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{t.title}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{t.tenderNumber}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-slate-100 text-slate-850 dark:bg-slate-800 dark:text-slate-200">
                              {t.departmentName}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300 font-medium">{t.stateName}</TableCell>
                          <TableCell className="font-semibold text-slate-900 dark:text-indigo-300">{formatINR(t.estimatedValue)}</TableCell>
                          <TableCell className="text-xs text-slate-500">
                            <div>EMD: {formatINR(t.emd)}</div>
                            <div>Fee: ₹{t.tenderFee.toLocaleString()}</div>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">
                            {new Date(t.submissionDeadline).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => { setSelectedTender(t); setIsDetailOpen(true); }}
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* 3. CLOSING SOON TAB */}
            {activeTab === "closing-soon" && (
              <div className="space-y-4">
                {tenders.filter(t => {
                  const days = Math.ceil((new Date(t.submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return t.status === 'active' && days > 0 && days <= 7;
                }).length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                    <CheckCircle2 className="size-10 mx-auto text-emerald-500 mb-3" />
                    <h3 className="text-slate-900 dark:text-white font-semibold">No Urgent Deadlines</h3>
                    <p className="text-slate-500 text-xs mt-1">No active tenders are closing within the next 7 days.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tender Title</TableHead>
                          <TableHead>Time Left</TableHead>
                          <TableHead>Deadline Date</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Alert Dispatches</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenders.filter(t => {
                          const days = Math.ceil((new Date(t.submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                          return t.status === 'active' && days > 0 && days <= 7;
                        }).map((t) => {
                          const hoursLeft = Math.max(0, Math.ceil((new Date(t.submissionDeadline).getTime() - Date.now()) / (1000 * 60 * 60)));
                          const daysLeft = Math.ceil(hoursLeft / 24);

                          let badgeVariant: "error" | "warning" | "default" = "default";
                          let alertText = "";
                          if (hoursLeft <= 24) {
                            badgeVariant = "error";
                            alertText = "24 Hours Left";
                          } else if (daysLeft <= 3) {
                            badgeVariant = "warning";
                            alertText = "3 Days Left";
                          } else {
                            alertText = "7 Days Left";
                          }

                          return (
                            <TableRow key={t.id}>
                              <TableCell className="max-w-xs">
                                <div className="font-semibold line-clamp-1">{t.title}</div>
                                <div className="text-xs text-slate-500 font-mono mt-0.5">{t.tenderNumber}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={badgeVariant} className="animate-pulse">{alertText}</Badge>
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {new Date(t.submissionDeadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                              </TableCell>
                              <TableCell className="font-semibold">{formatINR(t.estimatedValue)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2 flex-wrap">
                                  <span className="inline-flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                                    <BellRing className="size-3 mr-1" /> Admin Notified
                                  </span>
                                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-full">
                                    <Check className="size-3 mr-1" /> Vendors Alerted
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => { setSelectedTender(t); setIsDetailOpen(true); }}
                                >
                                  <Eye className="size-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {/* 4. CORRIGENDUM TAB */}
            {activeTab === "corrigendum" && (
              <div className="space-y-4">
                {corrigenda.length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                    <FileText className="size-10 mx-auto text-slate-400 mb-3" />
                    <h3 className="text-slate-900 dark:text-white font-semibold">No Updates Published</h3>
                    <p className="text-slate-500 text-xs mt-1">There are currently no corrigenda published for tenders.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {corrigenda.map((c) => {
                      const associatedTender = tenders.find(t => t.id === c.tenderId);
                      return (
                        <Card key={c.id} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all">
                          <CardContent className="p-5 flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-250">Corrigendum / Addendum</Badge>
                                <span className="text-xs text-slate-500 font-mono">Published: {new Date(c.publishDate || "").toLocaleDateString()}</span>
                              </div>
                              <h3 className="font-bold text-slate-900 dark:text-white">{c.title}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {c.details}
                              </p>
                              {associatedTender && (
                                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                                  Tender Link: [{associatedTender.tenderNumber}] {associatedTender.title}
                                </div>
                              )}
                            </div>
                            <div className="flex md:flex-col justify-end gap-2 shrink-0 md:justify-center">
                              {associatedTender && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => { setSelectedTender(associatedTender); setIsDetailOpen(true); }}
                                >
                                  View Tender
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => toast.success("Downloading corrigendum file...")}
                              >
                                <Download className="size-4 mr-1.5" /> PDF
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 5. AWARDED CONTRACTS TAB */}
            {activeTab === "awarded-contracts" && (
              <div className="space-y-4">
                {awards.length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                    <Award className="size-10 mx-auto text-slate-400 mb-3" />
                    <h3 className="text-slate-900 dark:text-white font-semibold">No Awards Logged</h3>
                    <p className="text-slate-500 text-xs mt-1">Awarded contracts history is currently empty.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tender Reference</TableHead>
                          <TableHead>Awarded Bidder</TableHead>
                          <TableHead>Original Value</TableHead>
                          <TableHead>Award Contract Value</TableHead>
                          <TableHead>Award Date</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {awards.map((a) => {
                          const associatedTender = tenders.find(t => t.id === a.tenderId);
                          return (
                            <TableRow key={a.id}>
                              <TableCell className="max-w-xs">
                                <div className="font-semibold line-clamp-1">{associatedTender?.title || 'Unknown Tender'}</div>
                                <div className="text-xs text-slate-500 font-mono mt-0.5">{associatedTender?.tenderNumber}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <Award className="size-4 text-amber-500 shrink-0" />
                                  <span>{a.awardedTo}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-650">{associatedTender ? formatINR(associatedTender.estimatedValue) : 'N/A'}</TableCell>
                              <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(a.awardValue)}</TableCell>
                              <TableCell className="text-sm font-medium">
                                {new Date(a.awardDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                {associatedTender && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => { setSelectedTender(associatedTender); setIsDetailOpen(true); }}
                                  >
                                    <Eye className="size-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}

            {/* 6. DEPARTMENT ANALYTICS TAB */}
            {activeTab === "department-analytics" && (
              <div className="space-y-6">
                {/* Stats cards for sectors */}
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { title: "Highest Vol Sector", value: "Roads & Infrastructure", detail: "3 Tenders", color: "border-l-4 border-indigo-500" },
                    { title: "Total Procurement Pipeline", value: "₹251.00 Cr", detail: "Across all active crawls", color: "border-l-4 border-emerald-500" },
                    { title: "Active Departments", value: "12 agencies", detail: "Monitoring active contracts", color: "border-l-4 border-sky-500" }
                  ].map((s, i) => (
                    <div key={i} className={`bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${s.color}`}>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.title}</p>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{s.value}</h4>
                      <p className="text-xs text-slate-400 mt-1">{s.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Department List & Values */}
                  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <CardContent className="p-6">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Tenders Value & Volumes by Agency</h3>
                      
                      <div className="space-y-4">
                        {[
                          { name: "Water Resources Department (WRD)", val: 1250000000, count: 1, p: 50 },
                          { name: "Public Works Department (PWD)", val: 485000000, count: 1, p: 25 },
                          { name: "RRECL (Solar component)", val: 350000000, count: 1, p: 18 },
                          { name: "HAREDA", val: 240000000, count: 1, p: 7 }
                        ].map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[240px]">{item.name}</span>
                              <span className="text-slate-900 dark:text-white font-bold">{formatINR(item.val)} ({item.count})</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.p}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sector Allocation visual chart */}
                  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                    <CardContent className="p-6">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Sectors Allocation Footprint</h3>
                      
                      <div className="flex flex-col items-center justify-center py-6">
                        {/* Custom Mock SVG Pie chart */}
                        <svg className="w-48 h-48" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100 dark:text-slate-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Sector 1: Roads (25%) */}
                          <path
                            className="text-indigo-500"
                            strokeDasharray="25, 100"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Sector 2: Solar (45%) */}
                          <path
                            className="text-amber-500"
                            strokeDasharray="45, 100"
                            strokeDashoffset="-25"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Sector 3: Water (30%) */}
                          <path
                            className="text-emerald-500"
                            strokeDasharray="30, 100"
                            strokeDashoffset="-70"
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>

                        <div className="grid grid-cols-3 gap-4 mt-6 text-xs font-semibold w-full text-center">
                          <div className="flex flex-col items-center">
                            <span className="h-2 w-2 rounded-full bg-indigo-500 mb-1" />
                            <span className="text-slate-500">Roads (25%)</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="h-2 w-2 rounded-full bg-amber-500 mb-1" />
                            <span className="text-slate-500">Solar (45%)</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 mb-1" />
                            <span className="text-slate-500">Water (30%)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* 7. STATE ANALYTICS TAB */}
            {activeTab === "state-analytics" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { state: "Uttar Pradesh", count: 1, val: 485000000, rate: 75 },
                    { state: "Haryana", count: 1, val: 240000000, rate: 82 },
                    { state: "Rajasthan", count: 1, val: 350000000, rate: 68 },
                    { state: "Madhya Pradesh", count: 1, val: 1250000000, rate: 50 },
                    { state: "Maharashtra", count: 1, val: 6500000000, rate: 95 },
                    { state: "Bihar", count: 0, val: 0, rate: 0 }
                  ].map((s, idx) => (
                    <Card key={idx} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 dark:text-white">{s.state}</h4>
                          <span className="text-xs text-slate-500 font-semibold">{s.count} Tenders</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400">Total Sourcing Vol</span>
                          <div className="text-lg font-bold text-slate-900 dark:text-indigo-300">{formatINR(s.val)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                            <span>Sourcing Activity Index</span>
                            <span>{s.rate}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${s.rate}%` }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 8. VENDOR MATCHES TAB */}
            {activeTab === "vendor-matches" && (
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                    <Layers className="size-10 mx-auto text-slate-400 mb-3" />
                    <h3 className="text-slate-900 dark:text-white font-semibold">No Matches Formed</h3>
                    <p className="text-slate-500 text-xs mt-1">Vendor matches are currently empty. Run crawler to update.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tender Reference</TableHead>
                          <TableHead>Matching Vendor</TableHead>
                          <TableHead>Lead</TableHead>
                          <TableHead>Match Score</TableHead>
                          <TableHead>Matching Criteria Breakdown</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {matches.map((m) => {
                          const associatedTender = tenders.find(t => t.id === m.tenderId);
                          let scoreColor = "text-rose-500 bg-rose-50 border-rose-200";
                          if (m.matchScore >= 80) {
                            scoreColor = "text-emerald-500 bg-emerald-50 border-emerald-250";
                          } else if (m.matchScore >= 60) {
                            scoreColor = "text-indigo-500 bg-indigo-50 border-indigo-250";
                          }

                          return (
                            <TableRow key={m.id}>
                              <TableCell className="max-w-xs">
                                <div className="font-semibold line-clamp-1">{associatedTender?.title || m.tenderTitle}</div>
                                <div className="text-xs text-slate-500 font-mono mt-0.5">{m.tenderNumber}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-slate-800 dark:text-white">{m.vendorName}</div>
                                <div className="text-[10px] text-slate-400">ID: {m.vendorId}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-slate-700 dark:text-slate-300">
                                  {['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh'][
                                    m.vendorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5
                                  ]}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded border ${scoreColor}`}>
                                  {m.matchScore}% Match
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${m.categoryMatch ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-400 line-through'}`}>
                                    Category
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${m.stateMatch ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-400 line-through'}`}>
                                    State
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${m.turnoverMatch ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-400 line-through'}`}>
                                    Turnover
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${m.experienceMatch ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-400 line-through'}`}>
                                    Experience
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {associatedTender && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => { setSelectedTender(associatedTender); setIsDetailOpen(true); }}
                                      aria-label="View Tender"
                                    >
                                      <Eye className="size-4" />
                                    </Button>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                    onClick={() => handleSendMatchAlert(m)}
                                    aria-label="Send Alert"
                                  >
                                    <Send className="size-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Tender Detail Modal (Standard Output Format + AI Brief) */}
      {isDetailOpen && selectedTender && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-indigo-600 text-white font-semibold">Tender Details</Badge>
                  <span className="text-xs font-mono text-slate-500 font-bold">{selectedTender.tenderNumber}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{selectedTender.title}</h2>
              </div>
              <button 
                onClick={() => { setSelectedTender(null); setIsDetailOpen(false); }}
                className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 rounded-full hover:bg-slate-150"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Carousel showing Standard Format Output vs AI Executive Brief */}
              <div className="grid gap-6 md:grid-cols-12">
                
                {/* COLUMN 1: Standard Format Output (Width: 7 cols) */}
                <div className="md:col-span-7 space-y-4 border-r border-slate-100 dark:border-slate-800 pr-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
                    Standard Tender Parameters
                  </h3>

                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Nature of Work:</span>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">{selectedTender.aiSummary?.natureOfWork || 'N/A'}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Short Brief:</span>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">{selectedTender.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Department:</span>
                        <div className="text-slate-600 dark:text-slate-300">{selectedTender.departmentName || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Authority:</span>
                        <div className="text-slate-600 dark:text-slate-300">{selectedTender.authority || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Location:</span>
                        <div className="text-slate-600 dark:text-slate-300">{selectedTender.location || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">State:</span>
                        <div className="text-slate-600 dark:text-slate-300">{selectedTender.stateName || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-y border-slate-100 dark:border-slate-800/80 py-3 my-2">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Tender Value:</span>
                        <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{formatINR(selectedTender.estimatedValue)}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">EMD:</span>
                        <div className="text-slate-700 dark:text-slate-300 font-semibold">{formatINR(selectedTender.emd)}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Tender Fee:</span>
                        <div className="text-slate-700 dark:text-slate-300 font-semibold">₹{selectedTender.tenderFee.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Publish Date:</span>
                        <div className="text-slate-600 dark:text-slate-300">{new Date(selectedTender.publishDate || "").toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Last Date:</span>
                        <div className="text-slate-650 font-semibold">{new Date(selectedTender.submissionDeadline).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Category:</span>
                        <div className="text-slate-600 dark:text-slate-300">{selectedTender.categoryName || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Sub Category:</span>
                        <div className="text-slate-600 dark:text-slate-300">{selectedTender.sector || 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Eligibility Summary:</span>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">{selectedTender.eligibility?.eligibilitySummary || 'N/A'}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Download Link:</span>
                      <div className="mt-1 flex gap-2">
                        {selectedTender.documents && selectedTender.documents.length > 0 ? (
                          selectedTender.documents.map((d, i) => (
                            <a 
                              key={i} 
                              href={d.fileUrl}
                              className="inline-flex items-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded border border-indigo-150 hover:bg-indigo-100"
                            >
                              <Download className="size-3 mr-1" /> {d.fileName}
                            </a>
                          ))
                        ) : (
                          <span className="text-slate-400">No documents attached</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* COLUMN 2: AI BRIEF (Width: 5 cols) */}
                <div className="md:col-span-5 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b pb-2 flex items-center gap-1.5">
                    <Cpu className="size-4 animate-pulse text-amber-500" />
                    <span>AI Tender Executive Brief</span>
                  </h3>
                  
                  {/* Executive Brief Display */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-indigo-950/20 text-xs leading-relaxed max-h-[300px] overflow-y-auto">
                    {selectedTender.aiSummary?.executiveBrief ? (
                      <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                        {selectedTender.aiSummary.executiveBrief}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">No summary generated.</span>
                    )}
                  </div>

                  {/* AI Scores Panel */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Attractiveness", score: selectedTender.aiSummary?.attractivenessScore || 0, color: "text-emerald-600 bg-emerald-50" },
                      { label: "Ease of Qual", score: selectedTender.aiSummary?.easeOfQualificationScore || 0, color: "text-indigo-600 bg-indigo-50" },
                      { label: "Competition Risk", score: selectedTender.aiSummary?.competitionRiskScore || 0, color: "text-rose-600 bg-rose-50" }
                    ].map((s, i) => (
                      <div key={i} className={`p-3 rounded-lg text-center ${s.color}`}>
                        <div className="text-base font-bold">{s.score}</div>
                        <div className="text-[9px] font-semibold text-slate-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Key Risks */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Key Risks Identified:</span>
                    <ul className="text-xs list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {selectedTender.aiSummary?.keyRisks && selectedTender.aiSummary.keyRisks.length > 0 ? (
                        selectedTender.aiSummary.keyRisks.map((risk, idx) => (
                          <li key={idx}>{risk}</li>
                        ))
                      ) : (
                        <li>No immediate environmental or supply-chain risks flagged.</li>
                      )}
                    </ul>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 z-10">
              <Button 
                variant="outline" 
                onClick={() => { setSelectedTender(null); setIsDetailOpen(false); }}
              >
                Close Details
              </Button>
              {selectedTender.status === "new" && (
                <div className="flex gap-2">
                  <Button 
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 bg-white"
                    onClick={() => { handleArchiveTender(selectedTender.id); setIsDetailOpen(false); }}
                  >
                    Reject
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => { handleApproveTender(selectedTender.id); setIsDetailOpen(false); }}
                  >
                    Approve & List
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
