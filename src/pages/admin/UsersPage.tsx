import { useState } from "react";
import { UserCheck, UserX, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { mockUsers } from "@/features/admin/utils/mockData";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";

export function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"activate" | "suspend" | null>(null);

  const itemsPerPage = 5;

  const filteredData = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || u.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = () => {
    if (actionId && actionType) {
      setUsers(users.map((u) => u.id === actionId ? { ...u, status: actionType === "activate" ? "active" : "suspended" } : u));
      setActionId(null);
      setActionType(null);
    }
  };

  const openActionModal = (id: string, type: "activate" | "suspend") => {
    setActionId(id);
    setActionType(type);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "suspended": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super_admin": return "info";
      case "lead": return "default";
      case "vendor": return "default";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage system users, roles, and access.</p>
        </div>
        <Button>Invite User</Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-2 sm:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
            <Input
              placeholder="Search by name or email..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-500" />
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-[140px]">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="lead">Lead</option>
            <option value="vendor">Vendor</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[140px]">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize">
                      {u.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(u.status)} className="capitalize">{u.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(u.lastLogin).toLocaleDateString()} {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {u.status !== "active" ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50" 
                          onClick={() => openActionModal(u.id, "activate")}
                        >
                          <UserCheck className="mr-1 size-4" /> Activate
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50" 
                          onClick={() => openActionModal(u.id, "suspend")}
                        >
                          <UserX className="mr-1 size-4" /> Suspend
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <EmptyState title="No users found" description="Try adjusting your filters or search term." />
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
            <ModalTitle>{actionType === "activate" ? "Activate User" : "Suspend User"}</ModalTitle>
            <ModalDescription>
              Are you sure you want to {actionType} this user? {actionType === "suspend" && "They will lose access to the platform."}
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" onClick={() => { setActionId(null); setActionType(null); }}>Cancel</Button>
            <Button 
              className={actionType === "activate" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"} 
              onClick={handleAction}
            >
              Confirm {actionType === "activate" ? "Activation" : "Suspension"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
