\# Vendly Database Schema

Version: 1.0  
Status: Production Ready

\---

\# 1\. Purpose

This document defines the logical database schema for Vendly.

Objectives:  
\- Normalize core entities  
\- Support role-based access  
\- Enable scalable querying  
\- Maintain referential integrity  
\- Simplify reporting and analytics

\---

\# 2\. Core Entities

\- Users  
\- Roles  
\- Industries  
\- Opportunities  
\- Opportunity Documents  
\- Applications  
\- Queries  
\- Query Replies  
\- Notifications  
\- Audit Logs

\---

\# 3\. Entity Relationship Overview

User  
 ├── belongs to → Role  
 ├── belongs to many → Industries  
 ├── submits → Applications  
 ├── creates → Queries  
 └── receives → Notifications

Opportunity  
 ├── belongs to → Industry  
 ├── has many → Documents  
 ├── has many → Applications  
 └── has many → Queries

Query  
 └── has many → Query Replies

\---

\# 4\. Table: roles

Primary Key:  
\- id (UUID)

Columns:  
\- name  
\- description  
\- created\_at

Seed Values:  
\- super\_admin  
\- admin  
\- lead  
\- vendor

\---

\# 5\. Table: users

Primary Key:  
\- id (UUID)

Columns:  
\- role\_id  
\- full\_name  
\- company\_name  
\- email  
\- mobile  
\- website  
\- address  
\- avatar\_url  
\- password\_hash  
\- verification\_status  
\- is\_active  
\- created\_at  
\- updated\_at

Verification Status:  
\- approved  
\- pending  
\- rejected

Constraints:  
\- email UNIQUE  
\- mobile UNIQUE

\---

\# 6\. Table: industries

Primary Key:  
\- id

Columns:  
\- name  
\- slug

Examples:  
\- Civil Construction  
\- Solar  
\- Electrical  
\- Events  
\- Supply

\---

\# 7\. Table: user\_industries

Purpose:  
Many-to-many relationship.

Columns:  
\- user\_id  
\- industry\_id

Composite unique key:  
(user\_id, industry\_id)

\---

\# 8\. Table: opportunities

Primary Key:  
\- id (UUID)

Columns:  
\- title  
\- description  
\- industry\_id  
\- state  
\- project\_type  
\- amount  
\- submission\_deadline  
\- award\_date  
\- royalty\_percentage  
\- tender\_status  
\- status  
\- created\_by  
\- created\_at  
\- updated\_at

Project Types:  
\- tender  
\- back\_to\_back

Status:  
\- draft  
\- published  
\- archived

\---

\# 9\. Table: opportunity\_documents

Primary Key:  
\- id

Columns:  
\- opportunity\_id  
\- file\_name  
\- file\_type  
\- file\_url  
\- uploaded\_at

Supported Types:  
\- PDF  
\- DOCX  
\- XLSX  
\- CSV  
\- Images

\---

\# 10\. Table: applications

Primary Key:  
\- id

Columns:  
\- opportunity\_id  
\- user\_id  
\- status  
\- admin\_reason  
\- applied\_at  
\- updated\_at

Status Values:  
\- submitted  
\- under\_process  
\- finalised  
\- lost

One user may apply only once per opportunity.

Unique Constraint:  
(user\_id, opportunity\_id)

\---

\# 11\. Table: queries

Primary Key:  
\- id

Columns:  
\- opportunity\_id  
\- created\_by  
\- subject  
\- message  
\- status  
\- created\_at

Status:  
\- open  
\- in\_review  
\- answered  
\- closed

\---

\# 12\. Table: query\_replies

Primary Key:  
\- id

Columns:  
\- query\_id  
\- replied\_by  
\- message  
\- created\_at

Supports conversation history.

\---

\# 13\. Table: notifications

Primary Key:  
\- id

Columns:  
\- user\_id  
\- title  
\- body  
\- type  
\- is\_read  
\- created\_at

Types:  
\- verification  
\- application  
\- opportunity  
\- query  
\- system

\---

\# 14\. Table: audit\_logs

Primary Key:  
\- id

Columns:  
\- actor\_id  
\- entity\_type  
\- entity\_id  
\- action  
\- previous\_value  
\- new\_value  
\- created\_at

Purpose:  
Track sensitive administrative actions.

\---

\# 15\. Suggested Indexes

users(email)  
users(mobile)

opportunities(industry\_id)  
opportunities(project\_type)  
opportunities(status)

applications(user\_id)  
applications(opportunity\_id)

notifications(user\_id, is\_read)

queries(created\_by)

\---

\# 16\. Soft Deletes

Prefer soft deletes for:

\- users  
\- opportunities

Use:  
\- deleted\_at  
\- deleted\_by (optional)

Avoid permanent deletion of business records.

\---

\# 17\. Timestamps

Every major table should include:

\- created\_at  
\- updated\_at

Use UTC and ISO 8601\.

\---

\# 18\. Foreign Key Rules

users.role\_id  
→ roles.id

user\_industries.user\_id  
→ users.id

user\_industries.industry\_id  
→ industries.id

opportunities.industry\_id  
→ industries.id

applications.user\_id  
→ users.id

applications.opportunity\_id  
→ opportunities.id

queries.created\_by  
→ users.id

queries.opportunity\_id  
→ opportunities.id

notifications.user\_id  
→ users.id

\---

\# 19\. Future Tables

Reserved for:

\- payments  
\- commissions  
\- ai\_summaries  
\- reports  
\- saved\_filters  
\- activity\_feeds  
\- webhooks  
\- integrations

\---

\# 20\. Design Principles

\- UUID primary keys  
\- Normalize relationships  
\- Avoid duplicate data  
\- Enforce referential integrity  
\- Support horizontal scaling  
\- Optimize for read-heavy workloads  
