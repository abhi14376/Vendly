import { Link } from "react-router";
import { ArrowRight, Search, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 pt-24 pb-32 dark:bg-slate-950">
      {/* Background Glow Elements */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform">
        <div className="h-[400px] w-[800px] rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
            Procurement & Vendor Management,{" "}
            <span className="bg-gradient-to-r from-primary-600 to-info bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            BidTracker connects leads with top-tier vendors seamlessly. Post opportunities, track applications, and manage projects in one powerful, unified platform.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="default" className="w-full sm:w-auto">
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="default" className="w-full sm:w-auto">
              <a href="#how-it-works">Learn How it Works</a>
            </Button>
          </div>
        </div>

        {/* Mock UI Graphic */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-2xl border border-slate-200/50 bg-white/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4 dark:border-slate-800/50 dark:bg-slate-900/50">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              {/* Fake Browser Header */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
              {/* Fake App Content */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="hidden border-r border-slate-100 bg-slate-50 p-4 md:block dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="space-y-4">
                    <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2 pt-4">
                      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>
                <div className="col-span-3 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Opportunities</h2>
                    <div className="h-8 w-32 rounded-full bg-primary-600" />
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Search, title: "Website Redesign", tag: "Design" },
                      { icon: FileText, title: "Cloud Migration", tag: "Engineering" },
                      { icon: CheckCircle2, title: "Marketing Audit", tag: "Marketing" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{item.title}</div>
                            <div className="text-sm text-slate-500">{item.tag}</div>
                          </div>
                        </div>
                        <div className="flex -space-x-2">
                          <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 dark:border-slate-950 dark:bg-slate-700" />
                          <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300 dark:border-slate-950 dark:bg-slate-600" />
                          <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-400 dark:border-slate-950 dark:bg-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
