import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  FileCheck2,
  Gauge,
  Home,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { NavigationItem } from "@/types/Navigation";

export const publicNavigation = [
  { href: "/", label: "Home" },
  { href: "/the-lead", label: "The Lead" },
  { href: "/faqs", label: "FAQs" },
  { href: "/about", label: "About Vendly" },
];

export const leadNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/dashboard/vendors", label: "Vendors", icon: Building2 },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: BriefcaseBusiness },
  { href: "/dashboard/applied-projects", label: "Applied Projects", icon: FileCheck2 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/queries", label: "Queries", icon: MessageSquareText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];



export const adminNavigation: NavigationItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { 
    href: "/admin/opportunities", 
    label: "Opportunities", 
    icon: BriefcaseBusiness,
    children: [
      { href: "/admin/opportunities?tab=new-tenders", label: "New Tenders" },
      { href: "/admin/opportunities?tab=active-tenders", label: "Active Tenders" },
      { href: "/admin/opportunities?tab=closing-soon", label: "Closing Soon" },
      { href: "/admin/opportunities?tab=corrigendum", label: "Corrigendum" },
      { href: "/admin/opportunities?tab=awarded-contracts", label: "Awarded Contracts" },
      { href: "/admin/opportunities?tab=department-analytics", label: "Department Analytics" },
      { href: "/admin/opportunities?tab=state-analytics", label: "State Analytics" },
      { href: "/admin/opportunities?tab=vendor-matches", label: "Vendor Matches" },
    ]
  },
  { href: "/admin/lead-verification", label: "Lead Verification", icon: ShieldCheck },
  { href: "/admin/vendor-verification", label: "Vendor Verification", icon: Building2 },
  { href: "/admin/ai-summary", label: "AI Summary", icon: Sparkles },
  { href: "/admin/query-console", label: "Queries", icon: CircleHelp },
  { href: "/admin/disputes", label: "Disputes", icon: MessageSquareText },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
