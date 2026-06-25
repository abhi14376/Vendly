\# Vendly API Contracts

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines the REST API contracts between the Vendly frontend  
and backend. It establishes consistent request/response formats, error  
handling, authentication, pagination, and resource naming.

\---

\# 2\. General Conventions

\#\# Base URL

/api/v1

Example:

/api/v1/auth/login

\---

\#\# Content Type

Request:  
application/json

Response:  
application/json

File uploads:  
multipart/form-data

\---

\#\# Authentication

Protected endpoints require:

Authorization: Bearer \<JWT\_TOKEN\>

\---

\#\# Standard Success Response

\`\`\`json  
{  
  "success": true,  
  "message": "Operation completed successfully.",  
  "data": {}  
}  
\`\`\`

\---

\#\# Standard Error Response

\`\`\`json  
{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "email",  
      "message": "Email is required."  
    }  
  \]  
}  
\`\`\`

\---

\# 3\. Authentication APIs

\#\# POST /auth/signup

Creates a new Lead or Vendor account.

\#\#\# Request

\`\`\`json  
{  
  "name": "John Doe",  
  "mobile": "9876543210",  
  "companyName": "ABC Infra",  
  "address": "New Delhi",  
  "email": "john@example.com",  
  "website": "https://abc.com",  
  "industries": \["Civil Construction", "Solar"\]  
}  
\`\`\`

\#\#\# Response

\`\`\`json  
{  
  "success": true,  
  "message": "Registration successful."  
}  
\`\`\`

\---

\#\# POST /auth/login

\#\#\# Request

\`\`\`json  
{  
  "email": "john@example.com",  
  "password": "\*\*\*\*\*\*\*\*"  
}  
\`\`\`

\#\#\# Response

\`\`\`json  
{  
  "success": true,  
  "data": {  
    "token": "jwt\_token",  
    "user": {}  
  }  
}  
\`\`\`

\---

\#\# POST /auth/logout

Invalidates the current session.

\---

\#\# POST /auth/forgot-password

Sends reset instructions.

\---

\#\# POST /auth/reset-password

Updates the password using a valid reset token or OTP.

\---

\# 4\. Profile APIs

\#\# GET /profile

Returns the authenticated user's profile.

\---

\#\# PATCH /profile

Updates editable profile fields.

Supported updates:  
\- Name  
\- Company  
\- Address  
\- Website  
\- Industries  
\- Avatar

\---

\# 5\. Vendor APIs

\#\# GET /vendors

Returns a paginated list of vendors.

\#\#\# Query Parameters

\- page  
\- limit  
\- search  
\- industry  
\- status

\---

\#\# GET /vendors/{vendorId}

Returns vendor details.

\---

\# 6\. Opportunity APIs

\#\# GET /opportunities

Returns paginated opportunities.

\#\#\# Filters

\- industry  
\- state  
\- projectType  
\- keyword

\---

\#\# GET /opportunities/{id}

Returns complete opportunity details.

\---

\#\# POST /opportunities

(Admin only)

Creates a new opportunity.

\---

\#\# PATCH /opportunities/{id}

(Admin only)

Updates an opportunity.

\---

\#\# DELETE /opportunities/{id}

(Admin only)

Archives or deletes an opportunity.

\---

\# 7\. Opportunity Documents

\#\# GET /opportunities/{id}/documents

Returns downloadable document metadata.

\---

\#\# GET /documents/{documentId}/download

Downloads the requested document.

\---

\# 8\. Applications APIs

\#\# POST /applications

Creates a project application.

\#\#\# Request

\`\`\`json  
{  
  "opportunityId": "opp\_123"  
}  
\`\`\`

\---

\#\# GET /applications

Returns current user's applications.

Supports filtering by:  
\- status  
\- date  
\- keyword

\---

\#\# GET /applications/{applicationId}

Returns application details.

\---

\#\# PATCH /applications/{applicationId}

(Admin only)

Updates application status.

Allowed values:

\- Submitted  
\- Under Process  
\- Finalised  
\- Lost

Optional:  
\- adminReason

\---

\# 9\. Query APIs

\#\# POST /queries

Creates a support query.

\#\#\# Request

\`\`\`json  
{  
  "subject": "Clarification Required",  
  "message": "Please explain the BOQ.",  
  "opportunityId": "opp\_123"  
}  
\`\`\`

\---

\#\# GET /queries

Returns query history.

\---

\#\# GET /queries/{id}

Returns full conversation.

\---

\#\# POST /queries/{id}/reply

(Admin only)

Adds an administrative reply.

\---

\# 10\. Notifications APIs

\#\# GET /notifications

Returns notifications.

Supports:  
\- pagination  
\- unread filter

\---

\#\# PATCH /notifications/{id}/read

Marks a notification as read.

\---

\#\# PATCH /notifications/read-all

Marks all notifications as read.

\---

\# 11\. Lead Verification APIs

\#\# GET /admin/leads/pending

Returns pending Lead verifications.

\---

\#\# PATCH /admin/leads/{id}/approve

Approves a Lead.

\---

\#\# PATCH /admin/leads/{id}/reject

Rejects a Lead.

Body:

\`\`\`json  
{  
  "reason": "Incomplete documentation."  
}  
\`\`\`

\---

\# 12\. Vendor Verification APIs

\#\# GET /admin/vendors/pending

Returns pending Vendor verifications.

\---

\#\# PATCH /admin/vendors/{id}/approve

Approves a Vendor.

\---

\#\# PATCH /admin/vendors/{id}/reject

Rejects a Vendor.

\---

\# 13\. Dashboard Metrics APIs

\#\# GET /admin/dashboard

Returns KPI metrics:

\- Total Leads  
\- Total Vendors  
\- Pending Verifications  
\- Live Opportunities  
\- Open Queries

\---

\# 14\. User Management APIs

\#\# GET /admin/users

Returns paginated users.

\---

\#\# POST /admin/users

Creates a new administrative user.

\---

\#\# PATCH /admin/users/{id}

Updates permissions or profile.

\---

\#\# DELETE /admin/users/{id}

Soft deletes or disables a user.

\---

\# 15\. Settings APIs

\#\# GET /admin/settings

Returns global platform settings.

\---

\#\# PATCH /admin/settings

Updates configuration values.

\---

\# 16\. Pagination Standard

Request:

?page=1\&limit=20

Response:

\`\`\`json  
{  
  "success": true,  
  "data": \[\],  
  "pagination": {  
    "page": 1,  
    "limit": 20,  
    "totalItems": 250,  
    "totalPages": 13  
  }  
}  
\`\`\`

\---

\# 17\. Sorting Standard

Query parameter:

sort=createdAt

Descending:

sort=-createdAt

\---

\# 18\. Search Standard

Use:

?search=solar

Server performs case-insensitive partial matching.

\---

\# 19\. HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

\---

\# 20\. Validation Rules

Email:  
RFC-compliant format

Mobile:  
Country-specific numeric validation

Required fields:  
Must not be empty

Uploads:  
Validated for type and size

\---

\# 21\. Security Requirements

\- JWT authentication  
\- HTTPS only  
\- CSRF protection where applicable  
\- Input sanitization  
\- Output encoding  
\- Role-based authorization

Sensitive data must never be returned unnecessarily.

\---

\# 22\. Idempotency

PATCH requests should be idempotent where practical.

Duplicate submissions should not create duplicate resources.

\---

\# 23\. Audit Metadata

Responses may include:

\- createdAt  
\- updatedAt  
\- createdBy  
\- updatedBy

Timestamps should use ISO 8601 UTC format.

\---

\# 24\. Versioning

All endpoints should be versioned.

Current:

/api/v1/

Future versions should not break existing clients.

\---

\# 25\. Frontend Integration Rules

\- Never hardcode URLs.  
\- Centralize API calls in service modules.  
\- Handle loading and error states consistently.  
\- Retry transient failures where appropriate.  
\- Display user-friendly error messages.  
\- Keep network logic out of presentation components.

\---

\# 26\. Future Endpoints

Reserved for:

\- Payments  
\- Commission management  
\- AI recommendations  
\- Analytics  
\- Reports  
\- Webhooks  
\- Real-time messaging  
\- Third-party integrations

These should follow the same conventions established in this document.  
