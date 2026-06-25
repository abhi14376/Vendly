\# Vendly Information Architecture (IA)

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines the complete information architecture for Vendly,  
including navigation hierarchy, sitemap, routing, dashboards, URL  
patterns, breadcrumbs, and relationships between modules.

The IA is designed to support:  
\- Responsive web experiences  
\- Role-based navigation  
\- Scalable feature expansion  
\- Reusable layouts  
\- SEO-friendly public pages  
\- Clean React Router implementation

\---

\# 2\. User Roles

\#\# Visitor  
Unauthenticated user browsing the platform.

\#\# Lead  
Registered business user who explores opportunities and manages  
applications.

\#\# Vendor  
Registered service provider participating in projects.

\#\# Admin  
Platform administrator with operational and management privileges.

\---

\# 3\. Global Navigation Structure

Public  
│  
├── Home  
├── About (Optional)  
├── Login  
├── Signup  
├── Help  
├── Privacy Policy  
└── Terms & Conditions

Lead  
│  
├── Dashboard  
├── Vendors  
├── Opportunities  
├── Applied Projects  
├── Notifications  
├── Queries  
└── Settings

Vendor  
│  
├── Dashboard  
├── Opportunities  
├── Applications  
├── Notifications  
└── Settings

Admin  
│  
├── Dashboard  
├── Opportunities  
├── Add Opportunity  
├── Lead Verification  
├── Vendor Verification  
├── AI Summaries  
├── Query Console  
├── Dispute Console  
├── Notification Center  
├── User & Role Management  
└── Global Settings

\---

\# 4\. Public Sitemap

/

├── /  
├── /login  
├── /signup  
├── /forgot-password  
├── /verify-account  
├── /help  
├── /privacy  
├── /terms  
├── /404  
└── /maintenance

\---

\# 5\. Lead Portal Sitemap

/dashboard

├── /dashboard  
├── /dashboard/vendors  
├── /dashboard/opportunities  
├── /dashboard/opportunities/:id  
├── /dashboard/applied-projects  
├── /dashboard/notifications  
├── /dashboard/queries  
└── /dashboard/settings

\---

\# 6\. Vendor Portal Sitemap

/vendor

├── /vendor  
├── /vendor/opportunities  
├── /vendor/applications  
├── /vendor/notifications  
└── /vendor/settings

\---

\# 7\. Admin Portal Sitemap

/admin

├── /admin  
├── /admin/dashboard  
├── /admin/opportunities  
├── /admin/opportunities/new  
├── /admin/opportunities/:id/edit  
├── /admin/lead-verification  
├── /admin/vendor-verification  
├── /admin/ai-summary  
├── /admin/query-console  
├── /admin/disputes  
├── /admin/notifications  
├── /admin/users  
└── /admin/settings

\---

\# 8\. Navigation Layouts

\#\# Public Layout

Top Navigation:  
\- Logo  
\- Home  
\- Help  
\- Login  
\- Signup

Footer:  
\- Terms  
\- Privacy  
\- Contact  
\- Copyright

\---

\#\# Lead Layout

Persistent Left Sidebar

Menu:  
\- Dashboard  
\- Vendors  
\- Opportunities  
\- Applied Projects  
\- Notifications  
\- Queries  
\- Settings

Top Header:  
\- Search  
\- Notifications  
\- Theme Toggle  
\- Profile Menu

\---

\#\# Vendor Layout

Sidebar:  
\- Dashboard  
\- Opportunities  
\- Applications  
\- Notifications  
\- Settings

Top Bar:  
\- Search  
\- User Menu  
\- Theme Toggle

\---

\#\# Admin Layout

Glassmorphism Sidebar

Menu:  
\- Dashboard  
\- Opportunities  
\- Lead Verification  
\- Vendor Verification  
\- AI Summary  
\- Queries  
\- Disputes  
\- Notifications  
\- User Management  
\- Settings

Top Header:  
\- Global Search  
\- Notification Bell  
\- Theme Toggle  
\- Admin Profile

\---

\# 9\. Breadcrumb Examples

Home

Home

Lead Dashboard

Home  
\>  
Dashboard

Vendor Details

Home  
\>  
Dashboard  
\>  
Vendors

Opportunity

Home  
\>  
Dashboard  
\>  
Opportunities  
\>  
Opportunity Details

Admin Verification

Home  
\>  
Admin  
\>  
Lead Verification

\---

\# 10\. Page Hierarchy

Level 1  
\- Home

Level 2  
\- Authentication  
\- Dashboard

Level 3  
\- Module Pages

Level 4  
\- Detail Pages

Level 5  
\- Modal Interactions

Example:

Dashboard  
    └── Opportunities  
            └── Opportunity Detail  
                     └── Apply Modal

\---

\# 11\. Primary User Flows

Visitor

Landing  
→ Signup  
→ Login  
→ Dashboard

Lead

Dashboard  
→ Browse Opportunities  
→ Download Documents  
→ Raise Query  
→ Apply  
→ Track Status

Vendor

Dashboard  
→ Complete Verification  
→ View Opportunities  
→ Submit Application

Admin

Dashboard  
→ Verify User  
→ Publish Opportunity  
→ Respond to Query  
→ Update Status

\---

\# 12\. Modal Architecture

Used instead of navigation where appropriate.

Modals include:

\- Apply for Work  
\- Raise Query  
\- Upload Files  
\- Edit Profile  
\- Confirmation  
\- Delete Confirmation  
\- View Rejection Reason

Nested modals should be avoided.

\---

\# 13\. Search Architecture

Global Search:  
\- Vendors  
\- Opportunities  
\- Applications

Admin Search:  
\- Leads  
\- Vendors  
\- Users  
\- Projects

Results should support:  
\- Keyword  
\- Industry  
\- State  
\- Status

\---

\# 14\. Filtering System

Opportunities

Filters:  
\- Industry  
\- State  
\- Type  
\- Amount  
\- Status

Vendors

Filters:  
\- Industry  
\- Verification  
\- Location

Applications

Filters:  
\- Finalised  
\- Under Process  
\- Lost

\---

\# 15\. Notification Structure

Notification Center

├── Opportunity Updates  
├── Verification Status  
├── Query Replies  
├── Admin Messages  
└── System Alerts

Unread notifications should display badges.

\---

\# 16\. File Organization (React)

src/

├── app/  
├── assets/  
├── components/  
│   ├── common/  
│   ├── forms/  
│   ├── tables/  
│   ├── layout/  
│   └── modals/  
├── hooks/  
├── layouts/  
├── pages/  
│   ├── public/  
│   ├── lead/  
│   ├── vendor/  
│   └── admin/  
├── services/  
├── store/  
├── types/  
├── utils/  
└── styles/

\---

\# 17\. URL Design Principles

\- Lowercase  
\- Hyphen-separated  
\- Human-readable  
\- REST-friendly  
\- Stable  
\- No unnecessary nesting

Good:

/admin/lead-verification

Bad:

/AdminLeadVerifyPage123

\---

\# 18\. Mobile Navigation

Public:  
\- Hamburger Menu

Lead:  
\- Bottom Navigation (optional)  
\- Collapsible Sidebar

Admin:  
\- Collapsible Drawer

Tables should gracefully transform into stacked cards.

\---

\# 19\. Empty States

Provide dedicated pages or components for:

\- No Vendors  
\- No Opportunities  
\- No Applications  
\- No Notifications  
\- No Queries

Each should include:  
\- Illustration  
\- Helpful message  
\- Primary CTA

\---

\# 20\. Error Pages

404  
\- Page Not Found

401  
\- Unauthorized

403  
\- Forbidden

500  
\- Server Error

Maintenance  
\- Scheduled Downtime

Session Expired  
\- Prompt to Log In Again

\---

\# 21\. Future Expansion

Reserved modules:

\- Payments  
\- Commissions  
\- AI Matching  
\- Analytics  
\- Reports  
\- CRM  
\- Mobile APIs  
\- Audit Logs  
\- Multi-language Support

The IA is intentionally modular to support these additions without  
breaking existing navigation.

\---

\# 22\. IA Principles

\- Maximum 3 clicks to reach any primary function  
\- Consistent navigation across roles  
\- Role-specific visibility  
\- Progressive disclosure for complex actions  
\- Mobile-first responsiveness  
\- Accessibility-compliant structure  
\- Reusable layouts and components  
