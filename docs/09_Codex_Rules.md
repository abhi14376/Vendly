\# Vendly Codex Rules

Version: 1.0  
Status: Mandatory  
Applies To: All AI-generated code

\---

\# 1\. Purpose

This document defines the mandatory engineering and coding standards  
that every AI coding agent (Codex, Cursor, Claude Code, GitHub Copilot,  
etc.) must follow when generating code for Vendly.

These rules override any default assumptions made by the AI.

\---

\# 2\. Required Reading Order

Before generating code, always read and follow:

1\. 00\_Project\_Overview.md  
2\. 01\_Design\_System.md  
3\. 02\_Product\_Requirements\_Document.md  
4\. 03\_Information\_Architecture.md  
5\. 04\_User\_Journeys.md  
6\. 05\_Feature\_Specification.md  
7\. 06\_Component\_Library.md  
8\. 07\_Frontend\_Architecture.md  
9\. 08\_Design\_Tokens.md  
10\. This file (09\_Codex\_Rules.md)

Do not ignore previous documentation.

\---

\# 3\. Technology Stack

Always use:

\- React  
\- TypeScript  
\- Tailwind CSS  
\- React Router  
\- Zustand  
\- TanStack Query  
\- React Hook Form  
\- Zod  
\- Lucide React

Do not introduce alternative frameworks without explicit instruction.

\---

\# 4\. Code Quality

Generated code must be:

\- Production-ready  
\- Clean  
\- Readable  
\- Typed  
\- Modular  
\- Maintainable  
\- Testable

Avoid placeholder implementations unless requested.

\---

\# 5\. Reuse Existing Components

Before creating a new component:

\- Search for an existing equivalent.  
\- Extend existing components when appropriate.  
\- Avoid duplicate UI implementations.

Never create multiple Button or Input implementations.

\---

\# 6\. Follow the Design System

Never invent styles.

Always follow:

\- Colors  
\- Typography  
\- Spacing  
\- Border radius  
\- Shadows  
\- Animations  
\- Status badges  
\- Responsive behavior

from 01\_Design\_System.md and 08\_Design\_Tokens.md.

\---

\# 7\. Component Design

Components should:

\- Have a single responsibility.  
\- Accept typed props.  
\- Be composable.  
\- Avoid unnecessary state.  
\- Support accessibility.

Keep components small and focused.

\---

\# 8\. Prefer Composition

Preferred:

\<Card\>  
  \<CardHeader /\>  
  \<CardBody /\>  
\</Card\>

Avoid giant monolithic components.

\---

\# 9\. File Organization

Use the documented project structure.

Do not place unrelated files together.

Group by feature whenever practical.

\---

\# 10\. Routing

All routes should follow the routing map.

Avoid deep or inconsistent nesting.

Use descriptive URLs.

\---

\# 11\. State Management

Global state:

\- Authentication  
\- Theme  
\- User  
\- Notifications

Feature state should remain local whenever possible.

Do not store server data in global state if TanStack Query can manage it.

\---

\# 12\. API Calls

Never call fetch() directly inside UI components.

Instead:

Component  
→ Hook  
→ Service  
→ API

All network logic belongs in services.

\---

\# 13\. Forms

Use:

\- React Hook Form  
\- Zod

Validation must exist on both client and server.

Show inline validation messages.

\---

\# 14\. Error Handling

Handle gracefully:

\- Network failures  
\- Validation errors  
\- Unauthorized access  
\- Missing data  
\- Server failures

Never expose stack traces to users.

\---

\# 15\. Loading States

Every asynchronous operation must include:

\- Skeleton loaders OR  
\- Loading indicators

Disable repeated submissions while processing.

\---

\# 16\. Empty States

Never leave blank screens.

Provide:

\- Illustration  
\- Title  
\- Description  
\- Primary action

Examples:

"No opportunities available."

"No vendors found."

\---

\# 17\. Accessibility

Every interactive component must support:

\- Keyboard navigation  
\- Focus states  
\- Screen readers  
\- ARIA labels  
\- Sufficient contrast

Semantic HTML is required.

\---

\# 18\. Responsive Design

Always build mobile-first.

Support:

\- Mobile  
\- Tablet  
\- Desktop

Dashboards should remain usable at all sizes.

\---

\# 19\. Dark Mode

Every page and reusable component must support:

\- Light mode  
\- Dark mode

Do not hardcode colors.

\---

\# 20\. Naming Conventions

Components:  
PascalCase

Example:  
OpportunityCard.tsx

Hooks:  
useSomething.ts

Utilities:  
camelCase

Types:  
PascalCase

Constants:  
UPPER\_SNAKE\_CASE where appropriate.

\---

\# 21\. TypeScript

Avoid 'any'.

Prefer:

\- Interfaces  
\- Type aliases  
\- Generics

Enable strict typing.

\---

\# 22\. Styling Rules

Use Tailwind utilities.

Avoid:

\- Inline CSS  
\- \!important  
\- Random spacing values  
\- Hardcoded colors

Prefer reusable utility patterns.

\---

\# 23\. Performance

Use:

\- Lazy loading  
\- Memoization when beneficial  
\- Code splitting  
\- Optimized rendering

Avoid unnecessary re-renders.

\---

\# 24\. Security

Never expose:

\- Secrets  
\- Tokens  
\- Private keys

Sanitize user-generated content.

Validate uploads.

Respect role permissions.

\---

\# 25\. Tables

All large tables should support:

\- Pagination  
\- Search  
\- Sorting  
\- Loading state  
\- Empty state

Mobile fallback should be considered.

\---

\# 26\. Modals

Every modal should include:

\- Keyboard support  
\- Escape to close  
\- Focus trap  
\- Accessible labels

Avoid nested modals where possible.

\---

\# 27\. Logging

Log recoverable errors for debugging.

Never log passwords, tokens, or sensitive personal data.

\---

\# 28\. Documentation

Every exported hook, utility, or complex component should include concise comments explaining intent where necessary.

Avoid excessive or redundant comments.

\---

\# 29\. Tests

Write code that is testable.

Keep business logic separate from presentation.

Avoid hidden side effects.

\---

\# 30\. Future Compatibility

Prefer extensible implementations.

Do not hardcode assumptions that prevent future features such as:

\- Payments  
\- Commissions  
\- AI recommendations  
\- Multi-language support  
\- Mobile applications

\---

\# 31\. Definition of Success

A generated implementation is successful if it:

\- Compiles successfully  
\- Matches the Design System  
\- Is responsive  
\- Is accessible  
\- Is reusable  
\- Is strongly typed  
\- Avoids duplication  
\- Uses shared components  
\- Keeps concerns separated  
\- Is suitable for production deployment

\---

\# 32\. Absolute Rule

When uncertain:

\- Reuse instead of recreate.  
\- Simplify instead of over-engineer.  
\- Follow existing documentation instead of inventing behavior.  
\- Produce maintainable code over clever code.  
