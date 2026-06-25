\# Vendly Component Library

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines all reusable UI components used throughout  
Vendly.

Every page should be composed from these standardized components  
instead of creating one-off implementations.

Goals:  
\- Consistent UI  
\- Faster development  
\- Easier maintenance  
\- Better accessibility  
\- AI-friendly code generation

\---

\# 2\. Design Principles

All components must:

\- Follow 01\_Design\_System.md  
\- Be responsive  
\- Support light and dark mode  
\- Be keyboard accessible  
\- Support loading states  
\- Support disabled states  
\- Use semantic HTML  
\- Be reusable

\---

\# 3\. Primary Button

Purpose:  
Primary user action.

Variants:  
\- Default  
\- Loading  
\- Disabled  
\- Success  
\- Danger

Props:  
\- children  
\- onClick  
\- disabled  
\- loading  
\- icon  
\- fullWidth

Examples:  
\- Login  
\- Apply  
\- Publish  
\- Save

\---

\# 4\. Secondary Button

Purpose:  
Secondary actions.

Examples:  
\- Cancel  
\- Back  
\- Learn More

Should use outlined styling.

\---

\# 5\. Ghost Button

Transparent background.

Examples:  
\- Close  
\- Skip  
\- Dismiss

\---

\# 6\. Text Input

Supports:  
\- Label  
\- Placeholder  
\- Validation  
\- Error message  
\- Required indicator  
\- Prefix/Suffix icons

Used for:  
\- Name  
\- Email  
\- Company

\---

\# 7\. Password Input

Extends Text Input.

Additional features:  
\- Show/Hide toggle  
\- Strength indicator  
\- Autofill support

\---

\# 8\. Textarea

Used for:  
\- Query messages  
\- Descriptions  
\- Admin remarks

Should auto-expand where appropriate.

\---

\# 9\. Select Dropdown

Supports:  
\- Search  
\- Single select  
\- Keyboard navigation

Examples:  
\- Industry  
\- State  
\- Project Type

\---

\# 10\. Multi Select

Displays selections as removable chips.

Used for:  
\- Industries Served

\---

\# 11\. Checkbox

Supports:  
\- Individual  
\- Group  
\- Indeterminate

\---

\# 12\. Radio Group

Used when exactly one choice is permitted.

Example:  
\- Tender  
\- Back-to-Back

\---

\# 13\. Toggle Switch

Used for:  
\- Dark Mode  
\- Notifications  
\- Feature Flags

\---

\# 14\. File Upload

Supports:  
\- Drag & Drop  
\- Click Upload  
\- Progress Bar  
\- Retry  
\- Remove

Accepted:  
\- PDF  
\- DOCX  
\- XLSX  
\- CSV  
\- PNG  
\- JPG

\---

\# 15\. Avatar

Variants:  
\- Image  
\- Initials  
\- Placeholder

Sizes:  
\- Small  
\- Medium  
\- Large

\---

\# 16\. Badge

Purpose:  
Display status.

Variants:  
\- Approved  
\- Under Process  
\- Disapproved  
\- Finalised  
\- Lost  
\- Draft

\---

\# 17\. Card

Standard container.

Supports:  
\- Header  
\- Body  
\- Footer  
\- Actions

Used across dashboards.

\---

\# 18\. Metric Card

Displays:  
\- Icon  
\- Label  
\- Value  
\- Trend

Examples:  
\- Total Leads  
\- Open Queries

\---

\# 19\. Data Table

Features:  
\- Sticky Header  
\- Pagination  
\- Sorting  
\- Search  
\- Empty State  
\- Loading State  
\- Row Hover

Must support responsive fallback.

\---

\# 20\. Search Bar

Supports:  
\- Debounce  
\- Clear button  
\- Keyboard shortcut

Used globally.

\---

\# 21\. Filter Panel

Reusable filter drawer.

Supports:  
\- Industry  
\- State  
\- Status  
\- Type

\---

\# 22\. Modal

Variants:  
\- Confirmation  
\- Form  
\- Information  
\- Warning

Features:  
\- ESC to close  
\- Focus trap  
\- Overlay click optional

\---

\# 23\. Drawer

Slides from:  
\- Left  
\- Right

Used on mobile and admin panels.

\---

\# 24\. Tabs

Used for:  
\- Verification queues  
\- Settings sections

Keyboard accessible.

\---

\# 25\. Accordion

Used in:  
\- FAQ  
\- Help Center

Supports multiple or single expansion.

\---

\# 26\. Breadcrumb

Example:

Home \> Dashboard \> Opportunities

Automatically generated where possible.

\---

\# 27\. Pagination

Includes:  
\- Previous  
\- Next  
\- Page numbers

Responsive behavior required.

\---

\# 28\. Toast Notification

Variants:  
\- Success  
\- Error  
\- Warning  
\- Info

Auto-dismiss after timeout.

\---

\# 29\. Tooltip

Appears on hover/focus.

Must be accessible.

\---

\# 30\. Skeleton Loader

Used while loading:  
\- Tables  
\- Cards  
\- Forms  
\- Dashboards

Preferred over blocking spinners.

\---

\# 31\. Empty State

Contains:  
\- Illustration  
\- Title  
\- Description  
\- CTA

Examples:  
\- No Vendors  
\- No Opportunities

\---

\# 32\. Sidebar

Lead Sidebar:  
\- Dashboard  
\- Vendors  
\- Opportunities  
\- Applied Projects  
\- Queries  
\- Settings

Admin Sidebar:  
\- Dashboard  
\- Opportunities  
\- Verification  
\- AI Summary  
\- Users  
\- Settings

Supports collapse.

\---

\# 33\. Top Navigation

Contains:  
\- Logo  
\- Search  
\- Notifications  
\- Theme Toggle  
\- User Menu

Sticky positioning.

\---

\# 34\. Footer

Public pages:  
\- Privacy  
\- Terms  
\- Help

Minimal and responsive.

\---

\# 35\. Notification Item

Displays:  
\- Icon  
\- Title  
\- Description  
\- Timestamp  
\- Read Status

Clickable.

\---

\# 36\. Query Thread

Chat-style layout.

Supports:  
\- Admin replies  
\- Attachments  
\- Timestamps

\---

\# 37\. Timeline

Displays application history:

Submitted  
→ Under Process  
→ Finalised

or

Submitted  
→ Lost

\---

\# 38\. Progress Indicator

Supports:  
\- Linear  
\- Circular

Used for uploads and processing.

\---

\# 39\. Error Message

Should include:  
\- Clear explanation  
\- Recovery action  
\- Optional retry

Never expose technical details.

\---

\# 40\. Component Rules

\- Reuse existing components.  
\- Avoid duplicate implementations.  
\- Keep props minimal and composable.  
\- Prefer composition over inheritance.  
\- Maintain visual consistency.  
\- Every component should be independently testable.  
\- Every component should include loading, disabled, and accessibility support where applicable.  
