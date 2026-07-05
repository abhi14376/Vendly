import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { Button } from "@/components/ui/Button";

interface ErrorLayoutProps {
  statusCode?: string;
  title?: string;
}

export function ErrorLayout({ statusCode, title }: ErrorLayoutProps) {
  const routeError = useRouteError();
  const derivedStatus = isRouteErrorResponse(routeError) ? String(routeError.status) : statusCode ?? "500";
  const derivedTitle = title ?? (derivedStatus === "404" ? "Page not found" : "Something went wrong");

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <section className="w-full max-w-legal rounded-2xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-300">{derivedStatus}</p>
        <h1 className="mt-2 text-3xl font-bold">{derivedTitle}</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          We could not complete this request. Please return to a safe page and try again.
        </p>
        <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-lg overflow-auto">
          {routeError instanceof Error ? routeError.message : String(routeError)}
        </div>
        
        {routeError instanceof Error && routeError.message.includes("dynamically imported module") ? (
          <Button onClick={() => window.location.reload()} className="mt-6 bg-red-600 hover:bg-red-700">
            Refresh App
          </Button>
        ) : (
          <Button asChild className="mt-6">
            <Link to="/">Go Back</Link>
          </Button>
        )}
      </section>
    </main>
  );
}
