import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ErrorLayout } from "@/layouts/ErrorLayout";
import { LeadLayout } from "@/layouts/LeadLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { PageLoader } from "@/components/ui/PageLoader";

// Lazy loading helper for named exports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyImport = (importFunc: () => Promise<any>, exportName: string) => 
  lazy(() => importFunc().then(module => ({ default: module[exportName] })));

// Helper to wrap lazy components in Suspense
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Loadable = (Component: React.LazyExoticComponent<any>) => (props: any) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

// Public Pages
const HomePage = Loadable(lazyImport(() => import("@/pages/public/HomePage"), "HomePage"));
const LoginPage = Loadable(lazyImport(() => import("@/pages/public/LoginPage"), "LoginPage"));
const SignupPage = Loadable(lazyImport(() => import("@/pages/public/SignupPage"), "SignupPage"));
const ForgotPasswordPage = Loadable(lazyImport(() => import("@/pages/public/ForgotPasswordPage"), "ForgotPasswordPage"));
const VerifyAccountPage = Loadable(lazyImport(() => import("@/pages/public/VerifyAccountPage"), "VerifyAccountPage"));
const TheLeadPage = Loadable(lazyImport(() => import("@/pages/public/TheLeadPage"), "TheLeadPage"));
const FaqsPage = Loadable(lazyImport(() => import("@/pages/public/FaqsPage"), "FaqsPage"));
const AboutPage = Loadable(lazyImport(() => import("@/pages/public/AboutPage"), "AboutPage"));
const HelpPage = Loadable(lazyImport(() => import("@/pages/public/HelpPage"), "HelpPage"));
const PrivacyPage = Loadable(lazyImport(() => import("@/pages/public/PrivacyPage"), "PrivacyPage"));
const TermsPage = Loadable(lazyImport(() => import("@/pages/public/TermsPage"), "TermsPage"));
const MaintenancePage = Loadable(lazyImport(() => import("@/pages/public/MaintenancePage"), "MaintenancePage"));

// Lead Pages
const LeadDashboardPage = Loadable(lazyImport(() => import("@/pages/lead/LeadDashboardPage"), "LeadDashboardPage"));
const VendorsPage = Loadable(lazyImport(() => import("@/pages/lead/VendorsPage"), "VendorsPage"));
const LeadOpportunitiesPage = Loadable(lazyImport(() => import("@/pages/lead/LeadOpportunitiesPage"), "LeadOpportunitiesPage"));
const LeadOpportunityDetailsPage = Loadable(lazyImport(() => import("@/pages/lead/LeadOpportunityDetailsPage"), "LeadOpportunityDetailsPage"));
const AppliedProjectsPage = Loadable(lazyImport(() => import("@/pages/lead/AppliedProjectsPage"), "AppliedProjectsPage"));
const LeadQueriesPage = Loadable(lazyImport(() => import("@/pages/lead/LeadQueriesPage"), "LeadQueriesPage"));
const LeadNotificationsPage = Loadable(lazyImport(() => import("@/pages/lead/LeadNotificationsPage"), "LeadNotificationsPage"));
const LeadSettingsPage = Loadable(lazyImport(() => import("@/pages/lead/LeadSettingsPage"), "LeadSettingsPage"));



// Admin Pages
const AdminDashboardPage = Loadable(lazyImport(() => import("@/pages/admin/AdminDashboardPage"), "AdminDashboardPage"));
const MetricsPage = Loadable(lazyImport(() => import("@/pages/admin/MetricsPage"), "MetricsPage"));
const AdminOpportunitiesPage = Loadable(lazyImport(() => import("@/pages/admin/AdminOpportunitiesPage"), "AdminOpportunitiesPage"));
const CreateOpportunityPage = Loadable(lazyImport(() => import("@/pages/admin/CreateOpportunityPage"), "CreateOpportunityPage"));
const EditOpportunityPage = Loadable(lazyImport(() => import("@/pages/admin/EditOpportunityPage"), "EditOpportunityPage"));
const LeadVerificationPage = Loadable(lazyImport(() => import("@/pages/admin/LeadVerificationPage"), "LeadVerificationPage"));
const VendorVerificationPage = Loadable(lazyImport(() => import("@/pages/admin/VendorVerificationPage"), "VendorVerificationPage"));
const AiSummaryPage = Loadable(lazyImport(() => import("@/pages/admin/AiSummaryPage"), "AiSummaryPage"));
const QueryConsolePage = Loadable(lazyImport(() => import("@/pages/admin/QueryConsolePage"), "QueryConsolePage"));
const DisputesPage = Loadable(lazyImport(() => import("@/pages/admin/DisputesPage"), "DisputesPage"));
const AdminNotificationsPage = Loadable(lazyImport(() => import("@/pages/admin/AdminNotificationsPage"), "AdminNotificationsPage"));
const UsersPage = Loadable(lazyImport(() => import("@/pages/admin/UsersPage"), "UsersPage"));
const AdminSettingsPage = Loadable(lazyImport(() => import("@/pages/admin/AdminSettingsPage"), "AdminSettingsPage"));

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/verify-account", element: <VerifyAccountPage /> },
      { path: "/the-lead", element: <TheLeadPage /> },
      { path: "/faqs", element: <FaqsPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/help", element: <HelpPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/maintenance", element: <MaintenancePage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["lead"]} />,
        children: [
          {
            path: "/dashboard",
            element: <LeadLayout />,
            children: [
              { index: true, element: <LeadDashboardPage /> },
              { path: "vendors", element: <VendorsPage /> },
              { path: "opportunities", element: <LeadOpportunitiesPage /> },
              { path: "opportunities/:id", element: <LeadOpportunityDetailsPage /> },
              { path: "applied-projects", element: <AppliedProjectsPage /> },
              { path: "queries", element: <LeadQueriesPage /> },
              { path: "notifications", element: <LeadNotificationsPage /> },
              { path: "settings", element: <LeadSettingsPage /> },
            ],
          },
        ],
      },

      {
        element: <RoleRoute allowedRoles={["admin", "super_admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: "dashboard", element: <MetricsPage /> },
              { path: "opportunities", element: <AdminOpportunitiesPage /> },
              { path: "opportunities/new", element: <CreateOpportunityPage /> },
              { path: "opportunities/:id/edit", element: <EditOpportunityPage /> },
              { path: "lead-verification", element: <LeadVerificationPage /> },
              { path: "vendor-verification", element: <VendorVerificationPage /> },
              { path: "ai-summary", element: <AiSummaryPage /> },
              { path: "query-console", element: <QueryConsolePage /> },
              { path: "disputes", element: <DisputesPage /> },
              { path: "notifications", element: <AdminNotificationsPage /> },
              { path: "users", element: <UsersPage /> },
              { path: "settings", element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/403",
    element: <ErrorLayout statusCode="403" title="Forbidden" />,
  },
  {
    path: "/404",
    element: <ErrorLayout statusCode="404" title="Page not found" />,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);
