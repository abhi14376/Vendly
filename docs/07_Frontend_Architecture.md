\# Vendly Frontend Architecture

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines the frontend architecture for Vendly.

It provides implementation guidance for React \+ TypeScript \+ Tailwind CSS  
and ensures consistency across all screens, components, layouts, and modules.

\---

\# 2\. Technology Stack

Framework:  
\- React 19+

Language:  
\- TypeScript

Styling:  
\- Tailwind CSS

Icons:  
\- Lucide React

Routing:  
\- React Router v7

Forms:  
\- React Hook Form

Validation:  
\- Zod

State Management:  
\- Zustand

Data Fetching:  
\- TanStack Query

Tables:  
\- TanStack Table

Charts:  
\- Recharts

Notifications:  
\- Sonner or React Hot Toast

\---

\# 3\. Project Folder Structure

src/

├── app/  
│   ├── App.tsx  
│   ├── providers.tsx  
│   └── router.tsx  
│  
├── assets/  
│  
├── components/  
│   ├── ui/  
│   ├── forms/  
│   ├── tables/  
│   ├── cards/  
│   ├── charts/  
│   ├── layout/  
│   ├── navigation/  
│   └── feedback/  
│  
├── features/  
│   ├── auth/  
│   ├── leads/  
│   ├── vendors/  
│   ├── opportunities/  
│   ├── applications/  
│   ├── queries/  
│   └── admin/  
│  
├── hooks/  
│  
├── layouts/  
│  
├── pages/  
│   ├── public/  
│   ├── lead/  
│   ├── vendor/  
│   └── admin/  
│  
├── services/  
│  
├── store/  
│  
├── types/  
│  
├── utils/  
│  
└── styles/

\---

\# 4\. Architecture Principles

\- Feature-first organization  
\- Reusable UI components  
\- Separation of concerns  
\- Minimal prop drilling  
\- Composition over inheritance  
\- API-first design  
\- Mobile-first UI

\---

\# 5\. Layouts

\#\# PublicLayout

Contains:  
\- Navbar  
\- Main Content  
\- Footer

Used for:  
\- Home  
\- Login  
\- Signup  
\- Help  
\- Privacy  
\- Terms

\---

\#\# LeadLayout

Contains:  
\- Sidebar  
\- Header  
\- Main Content  
\- Footer

Persistent navigation.

\---

\#\# VendorLayout

Structure similar to LeadLayout with vendor-specific menus.

\---

\#\# AdminLayout

Contains:  
\- Glass sidebar  
\- Sticky header  
\- Main dashboard area  
\- Global notifications

Supports sidebar collapse.

\---

\# 6\. Routing Strategy

Public

/  
/login  
/signup  
/help  
/privacy  
/terms

Lead

/dashboard  
/dashboard/vendors  
/dashboard/opportunities  
/dashboard/applied-projects  
/dashboard/settings

Vendor

/vendor  
/vendor/opportunities  
/vendor/settings

Admin

/admin  
/admin/opportunities  
/admin/verification  
/admin/users  
/admin/settings

\---

\# 7\. Component Hierarchy

Page

↓

Layout

↓

Feature Components

↓

Reusable UI Components

↓

Primitive Elements

No page should directly duplicate reusable UI.

\---

\# 8\. State Management

Global State:

\- Authentication  
\- Current User  
\- Theme  
\- Notifications

Feature State:

\- Filters  
\- Forms  
\- Tables  
\- Modal visibility

Server State:

Managed via TanStack Query.

\---

\# 9\. API Layer

Never call fetch() directly inside components.

Instead:

Component

↓

Feature Hook

↓

Service

↓

API

Services should be isolated under:

src/services/

\---

\# 10\. Form Strategy

Use:

\- React Hook Form  
\- Zod schemas

Validation should occur:

\- Client-side  
\- Server-side

Error messages must be user-friendly.

\---

\# 11\. Styling Rules

Use Tailwind utility classes.

Avoid:  
\- Inline styles  
\- Arbitrary values unless necessary  
\- Duplicate class strings

Prefer reusable class compositions.

\---

\# 12\. Theme Support

Support:

\- Light  
\- Dark

Theme should persist between sessions.

Avoid hardcoded colors.

Use design tokens where possible.

\---

\# 13\. Responsive Strategy

Mobile-first.

Breakpoints:

sm  
md  
lg  
xl  
2xl

Tables should gracefully degrade to stacked layouts on smaller screens.

\---

\# 14\. Accessibility

Every interactive element must support:

\- Keyboard navigation  
\- Focus indicators  
\- ARIA labels  
\- Screen readers

Semantic HTML is mandatory.

\---

\# 15\. Performance

Implement:

\- Lazy-loaded routes  
\- Code splitting  
\- Memoization where appropriate  
\- Optimized images  
\- Virtualized large tables if needed

Avoid unnecessary re-renders.

\---

\# 16\. Error Boundaries

Wrap major route groups with error boundaries.

Display friendly fallback UIs.

\---

\# 17\. Loading States

Use:

\- Skeleton loaders  
\- Optimistic updates where safe  
\- Disabled controls during submission

Avoid blocking full-screen loaders.

\---

\# 18\. File Naming

Components:  
PascalCase

Example:  
OpportunityCard.tsx

Hooks:  
camelCase with "use"

Example:  
useOpportunities.ts

Utilities:  
camelCase

Example:  
formatCurrency.ts

\---

\# 19\. Import Rules

Prefer absolute imports.

Example:

@/components/ui/Button

Avoid deeply nested relative imports.

\---

\# 20\. Testing Strategy

Each feature should support:

\- Unit testing  
\- Component testing  
\- Integration testing

Business logic should remain testable independently from UI.

\---

\# 21\. Security

Never expose secrets in frontend code.

Sanitize user-generated content.

Validate uploads and API responses.

Enforce role-based rendering.

\---

\# 22\. Logging

Frontend should log:

\- Recoverable errors  
\- API failures  
\- Unexpected exceptions

Sensitive information must never be logged.

\---

\# 23\. AI Coding Guidelines

Generated code should:

\- Be modular  
\- Be readable  
\- Minimize duplication  
\- Follow the Design System  
\- Use reusable components  
\- Respect the routing hierarchy  
\- Keep business logic outside presentation components

\---

\# 24\. Definition of Good Architecture

A successful implementation:

\- Scales without major rewrites  
\- Promotes reuse  
\- Supports future features  
\- Is easy to understand  
\- Is easy to test  
\- Is easy to maintain  
\- Produces a consistent user experience  
