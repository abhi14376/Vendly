import { MonitorSmartphone, HardHat, Package, Megaphone, Stethoscope, Factory } from "lucide-react";

export function Industries() {
  const industries = [
    { name: "IT & Software", icon: MonitorSmartphone },
    { name: "Construction", icon: HardHat },
    { name: "Logistics", icon: Package },
    { name: "Marketing", icon: Megaphone },
    { name: "Healthcare", icon: Stethoscope },
    { name: "Manufacturing", icon: Factory },
  ];

  return (
    <section className="bg-white py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Trusted across all major industries.
            </h2>
            <p className="mt-4 text-left text-lg text-slate-500 dark:text-slate-400">
              No matter what you're building or sourcing, BidTracker has pre-verified vendors ready to bid on your projects.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-primary-600">50k+</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Vendors</span>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-primary-600">$2B+</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Projects Awarded</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {industries.map((industry) => (
              <div 
                key={industry.name} 
                className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:shadow-primary-500/20"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white dark:bg-slate-800 dark:text-primary-400 dark:group-hover:bg-primary-500 dark:group-hover:text-white">
                  <industry.icon className="h-7 w-7" />
                </div>
                <span className="relative z-10 text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
                  {industry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
