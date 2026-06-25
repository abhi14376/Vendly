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
        className={`flex h-full flex-col rounded-xl border p-4 shadow-md ${
          isAdmin
            ? "border-white/20 bg-white/75 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/75"
            : "border-slate-800 bg-slate-900 text-white"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <BrandLogo compact={sidebarCollapsed} inverse={!isAdmin} />
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
                    `flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive || (hasChildren && isParentActive)
                        ? isAdmin
                          ? "bg-primary-600 text-white"
                          : "bg-white text-slate-900"
                        : isAdmin
                          ? "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    } ${sidebarCollapsed ? "lg:justify-center" : ""}`
                  }
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className={sidebarCollapsed ? "lg:sr-only" : ""}>{item.label}</span>
                </NavLink>

                {hasChildren && !sidebarCollapsed && (
                  <div className="pl-4 flex flex-col gap-1 mt-1 border-l border-slate-200 dark:border-slate-800 ml-5">
                    {item.children!.map((child) => {
                      const isChildActive = location.pathname + location.search === child.href || 
                                          (location.search === "" && child.href.endsWith("?tab=new-tenders") && location.pathname === "/admin/opportunities");
                      return (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          onClick={closeMobileMenu}
                          className={`text-xs py-2 px-2.5 rounded-md transition-all duration-200 ${
                            isChildActive
                              ? "bg-slate-100 text-primary-600 font-semibold shadow-sm dark:bg-slate-850 dark:text-primary-400"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/40"
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
