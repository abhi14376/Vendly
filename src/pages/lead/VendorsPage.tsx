import React, { useState, useMemo, useEffect } from "react";
import {
  Search, LayoutGrid, List, Building2, MapPin, Globe, ExternalLink,
  User, Plus, CheckCircle2, Circle, ShieldCheck, Clock, XCircle, AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/Pagination";
import { CreateVendorModal } from "@/features/vendors/components/CreateVendorModal";
import { useVendorStore } from "@/store/vendorStore";
import type { VerificationStatus, VendorDocuments } from "@/features/vendors/data/vendorTypes";
import { cn } from "@/utils/cn";

// ── Document checklist shown on each vendor card/row ─────────────────────────
const DOC_LABELS: { key: keyof VendorDocuments; label: string }[] = [
  { key: "gst",      label: "GST Certificate" },
  { key: "pan",      label: "PAN Card" },
  { key: "turnover", label: "Turnover Certs" },
];

function DocumentChecklist({ docs }: { docs?: VendorDocuments }) {
  return (
    <div className="flex flex-col gap-1 mt-3">
      {DOC_LABELS.map(({ key, label }) => {
        const uploaded = docs?.[key] ?? false;
        return (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            {uploaded ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
            <span className={uploaded ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600"}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Status badge with icon ─────────────────────────────────────────────────────
function StatusBadge({ status }: { status: VerificationStatus }) {
  if (status === "Approved") {
    return (
      <Badge variant="success" className="gap-1 pl-1.5">
        <ShieldCheck className="h-3 w-3" /> Approved
      </Badge>
    );
  }
  if (status === "Pending") {
    return (
      <Badge variant="warning" className="gap-1 pl-1.5">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  }
  return (
    <Badge variant="error" className="gap-1 pl-1.5">
      <XCircle className="h-3 w-3" /> Disapproved
    </Badge>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function VendorsPage() {
  const vendors = useVendorStore((state) => state.vendors);
  const fetchVendors = useVendorStore((state) => state.fetchVendors);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Approved");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [search, industryFilter, statusFilter, sortOrder, currentPage, viewMode, refreshTrigger]);

  const filteredAndSortedVendors = useMemo(() => {
    let result = [...vendors];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.companyName.toLowerCase().includes(q) ||
          v.contactPerson.toLowerCase().includes(q)
      );
    }

    if (industryFilter !== "All") {
      result = result.filter((v) => v.industry === industryFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((v) => v.verificationStatus === statusFilter);
    }

    result.sort((a, b) => {
      const cmp = a.companyName.localeCompare(b.companyName);
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [vendors, search, industryFilter, statusFilter, sortOrder, refreshTrigger]);

  const totalPages = Math.ceil(filteredAndSortedVendors.length / itemsPerPage);
  const currentVendors = filteredAndSortedVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const industries = ["All", ...Array.from(new Set(vendors.map((v) => v.industry)))].map((i) => ({
    label: i,
    value: i,
  }));
  const statuses = [
    { label: "All Statuses", value: "All" },
    { label: "Approved",     value: "Approved" },
    { label: "Pending",      value: "Pending" },
    { label: "Disapproved",  value: "Disapproved" },
  ];
  const sortOptions = [
    { label: "Name (A-Z)", value: "asc" },
    { label: "Name (Z-A)", value: "desc" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vendor Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Discover and manage vendor relationships.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
          >
            <Plus className="h-4 w-4" /> Create New Vendor
          </Button>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              aria-label="Table View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="md:col-span-1">
          <Select
            options={industries}
            value={industryFilter}
            onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="md:col-span-1">
          <Select
            options={statuses}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="md:col-span-1">
          <Select
            options={sortOptions}
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value as "asc" | "desc"); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="mt-6">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-4">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        )
      ) : currentVendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No vendors found</h3>
          <p className="mt-2 max-w-sm text-center text-sm text-slate-500 dark:text-slate-400">
            We couldn't find any vendors matching your current filters. Try adjusting your search criteria.
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => { setSearch(""); setIndustryFilter("All"); setStatusFilter("All"); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* ── GRID VIEW ── */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentVendors.map((vendor) => (
            <Card
              key={vendor.id}
              className={cn(
                "overflow-hidden hover:shadow-md transition-all duration-300 border-slate-200/50 dark:border-slate-800/50",
                vendor.verificationStatus === "Approved" &&
                  "ring-1 ring-emerald-400/40 dark:ring-emerald-600/30"
              )}
            >
              <CardContent className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={vendor.avatarUrl}
                      alt={vendor.companyName}
                      fallback={vendor.companyName.charAt(0)}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {vendor.companyName}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{vendor.industry}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={vendor.verificationStatus} />
                </div>

                {/* Details */}
                <div className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{vendor.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline line-clamp-1 dark:text-primary-400"
                    >
                      {vendor.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>

                {/* Rejection reason banner */}
                {vendor.verificationStatus === "Disapproved" && vendor.rejectionReason && (
                  <div className="mt-4 flex gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 p-3">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-0.5">Not Approved — Reason</p>
                      <p className="text-xs text-rose-600 dark:text-rose-300 leading-relaxed">{vendor.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {/* Document checklist */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Compliance Documents
                  </p>
                  <DocumentChecklist docs={vendor.documents} />
                </div>

                {/* Footer button */}
                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Button variant="secondary" fullWidth className="group">
                    View Profile{" "}
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* ── TABLE VIEW ── */
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVendors.map((vendor) => (
                <React.Fragment key={vendor.id}>
                  <TableRow className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={vendor.avatarUrl}
                          alt={vendor.companyName}
                          fallback={vendor.companyName.charAt(0)}
                          className="h-8 w-8"
                        />
                        <div className="font-medium text-slate-900 dark:text-white">
                          {vendor.companyName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300">
                      {vendor.industry}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={vendor.verificationStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {DOC_LABELS.map(({ key, label }) => {
                          const uploaded = vendor.documents?.[key] ?? false;
                          return (
                            <div key={key} className="flex items-center gap-1 text-xs">
                              {uploaded ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="h-3 w-3 text-slate-300 dark:text-slate-600 shrink-0" />
                              )}
                              <span className={uploaded ? "text-slate-600 dark:text-slate-300" : "text-slate-400"}>
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-600 dark:text-slate-300">
                      {vendor.location}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-300">
                      {vendor.contactPerson}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="default">
                        View <span className="sr-only">Profile</span>
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Rejection reason — shown as a full-width sub-row beneath the vendor */}
                  {vendor.verificationStatus === "Disapproved" && vendor.rejectionReason && (
                    <TableRow className="bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/30">
                      <TableCell colSpan={7} className="py-2.5 pl-14 border-t-0">
                        <div className="flex items-start gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-rose-600 dark:text-rose-400">
                            <span className="font-semibold">Not Approved: </span>
                            {vendor.rejectionReason}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                if (
                  (page === 2 && currentPage > 3) ||
                  (page === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <span className="flex h-10 w-10 items-center justify-center text-sm text-slate-500">...</span>
                    </PaginationItem>
                  );
                }
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <CreateVendorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onVendorCreated={() => setRefreshTrigger((t) => t + 1)}
      />
    </div>
  );
}
