\# Vendly Folder Structure

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines the recommended folder and file structure for the  
Vendly codebase.

All developers and AI coding agents must follow this structure to ensure  
consistency, maintainability, and scalability.

\---

\# 2\. Technology Stack

\- React  
\- TypeScript  
\- Vite  
\- Tailwind CSS  
\- React Router  
\- Zustand  
\- TanStack Query  
\- React Hook Form  
\- Zod  
\- Lucide React  
\- Supabase (Backend)

\---

\# 3\. Root Directory

vendly/

├── docs/  
├── public/  
├── src/  
├── supabase/  
├── package.json  
├── tsconfig.json  
├── vite.config.ts  
├── tailwind.config.ts  
├── postcss.config.js  
├── eslint.config.js  
├── .env.example  
├── .gitignore  
└── README.md

\---

\# 4\. Documentation

docs/

├── 00\_Project\_Overview.md  
├── 01\_Design\_System.md  
├── 02\_Product\_Requirements\_Document.md  
├── 03\_Information\_Architecture.md  
├── 04\_User\_Journeys.md  
├── 05\_Feature\_Specification.md  
├── 06\_Component\_Library.md  
├── 07\_Frontend\_Architecture.md  
├── 08\_Design\_Tokens.md  
├── 09\_Codex\_Rules.md  
├── 10\_API\_Contracts.md  
├── 11\_Routing\_Map.md  
├── 12\_State\_Management.md  
├── 13\_Database\_Schema.md  
├── 14\_UI\_Copy\_Guide.md  
├── 15\_Accessibility\_Guidelines.md  
├── 17\_Codex\_Master\_Prompt.md  
└── 18\_Folder\_Structure.md

\---

\# 5\. Public Assets

public/

├── favicon.ico  
├── logo.svg  
├── robots.txt  
├── images/  
├── icons/  
└── fonts/

\---

\# 6\. Source Directory

src/

├── app/  
├── assets/  
├── components/  
├── config/  
├── features/  
├── hooks/  
├── layouts/  
├── lib/  
├── pages/  
├── routes/  
├── services/  
├── store/  
├── styles/  
├── types/  
├── utils/  
├── App.tsx  
├── main.tsx  
└── vite-env.d.ts

\---

\# 7\. app/

Contains application bootstrap logic.

app/

├── providers.tsx  
├── router.tsx  
├── queryClient.ts  
└── theme.ts

\---

\# 8\. assets/

Stores static project assets imported into React.

assets/

├── images/  
├── illustrations/  
├── logos/  
├── icons/  
└── animations/

\---

\# 9\. components/

Reusable UI building blocks.

components/

├── ui/  
├── forms/  
├── tables/  
├── cards/  
├── dialogs/  
├── navigation/  
├── feedback/  
├── charts/  
├── upload/  
└── layout/

\---

\# 10\. components/ui/

Examples:

Button.tsx  
Input.tsx  
Textarea.tsx  
Select.tsx  
Checkbox.tsx  
Radio.tsx  
Badge.tsx  
Avatar.tsx  
Tooltip.tsx  
Spinner.tsx  
Skeleton.tsx

\---

\# 11\. components/forms/

Examples:

LoginForm.tsx  
SignupForm.tsx  
ProfileForm.tsx  
OpportunityForm.tsx  
QueryForm.tsx

\---

\# 12\. components/tables/

Examples:

VendorTable.tsx  
OpportunityTable.tsx  
ApplicationTable.tsx  
NotificationTable.tsx

\---

\# 13\. components/cards/

Examples:

MetricCard.tsx  
OpportunityCard.tsx  
VendorCard.tsx  
StatCard.tsx

\---

\# 14\. components/dialogs/

Examples:

ApplyDialog.tsx  
ConfirmationDialog.tsx  
RejectDialog.tsx  
UploadDialog.tsx

\---

\# 15\. features/

Business modules grouped by domain.

features/

├── auth/  
├── dashboard/  
├── opportunities/  
├── vendors/  
├── applications/  
├── queries/  
├── notifications/  
├── settings/  
└── admin/

Each feature may contain:

components/  
hooks/  
services/  
types/  
utils/

\---

\# 16\. hooks/

Shared reusable hooks.

Examples:

useAuth.ts  
useDebounce.ts  
useTheme.ts  
usePagination.ts  
useNotifications.ts

\---

\# 17\. layouts/

PublicLayout.tsx

LeadLayout.tsx

VendorLayout.tsx

AdminLayout.tsx

ErrorLayout.tsx

\---

\# 18\. pages/

pages/

├── public/  
├── lead/  
├── vendor/  
└── admin/

Each page should compose reusable components rather than contain  
complex business logic.

\---

\# 19\. routes/

Contains route configuration and guards.

Examples:

ProtectedRoute.tsx

AdminRoute.tsx

LeadRoute.tsx

VendorRoute.tsx

\---

\# 20\. services/

Responsible for API communication only.

Examples:

authService.ts

opportunityService.ts

vendorService.ts

queryService.ts

notificationService.ts

No UI logic should exist here.

\---

\# 21\. store/

Global Zustand stores.

Examples:

authStore.ts

themeStore.ts

uiStore.ts

notificationStore.ts

Avoid a single monolithic store.

\---

\# 22\. styles/

Contains:

globals.css

tailwind.css

variables.css (optional)

Keep custom CSS minimal.

\---

\# 23\. types/

Shared TypeScript interfaces.

Examples:

User.ts

Opportunity.ts

Application.ts

Notification.ts

Query.ts

\---

\# 24\. utils/

Pure helper functions.

Examples:

formatCurrency.ts

formatDate.ts

downloadFile.ts

truncateText.ts

No React components.

\---

\# 25\. lib/

Shared integrations and configuration.

Examples:

supabase.ts

env.ts

logger.ts

constants.ts

\---

\# 26\. config/

Application configuration.

Examples:

navigation.ts

permissions.ts

featureFlags.ts

themeConfig.ts

\---

\# 27\. Supabase

supabase/

├── migrations/  
├── functions/  
├── seed/  
└── config.toml

migrations/

001\_initial\_schema.sql

Subsequent migrations should be incremental and reversible.

\---

\# 28\. Naming Conventions

Components:  
PascalCase

Example:  
OpportunityCard.tsx

Hooks:  
useSomething.ts

Utilities:  
camelCase

Stores:  
somethingStore.ts

Services:  
somethingService.ts

Types:  
PascalCase

\---

\# 29\. Import Strategy

Prefer path aliases.

Example:

@/components/ui/Button

Avoid long relative imports such as:

../../../../components/Button

\---

\# 30\. Testing (Recommended)

tests/

├── unit/  
├── integration/  
└── e2e/

Future-ready structure for automated testing.

\---

\# 31\. Forbidden Practices

Do NOT:

\- Duplicate components  
\- Mix API logic with UI  
\- Put business logic inside pages  
\- Hardcode design values  
\- Create unrelated utility folders  
\- Store secrets in source files

\---

\# 32\. Guiding Principle

Every new feature should integrate cleanly into this structure without  
requiring major reorganization.

When uncertain:

\- Prefer feature-based organization.  
\- Reuse before creating.  
\- Keep files focused and modular.  
\- Follow the Design System and Codex Rules documents.  
