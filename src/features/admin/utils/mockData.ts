import { mockOpportunities } from "@/lib/mockOpportunities";

// Users mock data
export type UserRole = "lead" | "vendor" | "admin" | "super_admin";
export type UserStatus = "active" | "suspended" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

export const mockUsers: User[] = [
  { id: "usr_1", name: "Alice Johnson", email: "alice@techcorp.com", role: "lead", status: "active", lastLogin: "2026-06-18T09:00:00Z", createdAt: "2026-01-15T10:00:00Z" },
  { id: "usr_2", name: "Bob Smith", email: "bob@vendorglobal.com", role: "vendor", status: "active", lastLogin: "2026-06-17T14:30:00Z", createdAt: "2026-02-20T11:20:00Z" },
  { id: "usr_3", name: "Charlie Davis", email: "charlie@admin.vendly.com", role: "admin", status: "active", lastLogin: "2026-06-18T10:15:00Z", createdAt: "2025-11-01T08:00:00Z" },
  { id: "usr_4", name: "Diana Prince", email: "diana@startup.io", role: "lead", status: "suspended", lastLogin: "2026-05-10T16:45:00Z", createdAt: "2026-03-05T09:10:00Z" },
  { id: "usr_5", name: "Evan Wright", email: "evan@wrightlogistics.com", role: "vendor", status: "pending", lastLogin: "2026-06-18T08:20:00Z", createdAt: "2026-06-18T08:00:00Z" },
];

// Lead Verification mock data
export interface LeadVerification {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export const mockLeadVerifications: LeadVerification[] = [
  { id: "lv_1", companyName: "TechCorp Inc.", contactName: "Alice Johnson", email: "alice@techcorp.com", status: "pending", submittedAt: "2026-06-16T10:00:00Z" },
  { id: "lv_2", companyName: "Startup IO", contactName: "Diana Prince", email: "diana@startup.io", status: "approved", submittedAt: "2026-06-10T09:30:00Z" },
  { id: "lv_3", companyName: "Innovate LLC", contactName: "Frank Castle", email: "frank@innovate.llc", status: "rejected", submittedAt: "2026-06-15T14:15:00Z" },
];

// Vendor Verification mock data
export interface VendorVerification {
  id: string;
  vendorName: string;
  contactName: string;
  email: string;
  services: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export const mockVendorVerifications: VendorVerification[] = [
  { id: "vv_1", vendorName: "Vendor Global", contactName: "Bob Smith", email: "bob@vendorglobal.com", services: ["IT Consulting", "Software Dev"], status: "approved", submittedAt: "2026-05-20T11:00:00Z" },
  { id: "vv_2", vendorName: "Wright Logistics", contactName: "Evan Wright", email: "evan@wrightlogistics.com", services: ["Logistics", "Supply Chain"], status: "pending", submittedAt: "2026-06-17T16:20:00Z" },
  { id: "vv_3", vendorName: "Creative Designs", contactName: "Grace Hopper", email: "grace@creative.design", services: ["Design", "Marketing"], status: "pending", submittedAt: "2026-06-18T09:45:00Z" },
];

// Queries mock data
export interface AdminQuery {
  id: string;
  subject: string;
  senderName: string;
  senderRole: "lead" | "vendor";
  status: "open" | "answered" | "closed";
  createdAt: string;
}

export const mockAdminQueries: AdminQuery[] = [
  { id: "q_1", subject: "Issue with opportunity posting", senderName: "Alice Johnson", senderRole: "lead", status: "open", createdAt: "2026-06-18T08:30:00Z" },
  { id: "q_2", subject: "Payment gateway error", senderName: "Bob Smith", senderRole: "vendor", status: "answered", createdAt: "2026-06-17T15:20:00Z" },
  { id: "q_3", subject: "How to update profile?", senderName: "Evan Wright", senderRole: "vendor", status: "closed", createdAt: "2026-06-16T11:10:00Z" },
];

// Notifications mock data
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "system" | "user" | "security" | "billing";
  isRead: boolean;
  createdAt: string;
}

export const mockAdminNotifications: AdminNotification[] = [
  { id: "n_1", title: "New Lead Verification", message: "TechCorp Inc. submitted a verification request.", type: "user", isRead: false, createdAt: "2026-06-18T10:00:00Z" },
  { id: "n_2", title: "System Update", message: "Scheduled maintenance will occur on June 20th at 2 AM EST.", type: "system", isRead: true, createdAt: "2026-06-15T08:00:00Z" },
  { id: "n_3", title: "Suspicious Login Attempt", message: "Multiple failed login attempts detected for admin account.", type: "security", isRead: false, createdAt: "2026-06-18T14:30:00Z" },
];

export { mockOpportunities };
