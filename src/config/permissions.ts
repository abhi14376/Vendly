import type { UserRole } from "@/types/User";

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  super_admin: "/admin",
  admin: "/admin",
  lead: "/dashboard",
  vendor: "/login",
};
