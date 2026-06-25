import { Search, Send, Trophy } from "lucide-react";

const steps = [
  {
    id: "01",
    name: "Browse Opportunities",
    description:
      "Explore opportunities on the portal. Browse by Industry, Work Type, or State to find the right tenders or works.",
    icon: Search,
    accent: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
    ring: "ring-indigo-100 dark:ring-indigo-900/50",
    numColor: "text-indigo-500 dark:text-indigo-400",
  },
  {
    id: "02",
    name: "Apply",
    description:
      "Match the work eligibility and industry experience. As a Lead, you can invite your vendors to apply easily on the platform.",
    icon: Send,
    accent: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-50 dark:bg-violet-950/50",
    ring: "ring-violet-100 dark:ring-violet-900/50",
    numColor: "text-violet-500 dark:text-violet-400",
  },
  {
    id: "03",
    name: "Grab it",
    description:
      "Compare applications, evaluate with confidence, and award the project to the right partner. Secure more work. Grow your business.",
    icon: Trophy,
    accent: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
    ring: "ring-emerald-100 dark:ring-emerald-900/50",
    numColor: "text-emerald-500 dark:text-emerald-400",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-white dark:bg-slate-950 py-24 overflow-hidden"
    >
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Three simple steps to win more work
          </h2>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-6">

          {/* Dashed connector — desktop only */}
          <div className="hidden md:block absolute top-7 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px">
            <svg width="100%" height="1" className="overflow-visible">
              <line
                x1="0" y1="0" x2="100%" y2="0"
                stroke="currentColor"
                strokeDasharray="6 6"
                strokeWidth="1.5"
                className="text-slate-200 dark:text-slate-800"
              />
            </svg>
          </div>

          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center md:items-center"
              style={{
                animationName: "fadeSlideUp",
                animationDuration: "0.55s",
                animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                animationFillMode: "both",
                animationDelay: `${idx * 120}ms`,
              }}
            >
              {/* Icon circle */}
              <div
                className={`
                  relative flex h-14 w-14 items-center justify-center rounded-2xl
                  ${step.iconBg} ring-1 ${step.ring}
                  transition-transform duration-300 hover:scale-110
                `}
              >
                <step.icon className={`h-6 w-6 ${step.accent}`} strokeWidth={1.75} />
              </div>

              {/* Step number + name */}
              <div className="mt-6 space-y-1">
                <p className={`text-xs font-bold tracking-widest uppercase ${step.numColor}`}>
                  {step.id}
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {step.name}
                </h3>
              </div>

              {/* Thin divider */}
              <div className="mt-4 w-8 h-px bg-slate-200 dark:bg-slate-800" />

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-[220px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframe */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
