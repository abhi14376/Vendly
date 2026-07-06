import { Bell, Menu, Search, LogOut, CheckCircle2 } from "lucide-react";
import { Outlet, useNavigate } from "react-router";
import { Sidebar } from "@/components/navigation/Sidebar";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Avatar } from "@/components/ui/Avatar";
import { Footer } from "@/components/layout/Footer";
import type { NavigationItem } from "@/types/Navigation";

interface DashboardLayoutProps {
  label: string;
  navigation: NavigationItem[];
  variant: "lead" | "admin";
}

export function DashboardLayout({ label, navigation, variant }: DashboardLayoutProps) {
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useNotificationStore((state) =>
    variant === "lead" ? state.leadUnreadCount : state.unreadCount
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col justify-between">
      <div className="mx-auto flex flex-1 w-full max-w-dashboard gap-6 px-4 py-4 sm:px-6 lg:px-10">
        <Sidebar navigation={navigation} variant={variant} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-sticky flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 lg:h-[72px]">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={toggleMobileMenu}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Search className="size-4" aria-hidden="true" />
                <span>Global search ready</span>
              </div>
            </div>
            {/* Bell icon with red unread badge */}
            <div className="relative">
              <Button type="button" variant="ghost" size="icon" aria-label="View notifications">
                <Bell className="size-5" aria-hidden="true" />
              </Button>
              {unreadCount > 0 && (
                <span className="pointer-events-none absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <ThemeToggle />

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800/80 shrink-0">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-end gap-1">
                  {currentUser?.verificationStatus === "approved" && (
                    <CheckCircle2 className="size-3.5 fill-primary-500 text-white dark:fill-primary-400 dark:text-slate-900 shrink-0" aria-label="Verified user" />
                  )}
                  <span className="truncate max-w-[120px]">{currentUser?.fullName || "User"}</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {variant}
                </span>
              </div>
              <Avatar
                src={currentUser?.avatarUrl}
                alt={currentUser?.fullName || "User"}
                fallback={currentUser?.fullName?.charAt(0) || "U"}
                className="h-8 w-8 ring-2 ring-primary-500/10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Log Out"
                className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="size-5" />
              </Button>
            </div>
          </header>
          <main id="main-content" className="flex-1 py-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
