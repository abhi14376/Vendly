\# Vendly Design System  
Version: 1.0

\#\# 1\. Design Principles

Vendly should communicate:  
\- Trust  
\- Simplicity  
\- Professionalism  
\- Speed  
\- Transparency  
\- Enterprise reliability

The interface should remain clean, uncluttered, and highly usable across desktop, tablet, and mobile devices.

Inspirations:  
\- Stripe  
\- Linear  
\- Notion  
\- Vercel  
\- Ramp

\---

\# 2\. Brand Personality

\- Modern  
\- Minimal  
\- Confident  
\- Premium  
\- Human-centric  
\- Data-driven

Avoid unnecessary gradients, excessive shadows, or flashy animations.

\---

\# 3\. Color System

\#\# Primary

Blue 600  
\#2563EB

Hover  
\#1D4ED8

Pressed  
\#1E40AF

Light Background  
\#DBEAFE

\---

\#\# Secondary

Indigo  
\#4F46E5

\---

\#\# Accent

Emerald  
\#10B981

\---

\#\# Neutral Scale

White  
\#FFFFFF

Slate 50  
\#F8FAFC

Slate 100  
\#F1F5F9

Slate 200  
\#E2E8F0

Slate 300  
\#CBD5E1

Slate 500  
\#64748B

Slate 700  
\#334155

Slate 900  
\#0F172A

\---

\#\# Semantic Colors

Success  
\#22C55E

Warning  
\#F59E0B

Error  
\#EF4444

Info  
\#0EA5E9

\---

\# 4\. Dark Theme

Background  
\#020617

Surface  
\#0F172A

Card  
\#1E293B

Border  
\#334155

Primary Text  
\#F8FAFC

Secondary Text  
\#CBD5E1

\---

\# 5\. Typography

Primary Font:  
Inter

Fallback:  
system-ui, sans-serif

\#\# Heading Scale

Display  
60px / 700

H1  
48px / 700

H2  
36px / 700

H3  
30px / 600

H4  
24px / 600

H5  
20px / 600

H6  
18px / 600

\#\# Body

Large  
18px

Default  
16px

Small  
14px

Caption  
12px

Line height:  
150%

Letter spacing:  
Normal

\---

\# 6\. Grid & Layout

Maximum Content Width:  
1440px

Content Container:  
max-w-7xl mx-auto

Desktop Padding:  
40px

Tablet:  
24px

Mobile:  
16px

Section Spacing:  
80px

Card Gap:  
24px

Component Gap:  
16px

\---

\# 7\. Responsive Breakpoints

sm 640px

md 768px

lg 1024px

xl 1280px

2xl 1536px

Mobile-first implementation only.

\---

\# 8\. Border Radius

Small  
8px

Medium  
12px

Large  
16px

Card  
20px

Button  
9999px

Modal  
24px

\---

\# 9\. Elevation

Level 1

0 1px 2px rgba(0,0,0,0.05)

Level 2

0 8px 20px rgba(0,0,0,0.08)

Level 3

0 12px 30px rgba(0,0,0,0.12)

Use subtle shadows only.

\---

\# 10\. Navigation

\#\# Public Navbar

\- Sticky  
\- 72px height  
\- Logo left  
\- Navigation centered  
\- CTA right  
\- Transparent on load  
\- Solid background on scroll

\#\# Lead Sidebar

\- Fixed left  
\- 280px width  
\- Dark background  
\- Rounded corners  
\- Floating appearance

\#\# Admin Sidebar

\- Glassmorphism  
\- Semi-transparent  
\- Backdrop blur  
\- Gradient active item  
\- Collapsible

\---

\# 11\. Buttons

\#\# Primary

\- Blue background  
\- White text  
\- Rounded-full  
\- Height 48px

Hover:  
Slight darkening

\#\# Secondary

\- White  
\- Blue border  
\- Blue text

\#\# Ghost

Transparent

\#\# Success

Green

\#\# Danger

Red

Icons optional.

\---

\# 12\. Forms

Inputs:  
\- Height 52px  
\- Rounded-xl  
\- White background  
\- 1px border  
\- Blue focus ring

Textarea:  
Minimum 120px

Checkboxes:  
Rounded

Multi-select:  
Searchable chips

Validation:  
Inline below field

Required fields:  
Marked with \*

\---

\# 13\. Cards

Background:  
White

Radius:  
20px

Border:  
1px solid Slate 200

Shadow:  
Level 2

Padding:  
24px

Hover:  
Slight elevation increase

\---

\# 14\. Tables

\- Sticky header  
\- Zebra optional  
\- Row hover highlight  
\- Rounded container  
\- Searchable  
\- Sortable  
\- Paginated  
\- Mobile-friendly card fallback

Status badges:  
\- Approved → Green  
\- Under Process → Amber  
\- Rejected/Lost → Red  
\- Finalised → Emerald

\---

\# 15\. Modals

Radius:  
24px

Overlay:  
Dark blur

Width:  
Responsive

Close button:  
Top-right

Footer:  
Sticky action buttons

\---

\# 16\. File Upload Areas

\- Drag-and-drop enabled  
\- Dashed border  
\- Upload icon  
\- Progress indicator  
\- Accepted file chips  
\- Error state messaging

\---

\# 17\. Dashboard Widgets

Metric Cards:  
\- Icon  
\- Label  
\- Primary value  
\- Trend indicator

Charts:  
\- Minimal styling  
\- No unnecessary decoration

Quick actions:  
\- Rounded cards  
\- Hover animation

\---

\# 18\. Icons

Library:  
Lucide React

Style:  
Outline

Size:  
20px / 24px

Consistent stroke width.

\---

\# 19\. Motion

Animation duration:  
150–250ms

Allowed:  
\- Fade  
\- Slide-up  
\- Scale  
\- Skeleton loading

Avoid:  
\- Bounce  
\- Flashing  
\- Excessive movement

Respect reduced-motion preferences.

\---

\# 20\. Empty States

Include:  
\- Illustration  
\- Headline  
\- Supporting text  
\- Primary CTA

Examples:  
\- No opportunities  
\- No vendors  
\- No notifications  
\- No search results

\---

\# 21\. Loading States

Use skeleton loaders.

Show progress indicators for:  
\- Tables  
\- Cards  
\- Dashboards  
\- File uploads

Avoid blocking spinners where possible.

\---

\# 22\. Notifications

Toast placement:  
Top-right

Types:  
\- Success  
\- Error  
\- Warning  
\- Info

Auto-dismiss after 4 seconds.

\---

\# 23\. Accessibility

\- WCAG 2.1 AA compliant  
\- Keyboard navigable  
\- Visible focus rings  
\- Semantic HTML  
\- ARIA labels  
\- Contrast ratio ≥ 4.5:1  
\- Screen reader friendly

\---

\# 24\. Microinteractions

Buttons:  
Subtle scale (1.02x)

Cards:  
Slight lift on hover

Sidebar:  
Animated active indicator

Tables:  
Smooth row highlight

Forms:  
Animated validation feedback

\---

\# 25\. Legal Pages

Use Tailwind Typography (\`prose\`) with:  
\- Maximum width: 768px  
\- Comfortable line length  
\- Sticky table of contents (desktop)  
\- Large section headings  
\- Responsive spacing

\---

\# 26\. Overall Experience

Every screen should:  
\- Load quickly  
\- Feel spacious and uncluttered  
\- Use consistent spacing and typography  
\- Prioritize readability  
\- Maintain visual consistency across Lead and Admin portals  
\- Provide smooth transitions and polished microinteractions without compromising performance  
