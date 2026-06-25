\# Vendly State Management

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines how application state should be managed in Vendly.

The goal is to:

\- Keep state predictable  
\- Minimize unnecessary re-renders  
\- Separate client state from server state  
\- Reduce complexity  
\- Improve maintainability  
\- Support scalable feature development

\---

\# 2\. State Management Philosophy

Always choose the smallest appropriate scope.

Priority:

1\. Local Component State  
2\. Shared Parent State  
3\. Zustand Global Store  
4\. TanStack Query Server Cache

Do not promote local state to global state unless necessary.

\---

\# 3\. Technology Choices

Global Client State:  
\- Zustand

Server State:  
\- TanStack Query

Forms:  
\- React Hook Form

Validation:  
\- Zod

Persistent Preferences:  
\- localStorage

Authentication:  
\- Secure token storage strategy defined by backend

\---

\# 4\. Local Component State

Use React useState for:

\- Modal open/close  
\- Dropdown visibility  
\- Hover state  
\- Input focus  
\- Temporary filters  
\- Wizard step  
\- Accordion expansion

Example:

isOpen  
selectedTab  
expandedRow

\---

\# 5\. Global Zustand Store

Only store information that is needed across multiple pages.

Recommended slices:

\#\# Auth Store

Fields:

\- isAuthenticated  
\- accessToken  
\- currentUser  
\- userRole

Actions:

\- login()  
\- logout()  
\- refreshUser()

\---

\#\# Theme Store

Fields:

\- theme  
\- systemPreference

Actions:

\- toggleTheme()  
\- setTheme()

Persist between sessions.

\---

\#\# Notification Store

Fields:

\- unreadCount  
\- latestNotifications

Actions:

\- markRead()  
\- markAllRead()

\---

\#\# UI Store

Fields:

\- sidebarCollapsed  
\- activeModal  
\- mobileMenuOpen

Actions:

\- toggleSidebar()  
\- openModal()  
\- closeModal()

\---

\# 6\. Do NOT Store in Zustand

Avoid storing:

\- Opportunities list  
\- Vendors list  
\- Dashboard metrics  
\- Queries  
\- Applications  
\- Paginated tables

These belong in TanStack Query.

\---

\# 7\. TanStack Query Responsibilities

Server state includes:

\- Opportunities  
\- Vendors  
\- Applications  
\- Queries  
\- Notifications  
\- Dashboard metrics  
\- Verification queues  
\- User lists  
\- Settings

Query cache should be the source of truth.

\---

\# 8\. Query Keys

Recommended structure:

\["opportunities"\]

\["opportunities", filters\]

\["opportunity", id\]

\["vendors"\]

\["applications"\]

\["notifications"\]

\["queries"\]

\["dashboard"\]

\["settings"\]

Use deterministic keys.

\---

\# 9\. Query Invalidation

Invalidate after:

\- Opportunity creation  
\- Opportunity update  
\- Verification decision  
\- Query reply  
\- Profile update  
\- Notification change

Avoid full application refreshes.

\---

\# 10\. Optimistic Updates

Allowed for:

\- Mark notification read  
\- Toggle settings  
\- Theme changes

Avoid optimistic updates for:

\- Verification approvals  
\- Financial actions  
\- Destructive operations

\---

\# 11\. Pagination State

Pagination should remain inside query parameters.

Store:

\- page  
\- pageSize  
\- sort  
\- filters

Do not duplicate server results globally.

\---

\# 12\. Filter State

Temporary page filters may remain local.

Persistent saved filters may be stored in localStorage.

\---

\# 13\. Authentication Flow

Login

↓

Receive JWT

↓

Store securely

↓

Populate Auth Store

↓

Fetch Profile

↓

Render Protected Routes

Logout clears:

\- Auth Store  
\- Query Cache  
\- Sensitive local data

\---

\# 14\. Theme Persistence

Theme selection should survive refreshes.

Priority:

1\. User preference  
2\. Saved preference  
3\. System preference

\---

\# 15\. Modal State

Simple modals:

Local state

Global modal launcher:

UI Store

Never maintain multiple conflicting modal states.

\---

\# 16\. Form State

Managed exclusively by React Hook Form.

Avoid duplicating form values in Zustand.

Validation handled with Zod schemas.

\---

\# 17\. Search State

Debounced search terms may remain local.

Server requests should derive from query parameters.

\---

\# 18\. Error State

API errors:

Handled by TanStack Query

Form errors:

Handled by React Hook Form

Global fatal errors:

Handled by Error Boundaries

\---

\# 19\. Loading State

Prefer query status flags:

\- isLoading  
\- isFetching  
\- isPending

Avoid duplicate loading booleans.

\---

\# 20\. Notification Flow

Backend Event

↓

Notification API

↓

TanStack Query Cache

↓

Notification Store updates unread count

↓

UI refreshes automatically

\---

\# 21\. Sidebar State

Persist collapsed state.

Remember user preference across sessions.

\---

\# 22\. User Session Expiry

On 401:

\- Clear auth  
\- Clear cache  
\- Redirect to login  
\- Preserve intended destination if possible

\---

\# 23\. Offline Considerations

Gracefully handle:

\- Network failures  
\- Retry operations  
\- Cached reads where safe

Never silently lose user input.

\---

\# 24\. Store Organization

src/store/

authStore.ts

themeStore.ts

notificationStore.ts

uiStore.ts

Avoid one giant global store.

\---

\# 25\. Anti-Patterns

Do NOT:

\- Put server data in Zustand  
\- Duplicate API results  
\- Mirror form state globally  
\- Store derived values unnecessarily  
\- Trigger excessive global updates

\---

\# 26\. Performance

Minimize subscriptions.

Select only required slices.

Memoize expensive derived values.

Avoid unnecessary rerenders.

\---

\# 27\. Future Expansion

State architecture should support:

\- AI recommendations  
\- Payments  
\- Reports  
\- Analytics  
\- Real-time messaging  
\- Mobile synchronization

without major restructuring.

\---

\# 28\. Definition of Success

A successful state management strategy:

\- Keeps local state local  
\- Keeps server state in TanStack Query  
\- Keeps shared UI state in Zustand  
\- Avoids duplication  
\- Remains easy to debug  
\- Scales with feature growth  
