import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrentUser, UserRole } from "@/types/User";

interface AuthState {
  accessToken: string | null;
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (accessToken: string, currentUser: CurrentUser) => void;
  logout: () => void;
  refreshUser: (currentUser: CurrentUser) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      currentUser: null,
      isAuthenticated: false,
      userRole: null,
      login: (accessToken, currentUser) =>
        set({
          accessToken,
          currentUser,
          isAuthenticated: true,
          userRole: currentUser.role,
        }),
      logout: () =>
        set({
          accessToken: null,
          currentUser: null,
          isAuthenticated: false,
          userRole: null,
        }),
      refreshUser: (currentUser) =>
        set({
          currentUser,
          userRole: currentUser.role,
        }),
      initialize: () => {
        import("@/lib/supabase").then(({ supabase }) => {
          if (!supabase) return;
          
            // Get initial session
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              // Fetch user profile to get role
              supabase.from('profiles').select('*').eq('id', session.user.id).single()
                .then(({ data: profile }) => {
                  const role = profile?.role || "lead";
                  set({
                    accessToken: session.access_token,
                    isAuthenticated: true,
                    userRole: role,
                    currentUser: {
                      id: session.user.id,
                      email: session.user.email!,
                  fullName: profile ? profile.full_name || profile.email : session.user.email!,
                      role: role,
                      verificationStatus: 'approved'
                    }
                  });
                });
            }
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
              set({ accessToken: null, currentUser: null, isAuthenticated: false, userRole: null });
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
              const role = profile?.role || "lead";
              set({
                accessToken: session.access_token,
                isAuthenticated: true,
                userRole: role,
                currentUser: {
                  id: session.user.id,
                  email: session.user.email!,
                  fullName: profile ? profile.full_name || profile.email : session.user.email!,
                  role: role,
                  verificationStatus: 'approved'
                }
              });
            }
          });
        });
      },
    }),
    {
      name: "vendly-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
      }),
    },
  ),
);
