import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.userRole);

  return { currentUser, isAuthenticated, userRole };
}
