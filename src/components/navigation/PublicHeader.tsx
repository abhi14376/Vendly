import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/navigation/BrandLogo";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { publicNavigation } from "@/config/navigation";

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors whitespace-nowrap ${
      isActive
        ? "text-primary-700 dark:text-primary-300"
        : "text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400"
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 transition-shadow duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link to="/" aria-label="Vendly home" className="shrink-0">
            <BrandLogo />
          </Link>

          {/* Desktop nav — hidden on mobile, compact on tablet */}
          <nav aria-label="Public navigation" className="hidden md:flex items-center gap-4 lg:gap-6">
            {publicNavigation.map((item) => (
              <NavLink key={item.href} to={item.href} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Admin Login — hide on very small screens */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex border-slate-200 dark:border-slate-700 text-sm"
            >
              <Link to="/login?role=admin">Admin Login</Link>
            </Button>

            {/* Become Lead — always visible */}
            <Button asChild size="sm" className="hidden sm:inline-flex text-sm">
              <Link to="/signup">Become Lead</Link>
            </Button>

            {/* Hamburger — only on mobile */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <BrandLogo />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {publicNavigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300"
                    : "text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800/50"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom CTAs */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-5 space-y-3">
          <Button asChild variant="outline" fullWidth className="border-slate-200 dark:border-slate-700">
            <Link to="/login?role=admin" onClick={() => setMenuOpen(false)}>
              Admin Login
            </Link>
          </Button>
          <Button asChild fullWidth>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              Become Lead
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
