import { NavLink, useLocation } from "react-router";
import { BrandLogo } from "@/components/navigation/BrandLogo";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/store/uiStore";
import type { NavigationItem } from "@/types/Navigation";

interface SidebarProps {
  navigation: NavigationItem[];
  variant: "lead" | "admin";
}

export function Sidebar({ navigation, variant }: SidebarProps) {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const closeMobileMenu = useUiStore((state) => state.closeMobileMenu);
  const location = useLocation();
  const isAdmin = variant === "admin";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-drawer w-[280px] -translate-x-full p-4 transition-transform lg:sticky lg:top-4 lg:h-[calc(100vh-32px)] lg:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : ""
      } ${sidebarCollapsed ? "lg:w-[88px]" : "lg:w-[280px]"}`}
      aria-label={`${variant} navigation`}
    >
      <div
        className={`flex h-full flex-col rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300 p-4
          bg-white/40 border-white/60 dark:bg-slate-900/40 dark:border-slate-700/50 text-slate-900 dark:text-white
        `}
      >
        <div className="flex items-center justify-between gap-3">
          <BrandLogo compact={sidebarCollapsed} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Collapse navigation"
            className="hidden lg:inline-flex"
            onClick={toggleSidebar}
          >
            <span aria-hidden="true">{sidebarCollapsed ? "+" : "-"}</span>
          </Button>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-2 overflow-y-auto pr-1" aria-label="Dashboard navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isParentActive = location.pathname.startsWith(item.href);

            return (
              <div key={item.href} className="flex flex-col gap-1">
                <NavLink
                  to={item.href}
                  end={item.href === "/dashboard" || item.href === "/admin"}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive || (hasChildren && isParentActive)
                        ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                        : "text-slate-700 hover:bg-white/60 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
                    } ${sidebarCollapsed ? "lg:justify-center" : ""}`
                  }
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className={sidebarCollapsed ? "lg:sr-only" : ""}>{item.label}</span>
                </NavLink>

                {hasChildren && !sidebarCollapsed && (
                  <div className="pl-4 flex flex-col gap-1 mt-1 border-l border-slate-200/50 dark:border-slate-700/50 ml-5">
                    {item.children!.map((child) => {
                      const isChildActive = location.pathname + location.search === child.href || 
                                          (location.search === "" && child.href.endsWith("?tab=new-tenders") && location.pathname === "/admin/opportunities");
                      return (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          onClick={closeMobileMenu}
                          className={`text-xs py-2 px-2.5 rounded-lg transition-all duration-300 ${
                            isChildActive
                              ? "bg-white/70 text-primary-600 font-bold shadow-sm dark:bg-primary-900/40 dark:text-primary-400"
                              : "text-slate-500 hover:text-primary-600 hover:bg-white/50 hover:font-medium dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-primary-900/20"
                          }`}
                        >
                          {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
