\# Vendly Routing Map

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

Defines all frontend routes, access rules, layouts, breadcrumbs,  
and navigation behavior.

\---

\# 2\. Layout Assignment

Public Routes  
→ PublicLayout

Lead Routes  
→ LeadLayout

Vendor Routes  
→ VendorLayout

Admin Routes  
→ AdminLayout

\---

\# 3\. Public Routes

| Route | Page | Auth |  
|--------|------|------|  
| / | Home | No |  
| /login | Login | No |  
| /signup | Signup | No |  
| /forgot-password | Forgot Password | No |  
| /verify-account | Verify Account | No |  
| /help | Help Center | No |  
| /privacy | Privacy Policy | No |  
| /terms | Terms & Conditions | No |  
| /404 | Not Found | No |  
| /maintenance | Maintenance | No |

\---

\# 4\. Lead Routes

Prefix: /dashboard

| Route | Description |  
|---------|------------|  
| /dashboard | Dashboard Home |  
| /dashboard/vendors | Vendor Directory |  
| /dashboard/opportunities | Opportunities |  
| /dashboard/opportunities/:id | Opportunity Details |  
| /dashboard/applied-projects | Applications |  
| /dashboard/queries | Query Center |  
| /dashboard/notifications | Notifications |  
| /dashboard/settings | Profile Settings |

Authentication required.

\---

\# 5\. Vendor Routes

Prefix: /vendor

| Route | Description |  
|---------|------------|  
| /vendor | Dashboard |  
| /vendor/opportunities | Opportunities |  
| /vendor/applications | Applications |  
| /vendor/notifications | Notifications |  
| /vendor/settings | Settings |

\---

\# 6\. Admin Routes

Prefix: /admin

| Route | Description |  
|---------|------------|  
| /admin | Dashboard |  
| /admin/dashboard | Metrics |  
| /admin/opportunities | Opportunities |  
| /admin/opportunities/new | Create Opportunity |  
| /admin/opportunities/:id/edit | Edit Opportunity |  
| /admin/lead-verification | Lead Verification |  
| /admin/vendor-verification | Vendor Verification |  
| /admin/ai-summary | AI Summary |  
| /admin/query-console | Queries |  
| /admin/disputes | Disputes |  
| /admin/notifications | Notification Rules |  
| /admin/users | User Management |  
| /admin/settings | Global Settings |

\---

\# 7\. Protected Routes

Require authentication:  
\- /dashboard/\*  
\- /vendor/\*  
\- /admin/\*

Unauthenticated users should redirect to /login.

\---

\# 8\. Role Guards

Lead:  
May only access Lead routes.

Vendor:  
May only access Vendor routes.

Admin:  
May access Admin routes.

Unauthorized access should return 403\.

\---

\# 9\. Breadcrumb Examples

Home

Home

Lead Dashboard

Home \> Dashboard

Opportunity

Home \> Dashboard \> Opportunities \> Details

Admin Verification

Home \> Admin \> Lead Verification

\---

\# 10\. URL Rules

\- Lowercase  
\- Hyphen-separated  
\- REST-like  
\- Human readable  
\- Stable

Avoid IDs in list routes unless required.

\---

\# 11\. Future Reserved Routes

/payments  
/reports  
/analytics  
/integrations  
/settings/security  
/settings/preferences

\---

\# 12\. Navigation Principles

\- Maximum 3 clicks to key features  
\- Predictable hierarchy  
\- Persistent sidebar in authenticated areas  
\- Sticky top navigation where appropriate  
