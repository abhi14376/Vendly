import { Link } from "react-router";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Vendly</span>
          </div>
          
          <nav className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/help" className="hover:text-primary-600 dark:hover:text-primary-400">Help Center</Link>
            <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-8 text-center md:flex md:items-center md:justify-between dark:border-slate-800">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Vendly Inc. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6 md:mt-0">
            <span className="text-sm text-slate-400 dark:text-slate-500">Made with precision.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
