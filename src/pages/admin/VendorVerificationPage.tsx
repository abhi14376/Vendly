import { useState, useMemo, useEffect } from "react";
import { Check, X, Search, Filter, ShieldCheck, Clock, XCircle, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { useVendorStore } from "@/store/vendorStore";
import type { VendorDocuments } from "@/features/vendors/data/vendorTypes";

const DOC_LABELS: { key: keyof VendorDocuments; label: string }[] = [
  { key: "gst",      label: "GST Cert" },
  { key: "pan",      label: "PAN Card" },
  { key: "turnover", label: "Turnover" },
];

export function VendorVerificationPage() {
  const vendors      = useVendorStore((state) => state.vendors);
  const updateStatus = useVendorStore((state) => state.updateStatus);
  const fetchVendors = useVendorStore((state) => state.fetchVendors);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const [searchTerm,      setSearchTerm]      = useState("");
  const [statusFilter,    setStatusFilter]    = useState("all");
  const [currentPage,     setCurrentPage]     = useState(1);
  const [actionId,        setActionId]        = useState<string | null>(null);
  const [actionType,      setActionType]      = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const itemsPerPage = 8;

  const filteredData = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        v.verificationStatus.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchTerm, statusFilter]);

  const totalPages  = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = () => {
    if (actionId && actionType) {
      updateStatus(
        actionId,
        actionType === "approve" ? "Approved" : "Disapproved",
        actionType === "reject" ? rejectionReason.trim() : undefined
      );
      setActionId(null);
      setActionType(null);
      setRejectionReason("");
    }
  };

  const openActionModal = (id: string, type: "approve" | "reject") => {
    setActionId(id);
    setActionType(type);
    setRejectionReason("");
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":    return <Badge variant="success"  className="gap-1 pl-1.5"><ShieldCheck className="h-3 w-3" /> Approved</Badge>;
      case "pending":     return <Badge variant="warning"  className="gap-1 pl-1.5"><Clock       className="h-3 w-3" /> Pending</Badge>;
      case "disapproved": return <Badge variant="error"    className="gap-1 pl-1.5"><XCircle     className="h-3 w-3" /> Disapproved</Badge>;
      default:            return <Badge variant="default" className="capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Vendor Verification
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Review compliance documents and approve or reject vendor profiles.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-2 sm:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
            <Input
              placeholder="Search vendors or contacts..."
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
            <option value="disapproved">Disapproved</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((v) => (
                <TableRow
                  key={v.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Vendor */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={v.avatarUrl}
                        alt={v.companyName}
                        fallback={v.companyName.charAt(0)}
                        className="h-8 w-8"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                          {v.companyName}
                        </div>
                        <div className="text-xs text-slate-500">{v.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Industry */}
                  <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
                    {v.industry}
                  </TableCell>

                  {/* Contact */}
                  <TableCell className="text-slate-600 dark:text-slate-300 text-sm">
                    {v.contactPerson}
                  </TableCell>

                  {/* Document checklist */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      {DOC_LABELS.map(({ key, label }) => {
                        const uploaded = v.documents?.[key] ?? false;
                        return (
                          <div key={key} className="flex items-center gap-1 text-xs">
                            {uploaded ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="h-3 w-3 text-slate-300 dark:text-slate-600 shrink-0" />
                            )}
                            <span className={uploaded ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>{getStatusBadge(v.verificationStatus)}</TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        disabled={v.verificationStatus !== "Pending"}
                        onClick={() => openActionModal(v.id, "approve")}
                      >
                        <Check className="mr-1 size-4" /> Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        disabled={v.verificationStatus !== "Pending"}
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
                <TableCell colSpan={6} className="h-32 text-center">
                  <EmptyState
                    title="No vendors found"
                    description="No matching vendors found. Adjust your search or filter."
                  />
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

      {/* Confirm modal */}
      <Modal open={!!actionId} onOpenChange={(open) => !open && (setActionId(null), setRejectionReason(""))}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Vendor
            </ModalTitle>
            <ModalDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this vendor? Their status will update instantly on the Lead portal."
                : "Please provide a reason for rejection. This will be visible to the Lead in their Vendor listing."}
            </ModalDescription>
          </ModalHeader>

          {/* Rejection reason textarea — shown only when rejecting */}
          {actionType === "reject" && (
            <div className="px-6 pb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-400 transition-all resize-none"
                rows={4}
                maxLength={400}
                placeholder="e.g. GST certificate is expired. Please resubmit with a valid certificate dated within the last 12 months."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="text-right text-xs text-slate-400 mt-1">
                {rejectionReason.length} / 400
              </div>
            </div>
          )}

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => { setActionId(null); setActionType(null); setRejectionReason(""); }}
            >
              Cancel
            </Button>
            <Button
              className={
                actionType === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }
              disabled={actionType === "reject" && !rejectionReason.trim()}
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
