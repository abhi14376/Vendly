-- =====================================================
-- Vendly - Initial PostgreSQL / Supabase Schema
-- Version: 1.0
-- =====================================================

-- Enable UUID generation
create extension if not exists pgcrypto;

-- =====================================================
-- ENUMS
-- =====================================================

create type public.user_role as enum (
  'super_admin',
  'admin',
  'lead',
  'vendor'
);

create type public.verification_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type public.project_type as enum (
  'tender',
  'back_to_back'
);

create type public.opportunity_status as enum (
  'draft',
  'published',
  'archived'
);

create type public.application_status as enum (
  'submitted',
  'under_process',
  'finalised',
  'lost'
);

create type public.query_status as enum (
  'open',
  'in_review',
  'answered',
  'closed'
);

-- =====================================================
-- PROFILES
-- =====================================================

create table public.profiles (

    id uuid primary key references auth.users(id) on delete cascade,

    role user_role not null default 'lead',

    full_name text not null,

    company_name text,

    mobile text unique,

    email text unique,

    website text,

    address text,

    avatar_url text,

    verification verification_status
        default 'pending',

    is_active boolean
        default true,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);

-- =====================================================
-- INDUSTRIES
-- =====================================================

create table public.industries (

    id uuid primary key default gen_random_uuid(),

    name text not null unique,

    slug text unique,

    created_at timestamptz default now()

);

-- =====================================================
-- PROFILE INDUSTRIES
-- =====================================================

create table public.profile_industries (

    id uuid primary key default gen_random_uuid(),

    profile_id uuid
        references public.profiles(id)
        on delete cascade,

    industry_id uuid
        references public.industries(id)
        on delete cascade,

    unique(profile_id, industry_id)

);

-- =====================================================
-- OPPORTUNITIES
-- =====================================================

create table public.opportunities (

    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text,

    industry_id uuid
        references public.industries(id),

    state text,

    project_type project_type not null,

    amount numeric(18,2),

    submission_deadline timestamptz,

    award_date date,

    royalty_percentage numeric(5,2),

    tender_status text,

    status opportunity_status
        default 'draft',

    created_by uuid
        references public.profiles(id),

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);

-- =====================================================
-- OPPORTUNITY DOCUMENTS
-- =====================================================

create table public.opportunity_documents (

    id uuid primary key default gen_random_uuid(),

    opportunity_id uuid
        references public.opportunities(id)
        on delete cascade,

    file_name text,

    file_url text,

    mime_type text,

    created_at timestamptz
        default now()

);

-- =====================================================
-- APPLICATIONS
-- =====================================================

create table public.applications (

    id uuid primary key default gen_random_uuid(),

    opportunity_id uuid
        references public.opportunities(id)
        on delete cascade,

    applicant_id uuid
        references public.profiles(id)
        on delete cascade,

    status application_status
        default 'submitted',

    admin_reason text,

    applied_at timestamptz
        default now(),

    updated_at timestamptz
        default now(),

    unique(opportunity_id, applicant_id)

);

-- =====================================================
-- QUERIES
-- =====================================================

create table public.queries (

    id uuid primary key default gen_random_uuid(),

    opportunity_id uuid
        references public.opportunities(id),

    created_by uuid
        references public.profiles(id),

    subject text,

    message text,

    status query_status
        default 'open',

    created_at timestamptz
        default now()

);

-- =====================================================
-- QUERY REPLIES
-- =====================================================

create table public.query_replies (

    id uuid primary key default gen_random_uuid(),

    query_id uuid
        references public.queries(id)
        on delete cascade,

    replied_by uuid
        references public.profiles(id),

    message text not null,

    created_at timestamptz
        default now()

);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

create table public.notifications (

    id uuid primary key default gen_random_uuid(),

    profile_id uuid
        references public.profiles(id)
        on delete cascade,

    title text not null,

    body text,

    type text,

    is_read boolean
        default false,

    created_at timestamptz
        default now()

);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

create table public.audit_logs (

    id uuid primary key default gen_random_uuid(),

    actor_id uuid
        references public.profiles(id),

    entity_type text,

    entity_id uuid,

    action text,

    previous_value jsonb,

    new_value jsonb,

    created_at timestamptz
        default now()

);

-- =====================================================
-- INDEXES
-- =====================================================

create index idx_profiles_role
on public.profiles(role);

create index idx_profiles_verification
on public.profiles(verification);

create index idx_opportunities_status
on public.opportunities(status);

create index idx_opportunities_industry
on public.opportunities(industry_id);

create index idx_applications_user
on public.applications(applicant_id);

create index idx_applications_opportunity
on public.applications(opportunity_id);

create index idx_notifications_profile
on public.notifications(profile_id);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger trg_opportunities_updated_at
before update on public.opportunities
for each row
execute function public.set_updated_at();

create trigger trg_applications_updated_at
before update on public.applications
for each row
execute function public.set_updated_at();

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.applications enable row level security;
alter table public.queries enable row level security;
alter table public.notifications enable row level security;

-- =====================================================
-- EXAMPLE RLS POLICIES
-- =====================================================

-- Profiles: users can view/update their own profile
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

-- Opportunities: published opportunities are publicly readable
create policy "Published opportunities readable"
on public.opportunities
for select
using (status = 'published');

-- Applications: users can read their own
create policy "Read own applications"
on public.applications
for select
using (auth.uid() = applicant_id);

create policy "Create own applications"
on public.applications
for insert
with check (auth.uid() = applicant_id);

-- Notifications: users can read their own
create policy "Read own notifications"
on public.notifications
for select
using (auth.uid() = profile_id);