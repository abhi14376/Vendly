import { useState, useMemo, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Search, Share2, Cpu } from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { type VendorProfile } from "@/features/vendors/data/vendorTypes";
import { useShareStore } from "../store/useShareStore";
import { toast } from "sonner";
import { Opportunity } from "@/types/Opportunity";
import { queryService } from "@/features/queries/services/queryService";

interface ShareOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
}

export function ShareOpportunityModal({
  isOpen,
  onClose,
  opportunity,
}: ShareOpportunityModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunityQueries, setOpportunityQueries] = useState<any[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(true);

  const [includeAiReport, setIncludeAiReport] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedClars, setSelectedClars] = useState<string[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);

  const { shareOpportunity } = useShareStore();

  // Load answered queries/clarifications on mount when modal opens
  useEffect(() => {
    if (isOpen && opportunity?.id) {
      const fetchQueries = async () => {
        setQueriesLoading(true);
        try {
          const result = await queryService.getQueries({ limit: 1000 });
          const oppQueries = result.data.filter(
            (q: any) => q.opportunityId === opportunity.id && q.status === "answered"
          );
          setOpportunityQueries(oppQueries);
        } catch (err) {
          console.error("Failed to fetch opportunity queries:", err);
        } finally {
          setQueriesLoading(false);
        }
      };
      fetchQueries();
    }
  }, [isOpen, opportunity?.id]);

  // Sync documents selection
  useEffect(() => {
    if (opportunity?.documents) {
      setSelectedDocs(opportunity.documents.map((d) => d.name));
    } else {
      setSelectedDocs([]);
    }
  }, [opportunity]);

  // Sync clarifications selection
  useEffect(() => {
    setSelectedClars(opportunityQueries.map((q) => q.id));
  }, [opportunityQueries]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedVendorIds([]);
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(
      (vendor) =>
        vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleVendor = (vendorId: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const toggleAllVendors = () => {
    if (selectedVendorIds.length === filteredVendors.length) {
      setSelectedVendorIds([]);
    } else {
      setSelectedVendorIds(filteredVendors.map((v) => v.id));
    }
  };

  const handleShareAll = () => {
    if (selectedVendorIds.length === 0) return;

    selectedVendorIds.forEach((vendorId) => {
      shareOpportunity(vendorId, opportunity.id);
    });

    const vendorNames = vendors
      .filter((v) => selectedVendorIds.includes(v.id))
      .map((v) => v.companyName)
      .join(", ");

    // Construct detailed success message
    const sharedComponents = [];
    if (includeAiReport) sharedComponents.push("AI Sourcing Report PDF");
    if (selectedDocs.length > 0) {
      sharedComponents.push(`${selectedDocs.length} sourcing document(s)`);
    }
    if (selectedClars.length > 0) {
      sharedComponents.push(`${selectedClars.length} clarification(s)`);
    }

    const packageMsg = sharedComponents.length > 0
      ? `Package includes: ${sharedComponents.join(", ")}.`
      : "Opportunity details shared.";

    toast.success(`Successfully shared with: ${vendorNames}. ${packageMsg}`);
    
    setSelectedVendorIds([]);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-3xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <ModalHeader className="pb-2 shrink-0">
          <ModalTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Share Sourcing & Clarification Package
          </ModalTitle>
          <ModalDescription>
            Compile and share the details of <strong>{opportunity.title}</strong> with verified vendors.
          </ModalDescription>
        </ModalHeader>

        {/* Scrollable Package & Vendor Configuration Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
          {/* Package Configuration */}
          <div className="p-4 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 space-y-4 shrink-0">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">1. Configure Sharing Package</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* AI Report Checklist */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-950 cursor-pointer hover:border-indigo-500 transition-colors">
                <input
                  type="checkbox"
                  checked={includeAiReport}
                  onChange={() => setIncludeAiReport(!includeAiReport)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">AI Sourcing Report PDF</span>
                  <span className="text-[10px] text-slate-400">Include automated work summary report</span>
                </div>
              </label>

              {/* Documents Checklist */}
              <div className="p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Sourcing Documents</span>
                {opportunity.documents && opportunity.documents.length > 0 ? (
                  <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-1">
                    {opportunity.documents.map((doc) => (
                      <label key={doc.name} className="flex items-center gap-2 cursor-pointer select-none text-[10px] text-slate-600 dark:text-slate-450">
                        <input
                          type="checkbox"
                          checked={selectedDocs.includes(doc.name)}
                          onChange={() => {
                            setSelectedDocs(prev =>
                              prev.includes(doc.name) ? prev.filter(n => n !== doc.name) : [...prev, doc.name]
                            );
                          }}
                          className="h-3 w-3 rounded border-slate-305 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="truncate">{doc.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No documents attached</span>
                )}
              </div>

              {/* Admin Clarifications Checklist */}
              <div className="p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Admin Clarifications</span>
                {queriesLoading ? (
                  <span className="text-[10px] text-slate-400 animate-pulse">Loading clarifications...</span>
                ) : opportunityQueries.length > 0 ? (
                  <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-1">
                    {opportunityQueries.map((q) => (
                      <label key={q.id} className="flex items-center gap-2 cursor-pointer select-none text-[10px] text-slate-600 dark:text-slate-455">
                        <input
                          type="checkbox"
                          checked={selectedClars.includes(q.id)}
                          onChange={() => {
                            setSelectedClars(prev =>
                              prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]
                            );
                          }}
                          className="h-3 w-3 rounded border-slate-305 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="truncate">{q.title}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No admin replies available</span>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Selection Section */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">2. Select Recipient Vendors</span>
            
            <div className="shrink-0">
              <Input
                icon={<Search className="h-4 w-4 text-slate-400" />}
                placeholder="Search vendors by name or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden">
              {filteredVendors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No vendors found</p>
                  <p className="text-sm text-slate-500 mt-1">Try a different search query.</p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-slate-100/80 dark:bg-slate-850 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="w-[30%]">Company</TableHead>
                        <TableHead className="w-[20%]">Industry</TableHead>
                        <TableHead className="w-[20%]">Contact Person</TableHead>
                        <TableHead className="w-[30%]">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedVendorIds.length === filteredVendors.length && filteredVendors.length > 0}
                              onChange={toggleAllVendors}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Email ID</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.map((vendor) => {
                        const isChecked = selectedVendorIds.includes(vendor.id);
                        return (
                          <TableRow key={vendor.id} className="hover:bg-white dark:hover:bg-slate-900/30 transition-colors">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={vendor.avatarUrl}
                                  alt={vendor.companyName}
                                  fallback={vendor.companyName.charAt(0)}
                                  className="h-8 w-8"
                                />
                                <span className="line-clamp-1">{vendor.companyName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="font-normal">
                                {vendor.industry}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {vendor.contactPerson}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`chk-${vendor.id}`}
                                  checked={isChecked}
                                  onChange={() => toggleVendor(vendor.id)}
                                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={`chk-${vendor.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-350 cursor-pointer line-clamp-1">
                                  {vendor.email}
                                </label>
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
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 mt-2 shrink-0 bg-white dark:bg-slate-950">
          <span className="text-xs text-slate-500 font-medium">
            {selectedVendorIds.length} vendor(s) selected
          </span>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={selectedVendorIds.length === 0}
              onClick={handleShareAll}
            >
              Send Package ({selectedVendorIds.length})
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
