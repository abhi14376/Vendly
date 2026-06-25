import { useState } from "react";
import { Check, X, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { mockLeadVerifications } from "@/features/admin/utils/mockData";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/authStore";

export function LeadVerificationPage() {
  const [verifications, setVerifications] = useState(() => {
    const local = JSON.parse(localStorage.getItem("vendly-lead-verifications") || "[]");
    const localFiltered = local.filter((l: any) => !mockLeadVerifications.some(m => m.email === l.email));
    return [...localFiltered, ...mockLeadVerifications];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const itemsPerPage = 5;

  const filteredData = verifications.filter((v) => {
    const matchesSearch = v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || v.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = () => {
    if (actionId && actionType) {
      const updated = verifications.map((v) => 
        v.id === actionId ? { ...v, status: actionType === "approve" ? "approved" : "rejected" } : v
      );
      setVerifications(updated);

      // Save back to local storage for verification requests
      const customVerifs = updated.filter(v => v.id.startsWith("lv-"));
      localStorage.setItem("vendly-lead-verifications", JSON.stringify(customVerifs));

      // Sync user profile state and dispatch approval notifications
      const targetRequest = verifications.find(v => v.id === actionId);
      if (targetRequest) {
        try {
          const localUsers = JSON.parse(localStorage.getItem("vendly-local-users") || "[]");
          const updatedUsers = localUsers.map((u: any) => 
            u.email === targetRequest.email ? { ...u, verificationStatus: actionType === "approve" ? "approved" : "rejected" } : u
          );
          localStorage.setItem("vendly-local-users", JSON.stringify(updatedUsers));

          // Refresh current user session context if they are approved
          const authState = useAuthStore.getState();
          if (authState.currentUser && authState.currentUser.email === targetRequest.email) {
            authState.refreshUser({
              ...authState.currentUser,
              verificationStatus: actionType === "approve" ? "approved" : "rejected",
            });
          }

          // Dispatch congratulations notification to Lead
          const userNotifKey = `vendly-notifications-${targetRequest.email}`;
          const currentNotifs = JSON.parse(localStorage.getItem(userNotifKey) || "[]");
          currentNotifs.unshift({
            id: `approval-${Date.now()}`,
            type: "system",
            title: actionType === "approve" ? "Profile Verified" : "Profile Unverified",
            message: actionType === "approve" 
              ? "Congratulations! Your Lead profile has been reviewed and approved. A Verified badge is now shown next to your name."
              : "Your Lead profile verification request was rejected. Please update your profile details in settings.",
            createdAt: new Date().toISOString(),
            isRead: false,
            link: "/dashboard/settings"
          });
          localStorage.setItem(userNotifKey, JSON.stringify(currentNotifs));
        } catch (e) {
          console.error("Failed to sync verification actions:", e);
        }
      }

      setActionId(null);
      setActionType(null);
    }
  };

  const openActionModal = (id: string, type: "approve" | "reject") => {
    setActionId(id);
    setActionType(type);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
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
              placeholder="Search companies or contacts..."
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
              <TableHead>Company Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.companyName}</TableCell>
                  <TableCell>{v.contactName}</TableCell>
                  <TableCell>{v.email}</TableCell>
                  <TableCell>{new Date(v.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(v.status)} className="capitalize">{v.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50" 
                        disabled={v.status !== "pending"}
                        onClick={() => openActionModal(v.id, "approve")}
                      >
                        <Check className="mr-1 size-4" /> Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50" 
                        disabled={v.status !== "pending"}
                        onClick={() => openActionModal(v.id, "reject")}
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
                  <EmptyState title="No verification requests" description="No matching requests found." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filteredData.length > itemsPerPage && (
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <Modal open={!!actionId} onOpenChange={(open) => !open && setActionId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{actionType === "approve" ? "Approve" : "Reject"} Verification</ModalTitle>
            <ModalDescription>
              Are you sure you want to {actionType} this lead? This action will update their account status and notify them.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" onClick={() => { setActionId(null); setActionType(null); }}>Cancel</Button>
            <Button 
              className={actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"} 
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
