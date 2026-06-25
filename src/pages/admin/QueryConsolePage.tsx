import { useState, useEffect, useMemo } from "react";
import { MessageSquareText, Search, Filter, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Textarea } from "@/components/ui/Textarea";
import { queryService } from "@/features/queries/services/queryService";
import { toast } from "sonner";

export function QueryConsolePage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [individualReplies, setIndividualReplies] = useState<string[]>([]);

  const itemsPerPage = 5;

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const result = await queryService.getQueries({ limit: 1000 });
      // Show ONLY queries received from Leads
      const leadQueries = result.data.filter(q => q.authorRole === 'lead');
      setQueries(leadQueries);
    } catch (err) {
      console.error("Failed to fetch queries:", err);
      toast.error("Failed to load queries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const initialMessageContent = activeMessages[0]?.content || "";

  const parsedQuestions = useMemo(() => {
    if (!initialMessageContent) return [];
    
    // Split by numbered items e.g. "1. " or " 2. "
    const regex = /(?:^|\s+)\d+\.\s+/g;
    const parts = initialMessageContent.split(regex);
    const questions = parts.map((p: string) => p.trim()).filter(Boolean);
    
    if (questions.length <= 1) {
      // Try double newlines
      const paragraphs = initialMessageContent.split(/\n{2,}/).map((p: string) => p.trim()).filter(Boolean);
      if (paragraphs.length > 1) {
        return paragraphs;
      }
      return [initialMessageContent];
    }
    
    return questions;
  }, [initialMessageContent]);

  useEffect(() => {
    if (parsedQuestions.length > 1) {
      setIndividualReplies(new Array(parsedQuestions.length).fill(""));
    } else {
      setIndividualReplies([]);
    }
  }, [parsedQuestions]);

  // Fetch messages thread for the active reply query
  useEffect(() => {
    if (replyId) {
      const fetchMessages = async () => {
        try {
          const msgs = await queryService.getQueryMessages(replyId);
          setActiveMessages(msgs);
        } catch (err) {
          console.error("Failed to fetch messages:", err);
          toast.error("Failed to load messages thread");
        }
      };
      fetchMessages();
    } else {
      setActiveMessages([]);
    }
  }, [replyId]);

  const handleReply = async () => {
    if (!replyId) return;

    let finalReply = "";
    if (parsedQuestions.length > 1) {
      const isAnyEmpty = individualReplies.some(r => !r.trim());
      if (isAnyEmpty) {
        toast.error("Please provide replies to all questions.");
        return;
      }
      finalReply = parsedQuestions.map((q: string, idx: number) => {
        const reply = individualReplies[idx]?.trim() || "";
        return `Clarification ${idx + 1}: ${reply}`;
      }).join('\n\n');
    } else {
      finalReply = replyMessage.trim();
    }

    if (!finalReply) {
      toast.error("Please enter a reply.");
      return;
    }

    try {
      await queryService.replyToQuery(replyId, finalReply, 'admin');
      toast.success("Reply sent successfully!");
      setReplyId(null);
      setReplyMessage("");
      setIndividualReplies([]);
      fetchQueries();
    } catch (err) {
      console.error("Failed to send reply:", err);
      toast.error("Failed to send reply");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return "warning";
      case "answered": return "success";
      case "closed": return "default";
      default: return "default";
    }
  };

  const filteredData = useMemo(() => {
    return queries.filter((q) => {
      const matchesSearch = 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.opportunityTitle && q.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || q.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [queries, searchTerm, statusFilter]);

  // Group filtered queries by Opportunity
  const groupedQueries = useMemo(() => {
    const groups: Record<string, { title: string; id?: string; queries: any[] }> = {};
    
    filteredData.forEach(q => {
      const oppId = q.opportunityId || 'general';
      const oppTitle = q.opportunityTitle || 'General Platform Inquiries';
      
      if (!groups[oppId]) {
        groups[oppId] = {
          title: oppTitle,
          id: q.opportunityId,
          queries: []
        };
      }
      groups[oppId].queries.push(q);
    });
    
    return Object.values(groups);
  }, [filteredData]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 block">Query Console</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage and respond to platform inquiries from your Leads.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-2 sm:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
            <Input
              placeholder="Search by subject, lead name or opportunity..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-500" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[140px]">
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
           <p className="text-slate-500">Loading Lead queries...</p>
        </div>
      ) : groupedQueries.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 text-center">
          <EmptyState title="No queries found" description="Try adjusting your filters or search term." />
        </div>
      ) : (
        <div className="space-y-6">
          {groupedQueries.map((group) => (
            <Card key={group.id || 'general'} className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow transition-all">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <CardTitle className="text-sm font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wide">
                    {group.title} {group.id ? `(Opportunity ID: ${group.id})` : ''}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/20 dark:bg-slate-950/5 font-semibold">
                      <TableHead className="w-[45%]">Subject</TableHead>
                      <TableHead>Lead Sender</TableHead>
                      <TableHead>Date Raised</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.queries.map((q) => (
                      <TableRow key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">{q.title}</TableCell>
                        <TableCell>{q.authorName}</TableCell>
                        <TableCell>{new Date(q.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(q.status)} className="capitalize">{q.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-medium" 
                            onClick={() => setReplyId(q.id)}
                          >
                            <MessageSquareText className="mr-1 size-4" /> 
                            {q.status === "open" || q.status === "in_review" ? "Reply" : "View Thread"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <Modal open={!!replyId} onOpenChange={(open) => {
        if (!open) {
          setReplyId(null);
          setReplyMessage("");
          setIndividualReplies([]);
        }
      }}>
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>Reply to Lead Query</ModalTitle>
            <ModalDescription>
              Provide clarification to the Lead. They will see this reply on their queries page and respective opportunity details view.
            </ModalDescription>
          </ModalHeader>
          
          <div className="py-4 space-y-4">
            {/* Conversation History */}
            <div className="max-h-[220px] overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversation History</span>
              {activeMessages.length === 0 ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMessages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.senderRole === 'admin' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2.5 rounded-xl max-w-[85%] text-xs ${
                        m.senderRole === 'admin'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}>
                        <span className="font-bold block mb-1 opacity-90 text-[10px]">
                          {m.senderName} ({m.senderRole.toUpperCase()})
                        </span>
                        <p className="leading-relaxed">{m.content}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">
                        {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {parsedQuestions.length > 1 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Draft Replies to Each Question</span>
                {parsedQuestions.map((q: string, idx: number) => (
                  <div key={idx} className="space-y-1.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                    <span className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 block leading-relaxed">
                      Question {idx + 1}: {q}
                    </span>
                    <Textarea 
                      placeholder={`Type your reply to question ${idx + 1}...`}
                      rows={3}
                      value={individualReplies[idx] || ""}
                      onChange={(e) => {
                        const newReplies = [...individualReplies];
                        newReplies[idx] = e.target.value;
                        setIndividualReplies(newReplies);
                      }}
                      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500">Draft Your Reply</span>
                <Textarea 
                  placeholder="Type your response here..." 
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850"
                />
              </div>
            )}
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => { setReplyId(null); setReplyMessage(""); setIndividualReplies([]); }}>Cancel</Button>
            <Button 
              onClick={handleReply} 
              disabled={
                parsedQuestions.length > 1 
                  ? individualReplies.some(r => !r.trim()) 
                  : !replyMessage.trim()
              }
            >
              Send Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
