import { Link } from "react-router";
import { ArrowRight, ShieldCheck, Briefcase, FileText, CheckCircle2, Plus, Users, BarChart3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TheLeadPage() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Verified Vendor Network",
      description: "Access a thoroughly vetted pool of qualified B2B service providers. No spam, only genuine suppliers."
    },
    {
      icon: Briefcase,
      title: "Structured Project Publishing",
      description: "Publish Tenders or Back-to-Back projects with detailed specifications, BOQs, and document uploads in minutes."
    },
    {
      icon: BarChart3,
      title: "Dynamic Bidding & Evaluation",
      description: "Compare vendor proposals, check compliance, and track bids side-by-side using our structured evaluation dashboard."
    },
    {
      icon: Users,
      title: "Direct Query Management",
      description: "Solve vendor queries in a central, threaded discussion panel. Say goodbye to scattered email chains."
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* SECTION 1: Minimalist Hero with CTA */}
      <section className="relative overflow-hidden text-center py-16">
        <div className="absolute inset-0 flex justify-center -translate-y-24">
          <div className="h-[350px] w-[700px] rounded-full bg-primary-500/10 blur-[100px] dark:bg-primary-500/5" />
        </div>
        
        <div className="relative mx-auto max-w-3xl space-y-6 px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-950/40 dark:text-primary-300">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-ping" />
            Lead Portal Active
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
            Trusted Vendors. Organized Industries.{" "}
            <span className="bg-gradient-to-r from-primary-600 to-info bg-clip-text text-transparent">
              Better Opportunities.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Onboard qualified vendors you've already verified, categorize them by expertise, and connect them with high-value opportunities across industries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/signup?role=lead">
                Sign Up as a Lead <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link to="/login?role=lead">
                Login as Lead
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Benefits */}
      <section className="relative max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Why Publish on BidTracker?
          </h2>
          <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
            A comprehensive, digital-first system designed to bring trust and efficiency back to B2B procurement.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-primary-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:hover:border-primary-500"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100 dark:bg-primary-950/50 dark:text-primary-400 dark:group-hover:bg-primary-900/40">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: How to Use the Portal */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How to Use the Portal
          </h2>
          <p className="mx-auto max-w-2xl text-slate-500 dark:text-slate-400">
            Get started in three simple steps. See exactly how it works in the interactive simulator below.
          </p>
        </div>

        <div className="space-y-20">
          {/* Step 1 */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                1
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create & Verify Your Profile
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Sign up as a Lead and complete your corporate credentials. Provide basic company registration, business name, and verify details. Administrators review and approve profiles quickly to keep the network secure and trusted.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span>Instantly builds trust with bidding vendors</span>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              {/* Mockup Screen 1 */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div className="mx-auto text-[11px] text-slate-400">bidtracker.com/dashboard/settings</div>
                </div>
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Lead Profile Verification</h4>
                      <p className="text-xs text-slate-500">Provide company details for administrative review</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                      <AlertCircle className="h-3 w-3" />
                      Pending Approval
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Company Name</label>
                      <div className="h-9 px-3 py-2 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                        Apex Infrastructure Ltd
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Website</label>
                      <div className="h-9 px-3 py-2 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                        https://apexinfra.com
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase">Verification Checklist</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">GSTIN Certificate Uploaded</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300">Domain Email Verified (admin@apexinfra.com)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6 lg:order-last">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                2
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Publish Project Opportunities
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Add standard tenders or back-to-back subcontractors requirements. Enter key parameters like project duration, target estimates, royalty rates, geographic state filter, and attach critical files like Bill of Quantities (BOQ) or construction designs.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span>Specify documents & guidelines clearly</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Mockup Screen 2 */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div className="mx-auto text-[11px] text-slate-400">bidtracker.com/admin/opportunities/new</div>
                </div>
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Create New Opportunity</h4>
                    <span className="text-xs text-primary-600 font-medium">Draft Saved</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Opportunity Title</label>
                      <div className="h-9 px-3 py-2 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
                        Metro Station Civil Excavation & Shoring Works
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Project Type</label>
                        <div className="h-9 px-3 py-2 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                          Tender
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Estimate Amount</label>
                        <div className="h-9 px-3 py-2 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                          ₹ 4,50,00,000
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">State / Region</label>
                        <div className="h-9 px-3 py-2 text-xs rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                          Maharashtra
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-950">
                      <FileText className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">BOQ_Excavation_Metro.xlsx</p>
                      <span className="text-[10px] text-slate-400">Excel Spreadsheet • 2.4 MB</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <div className="h-8 w-20 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 flex items-center justify-center text-xs font-semibold select-none cursor-pointer">
                        Cancel
                      </div>
                      <div className="h-8 w-24 rounded bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center text-xs font-semibold select-none cursor-pointer">
                        Publish Project
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                3
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Evaluate Bids & Award Work
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                As vendors submit applications, track them in real-time. Review technical documents, query bidders if details are missing, monitor submission timestamps, and change statuses from "Submitted" to "Under Process" and finally "Finalised" when the best bid is selected.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span>Award projects to verified vendors with one click</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Mockup Screen 3 */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div className="mx-auto text-[11px] text-slate-400">bidtracker.com/dashboard/opportunities/metro-station-civil/applications</div>
                </div>
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-900 dark:text-white">Vendor Applications (3)</h4>
                    <span className="text-xs text-slate-500 font-medium">Bidding Active</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between border border-slate-150 bg-white p-3 rounded-lg dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">KS</div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Karan Structural Projects</p>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">Verified</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">₹ 4,32,00,000</p>
                        <span className="text-[10px] text-slate-400">Submitted 2h ago</span>
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">
                        Under Process
                      </span>
                    </div>

                    <div className="flex items-center justify-between border border-slate-150 bg-white p-3 rounded-lg dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">TE</div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Triveni Earthmovers</p>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">Verified</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">₹ 4,45,00,000</p>
                        <span className="text-[10px] text-slate-400">Submitted 5h ago</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                        Finalised (Won)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
