import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-primary-600 py-24 text-white dark:bg-primary-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIiAvPjwvc3ZnPg==')] opacity-50" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to revolutionize your procurement?
        </h2>
        <p className="mt-4 text-lg text-primary-100">
          Join thousands of leads and vendors already using BidTracker to streamline their projects and grow their businesses.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="default" variant="secondary" className="w-full text-primary-700 sm:w-auto">
            <Link to="/signup">
              Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="default" className="w-full bg-primary-800 text-white hover:bg-primary-900 sm:w-auto">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
