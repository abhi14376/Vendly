import { useEffect, useState, type ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useApplicationStore } from "@/features/opportunities/store/useApplicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import type { CurrentUser, UserRole } from "@/types/User";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsInitializing(false);
      return;
    }

    // Fetch initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
        const currentUser: CurrentUser = {
          id: user.id,
          email: user.email!,
          fullName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user.email!,
          role: profile?.role as UserRole || "lead",
          verificationStatus: profile?.role === "admin" ? "approved" : "pending",
        };
        login(session.access_token, currentUser);
        if (currentUser.role === 'vendor') {
          useApplicationStore.getState().initialize();
        }
        useNotificationStore.getState().initialize();
      } else {
        logout();
      }
      setIsInitializing(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = session.user;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
        const currentUser: CurrentUser = {
          id: user.id,
          email: user.email!,
          fullName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user.email!,
          role: profile?.role as UserRole || "lead",
          verificationStatus: profile?.role === "admin" ? "approved" : "pending",
        };
        login(session.access_token, currentUser);
        if (currentUser.role === 'vendor') {
          useApplicationStore.getState().initialize();
        }
        useNotificationStore.getState().initialize();
      } else {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
