import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types/User";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const userRole = useAuthStore((state) => state.userRole);

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
