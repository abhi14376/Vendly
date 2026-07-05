import { Users, ShieldCheck, Target, Heart, Sparkles, Handshake, Building2, CheckCircle2, ArrowRight, ClipboardList } from "lucide-react";
import { Link } from "react-router";

export function AboutPage() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Trust First",
      description: "We believe trust is the cornerstone of B2B transactions. Our manual verification process guarantees authenticity.",
      accent: "indigo",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bar: "from-indigo-500 to-indigo-400",
      glow: "hover:shadow-indigo-200/60 dark:hover:shadow-indigo-900/40",
      border: "hover:border-indigo-300 dark:hover:border-indigo-700",
    },
    {
      icon: Target,
      title: "Clarity & Structure",
      description: "No more messy communication. We structure opportunities, files, and queries so projects run predictably.",
      accent: "violet",
      iconBg: "bg-violet-50 dark:bg-violet-950/40",
      iconColor: "text-violet-600 dark:text-violet-400",
      bar: "from-violet-500 to-violet-400",
      glow: "hover:shadow-violet-200/60 dark:hover:shadow-violet-900/40",
      border: "hover:border-violet-300 dark:hover:border-violet-700",
    },
    {
      icon: Users,
      title: "Network Empowerment",
      description: "We help Leads find reliable suppliers, and we help small-to-medium vendors scale by bidding on major projects.",
      accent: "sky",
      iconBg: "bg-sky-50 dark:bg-sky-950/40",
      iconColor: "text-sky-600 dark:text-sky-400",
      bar: "from-sky-500 to-sky-400",
      glow: "hover:shadow-sky-200/60 dark:hover:shadow-sky-900/40",
      border: "hover:border-sky-300 dark:hover:border-sky-700",
    },
    {
      icon: Heart,
      title: "Customer Delight",
      description: "Our software is clean, blazing fast, mobile-friendly, and simple to use for everyone from engineers to administrators.",
      accent: "rose",
      iconBg: "bg-rose-50 dark:bg-rose-950/40",
      iconColor: "text-rose-500 dark:text-rose-400",
      bar: "from-rose-500 to-rose-400",
      glow: "hover:shadow-rose-200/60 dark:hover:shadow-rose-900/40",
      border: "hover:border-rose-300 dark:hover:border-rose-700",
    },
  ];

  return (
    <div className="space-y-20 py-10">
      {/* Hero Header */}
      <section className="relative text-center max-w-3xl mx-auto space-y-6 px-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
          About{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            BidTracker
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          BidTracker is a verification-first B2B marketplace designed to digitize procurement, eliminate operational friction, and establish deep trust between enterprise leads and qualified subcontractors.
        </p>
      </section>

      {/* Narrative Section */}
      <section className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            In many industrial, civil construction, events, and electrical sectors, project procurement remains fragmented. Businesses struggle to find trustworthy vendors, while suppliers have difficulty discovering validated project tenders.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            BidTracker was built to bridge this gap. By combining manual verification, standardized project posting formats (Tenders & Back-to-Back), transparent question-and-answer threading, and secure document storage, we ensure that both parties can transact with confidence.
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white space-y-6 shadow-xl">
          <h3 className="text-xl font-bold">Our Core Vision</h3>
          <p className="text-indigo-100 leading-relaxed text-sm">
            To become the premier operational operating system for commercial opportunity matching, where verification is absolute, operations are highly structured, and administrative governance ensures a safe workspace for businesses to grow.
          </p>
          <div className="border-t border-indigo-500/40 pt-4 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold">100%</p>
              <p className="text-xs text-indigo-200">Verified Users</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold">Instant</p>
              <p className="text-xs text-indigo-200">Query Resolution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid lg:grid-cols-3 gap-10 items-start relative z-10">
            <div className="lg:col-span-1 space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Our Purpose
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Why BidTracker Exists</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                To build an open, trusted, and friction-free B2B opportunity ecosystem that unlocks commercial project scale for subcontractors and buyers alike.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  Democratizing Opportunities
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We empower medium and small-scale subcontractors by giving them direct access to verified tenders. By removing traditional gatekeepers, we level the playing field so quality services speak for themselves.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  Frictionless Communication
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Procurement cycles get blocked by endless disconnected email chains. BidTracker streamlines communications with structured query resolution directly associated with each project opportunity page.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  Absolute Verification Trust
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We operate a verification-first B2B ecosystem. By pre-screening user accounts and contract listings, we eradicate ghost bidding, build vendor assurance, and minimize counterparty risks.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  AI-Powered Clarity
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  B2B specification files are long and details are easily missed. Our platform extracts values instantly from BOQs, giving estimators and bid managers immediate clarity without reading hundreds of pages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Utilize */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Winning the Right Opportunities
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400">
            How Leads and Vendors can best leverage the BidTracker ecosystem to successfully execute commercial projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* For Lead */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-8 bg-white dark:bg-slate-950 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full">
                  For Lead
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Help Leads Find the Right Opportunities
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Empower your vendor with the right opportunities and tools to evaluate and engage better on the platform.
                </p>
              </div>

              <ul className="space-y-3.5">
                {[
                  "Listed opportunities across Industry, Work Type, and State for easy discovery.",
                  "Use advanced filters and AI summaries to surface relevant and high-fit opportunities.",
                  "Provide instant access to key documents, EMD, timelines, and eligibility criteria.",
                  "Enable direct Q&A with publishers to get clarifications quickly.",
                  "Track saved opportunities, alerts, and updates in one place.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/login"
              className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer group/cta"
            >
              Explore Opportunities <ArrowRight className="ml-2 h-4 w-4 transform group-hover/cta:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* For Vendors */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-8 bg-white dark:bg-slate-950 shadow-sm flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  For Vendors
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Drive More Wins with Your Leads
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Apprise your Vendor about the platform and help them win more, compliantly and competitively.
                </p>
              </div>

              <ul className="space-y-3.5">
                {[
                  "Get apprised by your leads about relevant opportunities.",
                  "Receive guidance to apply with confidence and stay compliant.",
                  "Get help with attaching correct documents and meeting eligibility requirements.",
                  "Use the query board to collaborate and get clarifications faster.",
                  "Track your applications and progress from your dashboard.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>


          </div>

        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Our Core Values</h2>
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400">
            The principles that guide how we build our platform and support our B2B network.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((val, idx) => (
            <div
              key={idx}
              className={`
                group relative flex flex-col gap-4 overflow-hidden
                border border-slate-200 dark:border-slate-800 rounded-2xl p-6
                bg-white dark:bg-slate-950 shadow-sm
                transition-all duration-300 ease-out
                hover:-translate-y-1.5 hover:shadow-xl
                ${val.glow} ${val.border}
              `}
              style={{
                animationName: 'fadeSlideUp',
                animationDuration: '0.5s',
                animationTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                animationFillMode: 'both',
                animationDelay: `${idx * 100}ms`,
              }}
            >
              {/* Accent top bar — expands from left on hover */}
              <div
                className={`absolute top-0 left-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r ${val.bar} transition-all duration-500 ease-out`}
              />

              {/* Index number — faint watermark */}
              <span className="absolute top-4 right-5 text-5xl font-black text-slate-100 dark:text-slate-800/60 select-none leading-none">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${val.iconBg} ${val.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                <val.icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <div className="space-y-1.5 relative">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{val.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{val.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keyframe injection */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
