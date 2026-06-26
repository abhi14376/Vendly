import { useState, useEffect } from "react";
import { 
  ArrowLeft, Calendar, IndianRupee, MapPin, Briefcase, 
  Clock, FileText, Download, Share2, MessageSquare, Tag,
  File, Cpu, ClipboardList, Coins, Award, AlertTriangle, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Opportunity } from "@/types/Opportunity";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { opportunityService } from "@/services/opportunityService";
import { queryService } from "@/features/queries/services/queryService";
import { useNavigate } from "react-router";
import { CreateQueryModal } from "@/features/queries/components/CreateQueryModal";
import { ShareOpportunityModal } from "./ShareOpportunityModal";
import { toast } from "sonner";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/Modal";

interface OpportunityDetailsProps {
  id: string;
}

const parseItalicText = (text: string) => {
  if (!text) return "";
  const italicParts = text.split(/\*([\s\S]*?)\*/g);
  return italicParts.map((part, index) => {
    if (index % 2 === 1) {
      return <em key={`i-${index}`} className="italic text-slate-800 dark:text-slate-200">{part}</em>;
    }
    return part;
  });
};

const parseMarkdownText = (text: string) => {
  if (!text) return "";
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.flatMap((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={`b-${index}`} className="font-bold text-slate-900 dark:text-slate-100">
          {parseItalicText(part)}
        </strong>
      );
    }
    return parseItalicText(part);
  });
};

interface ParsedSections {
  overview?: string;
  scope?: string;
  financial?: string;
  dates?: string;
  eligibility?: string;
  special?: string;
}

const parseOpportunityMarkdown = (text: string): ParsedSections => {
  if (!text) return {};
  
  const sections: ParsedSections = {};
  const lines = text.split('\n');
  let currentSectionKey: keyof ParsedSections | null = null;
  let currentSectionContent: string[] = [];
  
  const saveCurrentSection = () => {
    if (currentSectionKey) {
      sections[currentSectionKey] = currentSectionContent.join('\n').trim();
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('###')) {
      saveCurrentSection();
      
      const headingText = trimmed.replace(/^###\s*(?:\d+\.)?\s*/, '').trim().toLowerCase();
      currentSectionContent = [];
      
      if (headingText.includes('overview') || headingText.includes('project overview')) {
        currentSectionKey = 'overview';
      } else if (headingText.includes('scope') || headingText.includes('work')) {
        currentSectionKey = 'scope';
      } else if (headingText.includes('financial') || headingText.includes('commercial')) {
        currentSectionKey = 'financial';
      } else if (headingText.includes('date') || headingText.includes('timeline')) {
        currentSectionKey = 'dates';
      } else if (headingText.includes('eligibility') || headingText.includes('qualification')) {
        currentSectionKey = 'eligibility';
      } else if (headingText.includes('special') || headingText.includes('condition') || headingText.includes('risk')) {
        currentSectionKey = 'special';
      } else {
        currentSectionKey = null;
      }
    } else {
      if (currentSectionKey) {
        currentSectionContent.push(line);
      }
    }
  }
  
  saveCurrentSection();
  return sections;
};

const renderSectionContent = (text: string) => {
  if (!text) return null;
  
  const blocks = text.split('\n\n');
  
  return (
    <div className="space-y-4">
      {blocks.map((block, bIdx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;
        
        const isList = lines.some(line => line.startsWith('-') || line.startsWith('*') || line.startsWith('•'));
        
        if (isList) {
          return (
            <ul key={bIdx} className="list-disc pl-5 space-y-1.5">
              {lines.map((line, lIdx) => {
                let cleanLine = line;
                if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
                  cleanLine = line.substring(2).trim();
                } else if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
                  cleanLine = line.substring(1).trim();
                }
                return (
                  <li key={lIdx} className="text-sm md:text-base text-slate-700 dark:text-slate-300">
                    {parseMarkdownText(cleanLine)}
                  </li>
                );
              })}
            </ul>
          );
        }
        
        return (
          <p key={bIdx} className="text-sm md:text-base text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {parseMarkdownText(block)}
          </p>
        );
      })}
    </div>
  );
};

export function OpportunityDetails({ id }: OpportunityDetailsProps) {
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [preFilledMsg, setPreFilledMsg] = useState("");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [opportunityQueries, setOpportunityQueries] = useState<any[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(true);

  const fetchQueries = async () => {
    setQueriesLoading(true);
    try {
      const result = await queryService.getQueries({ limit: 1000 });
      // Filter queries for this specific opportunity
      const oppQueries = result.data.filter((q: any) => q.opportunityId === id);
      
      // Fetch messages for each query to show conversation
      const queriesWithMessages = await Promise.all(
        oppQueries.map(async (q: any) => {
          const msgs = await queryService.getQueryMessages(q.id);
          return { ...q, messages: msgs };
        })
      );
      
      setOpportunityQueries(queriesWithMessages);
    } catch (err) {
      console.error("Failed to fetch opportunity queries:", err);
    } finally {
      setQueriesLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [id, isQueryModalOpen]);

  useEffect(() => {
    if (isPresetOpen) {
      setSelectedQueries([]);
    }
  }, [isPresetOpen]);

  useEffect(() => {
    const fetchOpportunity = async () => {
      setIsLoading(true);
      const data = await opportunityService.getOpportunityById(id);
      setOpportunity(data);
      setIsLoading(false);
    };
    fetchOpportunity();
  }, [id]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Open": return "success";
      case "In Progress": return "warning";
      case "Review": return "info";
      case "Closed": return "default";
      default: return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-[200px] w-full rounded-2xl" />
          </div>
          <div className="space-y-6 lg:col-span-1">
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Opportunity Not Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">The opportunity you are looking for does not exist or has been removed.</p>
        <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const parsedSections = parseOpportunityMarkdown(opportunity.description || opportunity.summary || '');
  const hasParsedSections = Object.values(parsedSections).some(v => v && v.trim() !== "");
  
  let overviewContent = parsedSections.overview || "";
  if (!hasParsedSections) {
    overviewContent = opportunity.description || opportunity.summary || "";
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800 pb-6 mb-2">
        {/* Back button row */}
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="self-start -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getStatusVariant(opportunity.status)}>{opportunity.status}</Badge>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" /> {opportunity.category}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            ID: {opportunity.id}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
          {opportunity.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2 pb-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Opportunity Work Summary</h2>
          </div>

          {/* 1. Project Overview */}
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">1. Project Overview</CardTitle>
                  <CardDescription className="text-xs">Key authority, category, and administrative overview</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-905">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tendering Authority</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.authorityName || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Project Location</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.location || opportunity.stateLocationName || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Project Type</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{opportunity.projectType || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Work Category</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.category || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Industry Segment</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.industryType || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
                  <Badge variant={getStatusVariant(opportunity.status)} className="mt-0.5">{opportunity.status}</Badge>
                </div>
              </div>
              {overviewContent && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Description / Executive Brief</span>
                  {renderSectionContent(overviewContent)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Scope of Work */}
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">2. Scope of Work</CardTitle>
                  <CardDescription className="text-xs">Deliverables, components, and target vendor specifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {opportunity.recommendedSize && (
                <div className="p-3 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-lg border border-emerald-100/50 dark:border-emerald-900/30 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Recommended Vendor Profile</span>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-none">{opportunity.recommendedSize}</Badge>
                </div>
              )}
              
              {parsedSections.scope ? (
                renderSectionContent(parsedSections.scope)
              ) : (
                <div className="space-y-4">
                  {opportunity.keyWorkComponents && opportunity.keyWorkComponents.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Key Work Components</span>
                      <ul className="list-disc pl-5 space-y-1.5">
                        {opportunity.keyWorkComponents.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {opportunity.keyActions && opportunity.keyActions.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Key Actions for Vendor</span>
                      <ul className="list-disc pl-5 space-y-1.5">
                        {opportunity.keyActions.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!opportunity.keyWorkComponents?.length && !opportunity.keyActions?.length && (
                    <p className="text-sm text-slate-500 italic">Detailed scope not specified in structured format.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Financial & Commercial Details */}
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">3. Financial & Commercial Details</CardTitle>
                  <CardDescription className="text-xs">Project budget, EMD, fees, and commercial conditions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-905">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Estimated Project Value</span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(opportunity.budget)}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">EMD Required</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.emdRequired ? 'Yes' : 'No'}</span>
                </div>
                {opportunity.emdRequired && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">EMD Amount</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(opportunity.emdAmount || 0)}</span>
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tender Fee</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.tenderFee ? formatCurrency(opportunity.tenderFee) : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Performance Security</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.performanceSecurity || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Royalty Applicable</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.royaltyRequired ? `Yes (${opportunity.royaltyPercentage}%)` : 'No'}</span>
                </div>
                {opportunity.wonRateStatus && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Won Rate Status</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.wonRateStatus} ({opportunity.wonRatePercentage}%)</span>
                  </div>
                )}
              </div>

              {parsedSections.financial && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Additional Commercial Notes</span>
                  {renderSectionContent(parsedSections.financial)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Critical Dates & Timelines */}
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">4. Critical Dates & Timelines</CardTitle>
                  <CardDescription className="text-xs">Deadlines, pre-bid meetings, and schedule parameters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-905">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Submission Deadline</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{formatDate(opportunity.deadline)}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Expected Award Date</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.awardDate ? formatDate(opportunity.awardDate) : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Publish Date</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.publishDate ? formatDate(opportunity.publishDate) : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pre-Bid Meeting Date</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.preBidDate ? formatDate(opportunity.preBidDate) : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Opening Date</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.openingDate ? formatDate(opportunity.openingDate) : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Bid Validity</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.bidValidity || 'Not specified'}</span>
                </div>
              </div>

              {parsedSections.dates && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Timeline Summary & Milestone Notes</span>
                  {renderSectionContent(parsedSections.dates)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. Eligibility & Pre-Qualification */}
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">5. Eligibility & Pre-Qualification</CardTitle>
                  <CardDescription className="text-xs">Experience, turnover requirements, and corporate credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-905">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Min Experience Required</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.minYearsExp ? `${opportunity.minYearsExp} Years` : 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Min Turnover Requirement</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.turnoverRequirement ? formatCurrency(opportunity.turnoverRequirement) : 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Net Worth Requirement</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{opportunity.netWorthRequirement ? formatCurrency(opportunity.netWorthRequirement) : 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Joint Venture (JV)</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.jvAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Consortium Allowed</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{opportunity.consortiumAllowed ? 'Allowed' : 'Not Allowed'}</span>
                </div>
              </div>

              {parsedSections.eligibility ? (
                renderSectionContent(parsedSections.eligibility)
              ) : (
                <div className="space-y-4">
                  {opportunity.eligibilityCriteria && opportunity.eligibilityCriteria.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Technical & Financial Eligibility</span>
                      <ul className="list-disc pl-5 space-y-1.5">
                        {opportunity.eligibilityCriteria.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {opportunity.oemRequirements && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">OEM Requirements</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{opportunity.oemRequirements}</p>
                    </div>
                  )}
                  {!opportunity.eligibilityCriteria?.length && !opportunity.oemRequirements && (
                    <p className="text-sm text-slate-500 italic">Detailed eligibility not specified in structured format.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 6. Special Conditions */}
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-l-4 border-l-slate-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">6. Special Conditions</CardTitle>
                  <CardDescription className="text-xs">Risks, constraints, penalties, and custom requirements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {parsedSections.special ? (
                renderSectionContent(parsedSections.special)
              ) : (
                <div className="space-y-4">
                  {opportunity.redFlags && opportunity.redFlags.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 text-rose-500">Key Risks & Red Flags</span>
                      <ul className="list-disc pl-5 space-y-1.5">
                        {opportunity.redFlags.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-700 dark:text-slate-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {opportunity.additionalInput && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Additional Instructions</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50 whitespace-pre-wrap">{opportunity.additionalInput}</p>
                    </div>
                  )}
                  {!opportunity.redFlags?.length && !opportunity.additionalInput && (
                    <p className="text-sm text-slate-500 italic">No special conditions or risks defined.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {opportunity.documents && opportunity.documents.length > 0 && (
            <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Attached Documents</CardTitle>
                <CardDescription>Review supporting files and requirements.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {opportunity.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg mr-3 text-indigo-600 dark:text-indigo-400">
                          <File className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{doc.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{doc.size}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-indigo-400" 
                        aria-label={`Download ${doc.name}`}
                        onClick={() => {
                          toast.success(`Downloading ${doc.name} to share with vendors...`);
                          const link = document.createElement('a');
                          link.href = doc.url || '#';
                          link.setAttribute('download', doc.name);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Queries & Admin Clarifications Card */}
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Queries & Admin Clarifications</CardTitle>
                  <CardDescription className="text-xs">Submit and review clarifications regarding this opportunity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {queriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : opportunityQueries.length === 0 ? (
                <div className="text-center py-6 px-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No queries raised yet. If you have questions regarding the eligibility, timelines or scope, raise a query to get support from platform administrators.
                  </p>
                  <div className="mt-4 flex justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => setIsPresetOpen(true)}>
                      <Cpu className="h-3.5 w-3.5 mr-1.5 text-indigo-500 animate-pulse" /> Preset AI Queries
                    </Button>
                    <Button size="sm" onClick={() => setIsQueryModalOpen(true)}>
                      Raise Query
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
                  {opportunityQueries.map((query, idx) => (
                    <div key={query.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{query.title}</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Raised on {new Date(query.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Status:
                          </span>
                          <Badge variant={getStatusVariant(query.status)} className="capitalize">{query.status}</Badge>
                        </div>
                      </div>

                      {/* Question thread message */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Your Question</span>
                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-350 whitespace-pre-wrap leading-relaxed">
                          {query.messages && query.messages.length > 0 ? query.messages[0].content : query.title}
                        </p>
                      </div>

                      {/* Admin clarification responses */}
                      {query.messages && query.messages.filter((m: any) => m.senderRole === 'admin').map((reply: any) => (
                        <div key={reply.id} className="ml-4 p-3.5 bg-indigo-50/40 dark:bg-indigo-950/10 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                              Admin Clarification
                            </span>
                            <span className="text-[9px] text-slate-400">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                            {reply.content}
                          </p>
                        </div>
                      ))}

                      {/* Inline share button */}
                      <div className="flex justify-end pt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-650 hover:text-indigo-755 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-xs font-semibold"
                          onClick={() => setIsShareModalOpen(true)}
                        >
                          <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Clarification
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sticky Action Panel */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 backdrop-blur-md shadow-xl shadow-indigo-500/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Opportunity Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Status</span>
                  <Badge variant={getStatusVariant(opportunity.status)}>{opportunity.status}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Applicants</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{opportunity.applicationsCount}</span>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all" size="lg" disabled={opportunity.status !== 'Open' && opportunity.status !== 'Published'}>
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    size="lg"
                    onClick={() => setIsQueryModalOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> Raise Query
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-indigo-50/50 border-indigo-255 text-indigo-700 hover:bg-indigo-100/60 dark:bg-indigo-950/20 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                    size="lg"
                    onClick={() => setIsPresetOpen(true)}
                  >
                    <Cpu className="h-4 w-4 mr-2 text-indigo-500 animate-pulse" /> Preset AI Queries
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-emerald-50/50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/60 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                    size="lg"
                    onClick={() => setIsShareModalOpen(true)}
                  >
                    <Share2 className="h-4 w-4 mr-2 text-emerald-500" /> Share Opportunity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => {
          setIsQueryModalOpen(false);
          setPreFilledMsg("");
        }}
        defaultValues={{
          title: `Clarification: ${opportunity.title}`,
          category: "Opportunities",
          initialMessage: preFilledMsg || ""
        }}
      />

      <ShareOpportunityModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        opportunity={opportunity}
      />

      {/* Preset Queries Modal */}
      <Modal open={isPresetOpen} onOpenChange={(open: boolean) => !open && setIsPresetOpen(false)}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Cpu className="h-5 w-5 text-indigo-500 animate-pulse" />
              <span>Preset AI Clarifications</span>
            </ModalTitle>
            <ModalDescription>
              Select one or more AI-generated questions specific to the <strong>{opportunity.category}</strong> work sector to pre-fill the Query creation form.
            </ModalDescription>
          </ModalHeader>
          
          <div className="py-4 space-y-3">
            {/* Select All Toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500">Preset Clarifications</span>
              <button
                type="button"
                onClick={() => {
                  const all = getPresetQueriesForCategory(opportunity.category);
                  if (selectedQueries.length === all.length) {
                    setSelectedQueries([]);
                  } else {
                    setSelectedQueries([...all]);
                  }
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {selectedQueries.length === getPresetQueriesForCategory(opportunity.category).length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {getPresetQueriesForCategory(opportunity.category).map((q, idx) => {
              const isChecked = selectedQueries.includes(q);
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none shadow-sm hover:shadow ${
                    isChecked
                      ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-950/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setSelectedQueries(prev =>
                        prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
                      );
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {q}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsPresetOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={selectedQueries.length === 0}
              onClick={() => {
                const combinedMessage = selectedQueries.length === 1
                  ? selectedQueries[0]
                  : selectedQueries.map((q, idx) => `${idx + 1}. ${q}`).join('\n\n');
                setPreFilledMsg(combinedMessage);
                setIsPresetOpen(false);
                setIsQueryModalOpen(true);
              }}
            >
              Confirm Selection ({selectedQueries.length})
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

const getPresetQueriesForCategory = (category: string): string[] => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("solar")) {
    return [
      "Has the site survey for structural load-bearing capacity of the rooftops been completed, and is the report available?",
      "Are the solar modules required to be strictly from the ALMM list, or are imported panels allowed under custom duty exclusions?",
      "What is the expected timeline for net-metering approval from the state DISCOM, and is the contractor responsible for this?"
    ];
  } else if (cat.includes("road") || cat.includes("highway") || cat.includes("bridge") || cat.includes("civil") || cat.includes("construction")) {
    return [
      "What is the percentage of land acquisition completed at the time of bid submission?",
      "Are utility shifting costs (electrical poles, water lines) included in the bid value, or will they be reimbursed separately?",
      "Has the environmental clearance for the forest/buffer zone stretch been obtained?"
    ];
  } else if (cat.includes("water") || cat.includes("sewer") || cat.includes("stp") || cat.includes("pipe")) {
    return [
      "Is the soil testing report for the pipeline trenching routes available, especially for rocky terrains?",
      "Is the power connection for the intake pump stations/STP included in the scope, or will it be provided by the department?",
      "What is the warranty period and chemical dosing cost responsibility during the 5-year O&M period?"
    ];
  } else {
    return [
      "Are joint ventures (JV) or consortiums allowed, and if yes, what is the maximum number of partners?",
      "What are the payment milestone terms, and is there any mobilization advance provided?",
      "Is there any price escalation clause for steel, cement, and fuel during the execution period?"
    ];
  }
};
