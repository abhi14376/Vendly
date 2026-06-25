\# Vendly User Journeys

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines the end-to-end user journeys for all major actors  
within Vendly.

It should be used by Product, Design, Engineering, QA, and AI coding  
agents to understand navigation, interactions, expected outcomes,  
alternate paths, and failure scenarios.

\---

\# 2\. User Personas

\#\# Visitor

An unauthenticated user exploring Vendly for the first time.

Goals:  
\- Learn about the platform  
\- Register  
\- Log in

\---

\#\# Lead

A registered business looking for project opportunities and vendors.

Goals:  
\- Maintain profile  
\- Browse opportunities  
\- Apply for projects  
\- Track applications  
\- Communicate with Admin

\---

\#\# Vendor

A registered company providing services.

Goals:  
\- Complete verification  
\- Participate in projects  
\- Maintain business information

\---

\#\# Administrator

Platform operator responsible for governance.

Goals:  
\- Verify users  
\- Publish opportunities  
\- Manage disputes  
\- Respond to queries  
\- Configure the platform

\---

\# 3\. Journey: Visitor Registration

START

↓

Visit Home Page

↓

Read platform overview

↓

Click "Get Started"

↓

Signup Form

↓

Enter:  
\- Name  
\- Mobile  
\- Company  
\- Address  
\- Email  
\- Website (optional)  
\- Industries

↓

Submit

↓

Validation

If successful:  
→ Account Created

If failed:  
→ Show inline errors

↓

Confirmation Screen

↓

Redirect to Login

END

\---

\# 4\. Journey: Visitor Login

START

↓

Open Login Page

↓

Enter credentials

↓

Authentication

If valid:  
→ Dashboard

If invalid:  
→ Error message

↓

Optional:  
Forgot Password

↓

Reset Flow

END

\---

\# 5\. Journey: Lead Dashboard

START

↓

Login

↓

Dashboard

↓

View KPI cards

↓

Choose action:

├── Vendors  
├── Opportunities  
├── Applied Projects  
├── Notifications  
├── Queries  
└── Settings

END

\---

\# 6\. Journey: Browse Vendors

Dashboard

↓

Open Vendors

↓

View searchable table

↓

Apply filters:  
\- Industry  
\- Status  
\- Location

↓

Select Vendor

↓

View details

↓

Return to list

END

\---

\# 7\. Journey: Browse Opportunities

Dashboard

↓

Open Opportunities

↓

Load summary cards

↓

Browse opportunity table

↓

Filter by:  
\- Industry  
\- State  
\- Type

↓

Select Opportunity

↓

Open Details Modal

↓

Choose:

├── Download Documents  
├── Raise Query  
└── Apply

END

\---

\# 8\. Journey: Download Documents

Opportunity Modal

↓

Click Download

↓

System checks permissions

↓

Download:  
\- BOQ  
\- RFP  
\- Drawings  
\- Supporting files

↓

Return to modal

END

\---

\# 9\. Journey: Raise Query

Opportunity Modal

↓

Click Raise Query

↓

Open Query Form

↓

Choose predefined category

↓

Write message

↓

Submit

↓

Confirmation Toast

↓

Query appears in Query Center

↓

Admin reviews

↓

Lead receives response notification

END

\---

\# 10\. Journey: Apply for Opportunity

Opportunity Details

↓

Click Apply

↓

Validation:  
\- Logged in?  
\- Profile complete?

If incomplete:  
→ Redirect to Settings

If complete:

↓

Confirm submission

↓

Create application

↓

Display success message

↓

Application visible in Applied Projects

END

\---

\# 11\. Journey: Track Applied Projects

Dashboard

↓

Applied Projects

↓

View table

↓

Status:

\- Under Process  
\- Finalised  
\- Lost

If Lost:

↓

Display Admin Reason

↓

Return to list

END

\---

\# 12\. Journey: Update Profile

Settings

↓

Edit information

↓

Upload avatar (optional)

↓

Save

↓

Validate

↓

Persist changes

↓

Success notification

END

\---

\# 13\. Journey: Vendor Verification

Vendor registers

↓

Status:  
Under Process

↓

Admin reviews

↓

Decision

Approved  
→ Dashboard access

Rejected  
→ Reason displayed

↓

Vendor edits profile

↓

Resubmits

↓

Repeat review

END

\---

\# 14\. Journey: Lead Verification

Lead registers

↓

Pending Review

↓

Admin evaluates information

↓

Approve

OR

Reject

↓

Rejected leads see:  
\- Reason  
\- Edit button  
\- Resubmit action

END

\---

\# 15\. Journey: Admin Creates Opportunity

Admin Dashboard

↓

Open Opportunities

↓

Click Add Opportunity

↓

Choose Type

Tender?

YES

↓

Display:  
\- Submission Date  
\- PDF Upload

NO

↓

Display:  
\- Award Date  
\- Royalty %  
\- Tender Status  
\- Extended Uploads

↓

Fill form

↓

Publish

↓

Opportunity becomes visible

END

\---

\# 16\. Journey: Admin Reviews Query

Query Console

↓

Incoming ticket

↓

Read message

↓

Compose reply

↓

Submit

↓

Lead notified

↓

Conversation archived

END

\---

\# 17\. Journey: Admin Verifies Vendor

Verification Queue

↓

Open Vendor

↓

Review documents

↓

Risk Score displayed

↓

Choose:

Approve  
Reject  
Request More Info

↓

Notification sent

↓

Status updated

END

\---

\# 18\. Journey: Notification Flow

Trigger Event

↓

Generate Notification

↓

Store

↓

Display badge

↓

User opens Notification Center

↓

Mark as read

↓

Archive

END

\---

\# 19\. Journey: Forgot Password

Login

↓

Forgot Password

↓

Enter email/mobile

↓

Receive OTP or reset link

↓

Verify

↓

Set new password

↓

Login

END

\---

\# 20\. Journey: Session Expiration

Session timeout

↓

Protected action attempted

↓

Display session expired message

↓

Redirect to Login

↓

Authenticate again

↓

Return to dashboard

END

\---

\# 21\. Error Handling Journeys

\#\# Validation Failure

User submits invalid form

↓

Highlight invalid fields

↓

Display inline messages

↓

Remain on page

\---

\#\# Unauthorized Access

Restricted page requested

↓

Display 403

↓

Redirect appropriately

\---

\#\# Missing Resource

Unknown URL

↓

Display 404 page

↓

Offer navigation home

\---

\#\# Server Failure

API unavailable

↓

Display retry UI

↓

Allow refresh

\---

\# 22\. Loading States

Every asynchronous operation should display:

\- Skeleton loaders  
\- Progress indicators  
\- Disabled action buttons  
\- Optimistic UI where appropriate

Avoid blocking spinners whenever possible.

\---

\# 23\. Empty States

Provide dedicated UX for:

\- No vendors  
\- No opportunities  
\- No applications  
\- No notifications  
\- No queries

Each should include:  
\- Illustration  
\- Short explanation  
\- Primary CTA

\---

\# 24\. Accessibility Expectations

Every journey must support:

\- Keyboard navigation  
\- Screen readers  
\- Visible focus indicators  
\- Proper ARIA labels  
\- Sufficient contrast  
\- Responsive layouts

\---

\# 25\. Success Principles

A successful journey is one where:

\- The user always knows the next step.  
\- Errors are clearly explained.  
\- Recovery paths are available.  
\- Navigation is predictable.  
\- Primary actions are obvious.  
\- No critical workflow requires more than three major interactions after entering a module.  
