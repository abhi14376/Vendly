import { Link } from "react-router";
import { Github, Linkedin, Twitter, Globe, ArrowUpRight, Shield, Heart } from "lucide-react";
import { BrandLogo } from "@/components/navigation/BrandLogo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-400 border-t border-indigo-950/60">
      {/* Decorative top gradient glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      
      {/* Background glowing shapes */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand details */}
          <div className="space-y-5">
            <Link to="/" className="group w-fit">
              <div className="group-hover:scale-105 transition-transform duration-300">
                <BrandLogo inverse />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              A verification-first B2B marketplace digitizing project procurement, removing operational friction, and establishing absolute trust.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://google.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300" aria-label="Website">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login?role=admin" className="text-sm text-slate-400 hover:text-white hover:underline decoration-indigo-500/50 underline-offset-4 transition-all">
                  Admin
                </Link>
              </li>
              <li>
                <Link to="/login?role=super_admin" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline decoration-indigo-400/50 underline-offset-4 transition-all inline-flex items-center gap-1.5 group">
                  <Shield className="h-3.5 w-3.5" /> Super Admin
                </Link>
              </li>
              <li>
                <Link to="/the-lead" className="text-sm text-slate-400 hover:text-white hover:underline decoration-indigo-500/50 underline-offset-4 transition-all inline-flex items-center gap-1.5 group">
                  The Lead Portal <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-sm text-slate-400 hover:text-white hover:underline decoration-indigo-500/50 underline-offset-4 transition-all">
                  Technical FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-slate-400 hover:text-white hover:underline decoration-indigo-500/50 underline-offset-4 transition-all">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Verification */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-5">Trust & Assurance</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-slate-400 hover:text-white hover:underline decoration-indigo-500/50 underline-offset-4 transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-400 hover:text-white hover:underline decoration-indigo-500/50 underline-offset-4 transition-all">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-full shadow-inner shadow-emerald-900/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Manual Verification Active
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            &copy; {currentYear} BidTracker Inc. All rights reserved. B2B Sourcing made transparent.
          </p>
          <div className="flex items-center gap-4 text-center sm:text-right">
            <span className="hover:text-slate-400 transition-colors">SSL Encrypted Secure</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
