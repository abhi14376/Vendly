import { Outlet } from "react-router";
import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/navigation/PublicHeader";
import { SkipLink } from "@/components/navigation/SkipLink";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <SkipLink />
      <PublicHeader />
      <main id="main-content" className="w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
