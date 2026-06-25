\# Vendly Product Requirements Document (PRD)

Version: 1.0  
Status: Approved for MVP Development

\---

\# 1\. Product Overview

\#\# Product Name

Vendly

\#\# Product Category

Verification-first B2B Marketplace

\#\# Tagline

Connecting Verified Opportunities with Verified Businesses.

\#\# Summary

Vendly is a modern B2B marketplace that connects project owners ("Leads") with verified vendors across multiple industries such as Civil Construction, Roads, Interiors, Electrical, Solar, Events, Supply, Crash Barriers, and related sectors.

Unlike traditional listing portals, Vendly focuses on trust through verification, streamlined opportunity management, and transparent application workflows.

\---

\# 2\. Vision

To become India's most trusted platform for discovering, managing, and participating in B2B project opportunities.

\---

\# 3\. Mission

\- Simplify vendor discovery  
\- Increase transparency  
\- Reduce operational friction  
\- Digitize tender and back-to-back project workflows  
\- Build trust through verification

\---

\# 4\. Target Users

\#\# Lead

Organizations or individuals seeking vendors for projects.

Responsibilities:  
\- Register account  
\- Maintain profile  
\- Browse vendors  
\- View opportunities  
\- Apply for work  
\- Track applications  
\- Raise queries

\---

\#\# Vendor

Businesses providing products or services.

Responsibilities:  
\- Register  
\- Complete verification  
\- Maintain company profile  
\- Participate in opportunities  
\- Respond to communications

\---

\#\# Administrator

Platform operators responsible for governance.

Responsibilities:  
\- Verify accounts  
\- Publish opportunities  
\- Review applications  
\- Resolve disputes  
\- Configure notifications  
\- Manage permissions

\---

\# 5\. Industries Supported

Initial MVP includes:

\- Civil Construction  
\- Road Construction  
\- Interior Works  
\- Electrical  
\- Solar  
\- Supply  
\- Boom Barriers  
\- Crash Barriers  
\- Events  
\- Marketing Activations  
\- Infrastructure  
\- Fabrication

The taxonomy should be extensible.

\---

\# 6\. Project Types

\#\# Tender

Characteristics:  
\- Submission deadline  
\- Official documentation  
\- Competitive bidding  
\- Structured process

Fields:  
\- Last date of submission  
\- BOQ  
\- RFP  
\- Drawings  
\- Supporting documents

\---

\#\# Back-to-Back Project

Characteristics:  
\- Already awarded or directly subcontracted  
\- Royalty percentage  
\- Work award date  
\- Win status

Fields:  
\- Award date  
\- Tender status  
\- Royalty %  
\- Supporting files

\---

\# 7\. Core Business Objectives

\- Centralize opportunity management  
\- Improve vendor discovery  
\- Reduce manual coordination  
\- Increase verified participation  
\- Provide audit-ready workflows  
\- Enable scalable operations

\---

\# 8\. Functional Requirements

\#\# Authentication

\- Login  
\- Signup  
\- Logout  
\- Session management  
\- Password reset

\---

\#\# Lead Registration

Collect:  
\- Name  
\- Mobile  
\- Company  
\- Address  
\- Email  
\- Website (optional)  
\- Industries served

\---

\#\# Vendor Management

Display:  
\- Company name  
\- Contact information  
\- Industry mapping  
\- Verification status

Statuses:  
\- Approved  
\- Under Process  
\- Disapproved

Rejected entities must receive reasons and resubmission capability.

\---

\#\# Opportunity Management

Display:  
\- Title  
\- Industry  
\- State  
\- Amount  
\- Type  
\- Description

Actions:  
\- Download documents  
\- Raise queries  
\- Apply

\---

\#\# Applications

Track:  
\- Submitted  
\- Under Process  
\- Finalised  
\- Lost

Lost applications should display admin remarks.

\---

\#\# Query System

Allow users to:  
\- Submit questions  
\- Receive replies  
\- Download responses  
\- Track history

\---

\#\# Notifications

Support:  
\- In-app  
\- Email  
\- SMS  
\- WhatsApp (future)

\---

\#\# Profile Management

Allow editing:  
\- Contact details  
\- Company  
\- Password  
\- Avatar

\---

\#\# Admin Portal

Provide:  
\- Dashboard metrics  
\- Opportunity management  
\- Verification queues  
\- Query management  
\- User roles  
\- Notifications  
\- Settings

\---

\# 9\. Non-Functional Requirements

Performance:  
\- Initial page load under 2 seconds  
\- Lazy loading where appropriate

Security:  
\- HTTPS  
\- Role-based access  
\- Input validation  
\- CSRF protection  
\- XSS prevention

Scalability:  
\- Modular architecture  
\- API-first design  
\- Component reuse

Accessibility:  
\- WCAG 2.1 AA  
\- Keyboard navigation  
\- Screen reader support

Responsiveness:  
\- Mobile-first  
\- Tablet optimized  
\- Desktop optimized

\---

\# 10\. User Roles & Permissions

| Feature | Visitor | Lead | Vendor | Admin |  
|----------|----------|-------|---------|--------|  
| View Home | ✓ | ✓ | ✓ | ✓ |  
| Register | ✓ | ✓ | ✓ | ✓ |  
| Login | ✓ | ✓ | ✓ | ✓ |  
| Browse Opportunities | ✓ | ✓ | ✓ | ✓ |  
| Apply | ✗ | ✓ | ✓ | ✓ |  
| Manage Profile | ✗ | ✓ | ✓ | ✓ |  
| Verify Accounts | ✗ | ✗ | ✗ | ✓ |  
| Publish Opportunities | ✗ | ✗ | ✗ | ✓ |  
| Manage Roles | ✗ | ✗ | ✗ | ✓ |

\---

\# 11\. MVP Scope

Included:

\- Landing page  
\- Authentication  
\- Lead registration  
\- Vendor listing  
\- Opportunity listing  
\- Opportunity application  
\- Query management  
\- Application tracking  
\- Admin dashboard  
\- Verification workflow  
\- Legal pages  
\- Profile settings

Excluded (Future):

\- Payments  
\- Commissions  
\- AI recommendations  
\- Mobile apps  
\- Advanced analytics  
\- Multi-language support

\---

\# 12\. Success Metrics

Business:  
\- Number of verified users  
\- Opportunities published  
\- Applications submitted

Operational:  
\- Verification turnaround time  
\- Query resolution time

Product:  
\- Daily active users  
\- User retention  
\- Dashboard engagement

\---

\# 13\. Design Principles

The product should always feel:

\- Clean  
\- Professional  
\- Enterprise-grade  
\- Fast  
\- Minimal  
\- Trustworthy

Every screen must follow the centralized Design System.

\---

\# 14\. Technology Stack

Frontend:  
\- React  
\- TypeScript  
\- Tailwind CSS

Routing:  
\- React Router

Icons:  
\- Lucide React

Backend:  
\- REST APIs

State Management:  
\- Context or Zustand (recommended)

\---

\# 15\. Future Roadmap

Phase 2:  
\- AI project summarization  
\- Smart recommendations  
\- Advanced search  
\- Saved filters

Phase 3:  
\- Native mobile apps  
\- Real-time messaging  
\- Vendor ratings  
\- Analytics dashboards  
\- Workflow automation  
\- External integrations

\---

\# 16\. Definition of Done

A feature is complete only if:  
\- It follows the Design System  
\- It is responsive  
\- It supports dark mode  
\- It passes accessibility checks  
\- It includes loading and empty states  
\- It handles validation and errors gracefully  
\- It is reusable and documented  
