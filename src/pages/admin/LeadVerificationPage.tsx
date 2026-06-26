import { useState, useEffect } from "react";
import { Check, X, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";

interface LeadProfile {
  id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  company_name: string | null;
  verification: string;
  created_at: string;
}

export function LeadVerificationPage() {
  const [leads, setLeads] = useState<LeadProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const supabase = getSupabaseClient();
    if (!supabase) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, mobile, company_name, verification, created_at")
        .eq("role", "lead")
        .order("created_at", { ascending: false });
      if (!error) setLeads(data ?? []);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = leads.filter((v) => {
    const matchesSearch =
      (v.full_name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.company_name ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.verification?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = async () => {
    if (!actionId || !actionType) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setActionLoading(true);
    const newStatus = actionType === "approve" ? "approved" : "rejected";

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ verification: newStatus })
        .eq("id", actionId);

      if (error) {
        toast.error(`Failed to ${actionType} lead: ${error.message}`);
      } else {
        toast.success(`Lead ${newStatus} successfully!`);
        setLeads((prev) =>
          prev.map((l) => (l.id === actionId ? { ...l, verification: newStatus } : l))
        );
      }
    } catch (err) {
      toast.error("Unexpected error. Please try again.");
    } finally {
      setActionLoading(false);
      setActionId(null);
      setActionType(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch ((status ?? "").toLowerCase()) {
      case "approved": return "success";
      case "pending": return "warning";
      case "rejected": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Lead Verification</h1>
        <p className="text-slate-500 dark:text-slate-400">Review and approve new lead registrations.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-2 sm:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
            <Input
              placeholder="Search name, email or company..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-500" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-400">Loading...</TableCell>
              </TableRow>
            ) : currentData.length > 0 ? (
              currentData.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.full_name}</TableCell>
                  <TableCell>{v.company_name ?? "—"}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>{new Date(v.created_at).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(v.verification)} className="capitalize">
                      {v.verification ?? "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        disabled={v.verification !== "pending"}
                        onClick={() => { setActionId(v.id); setActionType("approve"); }}
                      >
                        <Check className="mr-1 size-4" /> Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        disabled={v.verification !== "pending"}
                        onClick={() => { setActionId(v.id); setActionType("reject"); }}
                      >
                        <X className="mr-1 size-4" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <EmptyState title="No lead registrations" description="Leads who sign up will appear here for review." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filteredData.length > itemsPerPage && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      <Modal open={!!actionId} onOpenChange={(open) => !open && setActionId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{actionType === "approve" ? "Approve" : "Reject"} Verification</ModalTitle>
            <ModalDescription>
              Are you sure you want to {actionType} this lead? This will update their account status.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" onClick={() => { setActionId(null); setActionType(null); }}>Cancel</Button>
            <Button
              className={actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}
              loading={actionLoading}
              onClick={handleAction}
            >
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
