\# Vendly Accessibility Guidelines

Version: 1.0  
Status: Mandatory  
Compliance Target: WCAG 2.1 Level AA

\---

\# 1\. Purpose

This document defines the accessibility standards that every page,  
component, interaction, and feature within Vendly must follow.

Accessibility is a first-class requirement and must never be treated as  
an optional enhancement.

\---

\# 2\. Goals

Vendly should be usable by people with:

\- Visual impairments  
\- Hearing impairments  
\- Motor disabilities  
\- Cognitive disabilities  
\- Temporary impairments  
\- Users relying on assistive technologies

\---

\# 3\. Compliance Standard

Minimum requirement:

\- WCAG 2.1 Level AA

Future target:

\- WCAG 2.2 where applicable

\---

\# 4\. Semantic HTML

Always prefer semantic elements.

Use:

\<header\>  
\<nav\>  
\<main\>  
\<section\>  
\<article\>  
\<footer\>

instead of generic \<div\> elements whenever appropriate.

\---

\# 5\. Keyboard Navigation

Every interactive element must be reachable using only a keyboard.

Users should be able to:

\- Tab forward  
\- Shift+Tab backward  
\- Activate with Enter  
\- Activate buttons with Space  
\- Close dialogs with Escape

No mouse should be required.

\---

\# 6\. Focus Management

Visible focus indicators are mandatory.

Do not remove browser focus outlines unless replacing them with an  
equivalent or better indicator.

After closing a modal, return focus to the triggering element.

\---

\# 7\. Focus Order

Tab order must follow the visual order of the interface.

Avoid unexpected jumps.

Hidden elements should not receive focus.

\---

\# 8\. Skip Navigation

Public pages should include a "Skip to Main Content" link.

Example:

Skip to main content

The link should become visible when focused.

\---

\# 9\. Color Contrast

Minimum ratios:

Normal text:  
4.5 : 1

Large text:  
3 : 1

Icons conveying meaning should also meet contrast expectations.

Never rely on color alone to communicate status.

\---

\# 10\. Typography

Minimum body text:

16px

Line height:

1.5

Avoid extremely long line lengths.

Maintain sufficient spacing between paragraphs.

\---

\# 11\. Images

Every informative image must include meaningful alt text.

Decorative images should use:

alt=""

Do not repeat adjacent text.

\---

\# 12\. Icons

Icons that trigger actions must have accessible labels.

Example:

aria-label="Download Documents"

Do not rely solely on visual appearance.

\---

\# 13\. Buttons

Buttons should have descriptive labels.

Good:

"Apply for Opportunity"

Bad:

"Click Here"

Buttons must indicate disabled state programmatically.

\---

\# 14\. Links

Link text should describe destination.

Good:

"Read Privacy Policy"

Bad:

"Read More"

\---

\# 15\. Forms

Every field requires:

\- Label  
\- Accessible name  
\- Validation message  
\- Required indication

Never rely solely on placeholder text.

\---

\# 16\. Validation Errors

Errors should:

\- Appear near the field  
\- Be announced to assistive technologies  
\- Explain how to resolve the issue

Example:

"Email address is required."

\---

\# 17\. Required Fields

Indicate both visually and programmatically.

Example:

Company Name \*

Also expose:

aria-required="true"

\---

\# 18\. Modals

Dialogs must:

\- Trap keyboard focus  
\- Restore focus when closed  
\- Close with Escape  
\- Be announced properly

Include:

role="dialog"

and appropriate labels.

\---

\# 19\. Drawers

Mobile drawers should:

\- Trap focus  
\- Support Escape  
\- Prevent background interaction  
\- Restore focus when dismissed

\---

\# 20\. Notifications

Toast notifications should not disappear too quickly.

Critical messages should remain available for review.

Announcements should use appropriate ARIA live regions.

\---

\# 21\. Tables

Data tables should include:

\- Column headers  
\- Row associations  
\- Captions where appropriate

Avoid inaccessible layouts.

\---

\# 22\. Charts

Charts must provide text alternatives summarizing key insights.

Do not rely solely on color differences.

\---

\# 23\. File Upload

Users must be informed about:

\- Accepted formats  
\- Maximum size  
\- Upload progress  
\- Errors

Provide keyboard-accessible controls.

\---

\# 24\. Drag & Drop

Every drag-and-drop interaction must have an equivalent clickable  
alternative.

No functionality should depend exclusively on drag operations.

\---

\# 25\. Loading States

Avoid inaccessible infinite spinners.

Provide:

\- Skeleton loaders  
\- Progress indicators  
\- Status announcements where appropriate

\---

\# 26\. Animations

Respect user preference:

prefers-reduced-motion

Disable non-essential animations when requested.

Avoid flashing or rapid movement.

\---

\# 27\. Time Limits

If a session expires:

\- Warn users in advance where feasible  
\- Allow sufficient time to respond  
\- Preserve unsaved work whenever possible

\---

\# 28\. Error Pages

404, 403, and 500 pages should include:

\- Clear explanation  
\- Recovery guidance  
\- Navigation back to safety

Do not present technical jargon.

\---

\# 29\. Screen Reader Support

Important dynamic updates should use:

\- aria-live="polite"  
\- aria-live="assertive" (only when necessary)

Ensure hidden decorative content is ignored.

\---

\# 30\. Landmarks

Pages should expose landmarks including:

\- banner  
\- navigation  
\- main  
\- complementary  
\- contentinfo

to improve navigation for assistive technologies.

\---

\# 31\. Responsive Accessibility

All features must remain usable at:

\- Mobile  
\- Tablet  
\- Desktop  
\- Zoom up to 200%

Horizontal scrolling should be minimized.

\---

\# 32\. Touch Targets

Minimum recommended touch target:

44 × 44 CSS pixels

Spacing should prevent accidental activation.

\---

\# 33\. Status Indicators

Do not communicate status using color alone.

Combine color with:

\- Text  
\- Icons  
\- Badges  
\- Labels

Example:

✔ Approved

✖ Rejected

\---

\# 34\. Language

Set the document language correctly.

Example:

\<html lang="en"\>

If future multilingual support is added, update language attributes  
accordingly.

\---

\# 35\. Accessibility Testing

Test using:

\- Keyboard-only navigation  
\- Screen readers (NVDA, VoiceOver)  
\- Browser zoom  
\- Lighthouse  
\- axe DevTools

Accessibility regressions should block release.

\---

\# 36\. AI Coding Rules

Generated code must:

\- Include semantic HTML  
\- Include labels for form controls  
\- Support keyboard navigation  
\- Preserve focus visibility  
\- Use accessible component patterns  
\- Avoid inaccessible custom widgets

\---

\# 37\. Accessibility Definition of Done

A feature is complete only if it:

\- Passes keyboard navigation  
\- Supports screen readers  
\- Meets WCAG 2.1 AA contrast requirements  
\- Has descriptive labels and alt text  
\- Handles errors accessibly  
\- Supports reduced motion preferences  
\- Works at 200% zoom  
\- Maintains logical focus order  
\- Uses semantic HTML  
