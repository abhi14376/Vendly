export type UserRole = "super_admin" | "admin" | "lead" | "vendor";

export type VerificationStatus = "approved" | "pending" | "rejected";

export interface CurrentUser {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  mobile?: string;
  avatarUrl?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
}
