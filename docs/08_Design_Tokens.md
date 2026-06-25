\# Vendly Design Tokens

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines the design tokens used throughout Vendly.

Design tokens are the single source of truth for colors, typography,  
spacing, sizing, borders, shadows, animations, and responsive behavior.

All UI components must consume these tokens instead of hardcoded values.

\---

\# 2\. Brand Colors

\#\# Primary

primary-50:  \#EFF6FF  
primary-100: \#DBEAFE  
primary-200: \#BFDBFE  
primary-300: \#93C5FD  
primary-400: \#60A5FA  
primary-500: \#3B82F6  
primary-600: \#2563EB  
primary-700: \#1D4ED8  
primary-800: \#1E40AF  
primary-900: \#1E3A8A

\---

\#\# Neutral

white:        \#FFFFFF  
slate-50:     \#F8FAFC  
slate-100:    \#F1F5F9  
slate-200:    \#E2E8F0  
slate-300:    \#CBD5E1  
slate-400:    \#94A3B8  
slate-500:    \#64748B  
slate-600:    \#475569  
slate-700:    \#334155  
slate-800:    \#1E293B  
slate-900:    \#0F172A

\---

\#\# Semantic

success: \#22C55E  
warning: \#F59E0B  
error:   \#EF4444  
info:    \#0EA5E9

\---

\#\# Status Colors

Approved:  
Background: success  
Text: white

Under Process:  
Background: warning  
Text: white

Disapproved:  
Background: error  
Text: white

Finalised:  
Background: success  
Text: white

Lost:  
Background: error  
Text: white

Draft:  
Background: slate-300  
Text: slate-800

\---

\# 3\. Typography

\#\# Font Family

Primary:  
Inter

Fallback:  
system-ui, sans-serif

\---

\#\# Font Weights

Light: 300  
Regular: 400  
Medium: 500  
SemiBold: 600  
Bold: 700

\---

\#\# Font Sizes

Display: 60px  
H1: 48px  
H2: 36px  
H3: 30px  
H4: 24px  
H5: 20px  
Body Large: 18px  
Body: 16px  
Small: 14px  
Caption: 12px

\---

\#\# Line Heights

Display: 1.1  
Heading: 1.2  
Body: 1.5  
Caption: 1.4

\---

\# 4\. Spacing Scale

0: 0px  
1: 4px  
2: 8px  
3: 12px  
4: 16px  
5: 20px  
6: 24px  
8: 32px  
10: 40px  
12: 48px  
16: 64px  
20: 80px  
24: 96px

Always use this spacing scale instead of arbitrary values.

\---

\# 5\. Border Radius

xs: 4px  
sm: 8px  
md: 12px  
lg: 16px  
xl: 20px  
2xl: 24px  
pill: 9999px

\---

\# 6\. Border Width

thin: 1px  
medium: 2px  
thick: 4px

Default:  
1px

\---

\# 7\. Shadows

sm:  
0 1px 2px rgba(0,0,0,0.05)

md:  
0 8px 20px rgba(0,0,0,0.08)

lg:  
0 12px 30px rgba(0,0,0,0.12)

xl:  
0 20px 40px rgba(0,0,0,0.16)

Use subtle shadows only.

\---

\# 8\. Opacity

disabled: 0.5  
muted: 0.7  
overlay: 0.6  
hidden: 0

\---

\# 9\. Z-Index Scale

base: 0  
dropdown: 100  
sticky: 200  
overlay: 300  
drawer: 400  
modal: 500  
toast: 600  
tooltip: 700

\---

\# 10\. Breakpoints

sm: 640px  
md: 768px  
lg: 1024px  
xl: 1280px  
2xl: 1536px

Development should be mobile-first.

\---

\# 11\. Container Widths

content:  
1280px

dashboard:  
1440px

legal:  
768px

\---

\# 12\. Sidebar Width

Expanded:  
280px

Collapsed:  
88px

Mobile:  
Drawer behavior

\---

\# 13\. Header Height

Public Navbar:  
72px

Dashboard Header:  
72px

Mobile Header:  
64px

\---

\# 14\. Buttons

Height:  
48px

Padding:  
16px horizontal

Radius:  
pill

Icon Gap:  
8px

\---

\# 15\. Form Controls

Input Height:  
52px

Textarea Minimum:  
120px

Checkbox:  
20px

Radio:  
20px

Toggle:  
44px

\---

\# 16\. Cards

Padding:  
24px

Radius:  
20px

Border:  
1px

Shadow:  
medium

\---

\# 17\. Tables

Header Height:  
56px

Row Height:  
56px

Cell Padding:  
16px

Sticky Header:  
Enabled

\---

\# 18\. Modals

Maximum Width:  
640px

Radius:  
24px

Padding:  
32px

Overlay Blur:  
Enabled

\---

\# 19\. Drawers

Desktop Width:  
400px

Mobile:  
100% viewport width

\---

\# 20\. Animations

Fast:  
150ms

Normal:  
200ms

Slow:  
300ms

Timing:  
ease-in-out

Allowed:  
\- Fade  
\- Slide  
\- Scale

Avoid:  
\- Bounce  
\- Flash  
\- Excessive motion

\---

\# 21\. Icon Sizes

Small:  
16px

Default:  
20px

Large:  
24px

Hero:  
32px

Library:  
Lucide React

\---

\# 22\. Avatars

Small:  
32px

Medium:  
40px

Large:  
56px

Extra Large:  
80px

\---

\# 23\. File Upload Zone

Minimum Height:  
180px

Border:  
Dashed

Radius:  
16px

Supports drag-and-drop.

\---

\# 24\. Skeleton Loaders

Animation:  
Pulse

Radius:  
Match underlying component

Should replace blocking spinners where practical.

\---

\# 25\. Toast Notifications

Position:  
Top Right

Maximum Visible:  
3

Auto Dismiss:  
4 seconds

\---

\# 26\. Focus Ring

Color:  
primary-500

Width:  
2px

Offset:  
2px

Visible on keyboard navigation.

\---

\# 27\. Motion Accessibility

Respect prefers-reduced-motion.

Disable non-essential animations when requested by the user agent.

\---

\# 28\. Responsive Rules

Mobile:  
Single-column layouts

Tablet:  
Adaptive grids

Desktop:  
Multi-column dashboards

Tables may convert to cards on small screens.

\---

\# 29\. Naming Convention

Use semantic token names.

Preferred:  
primary-600  
success  
warning

Avoid:  
blue1  
greenBright  
customColor123

\---

\# 30\. Implementation Guidance

These tokens should be reflected in:

\- Tailwind theme configuration  
\- CSS custom properties (optional)  
\- Shared constants  
\- Component defaults

Never hardcode colors, spacing, typography, or sizing when a design token exists.  
