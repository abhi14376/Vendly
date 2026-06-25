-- =====================================================
-- Migration: 005_tender_intelligence_engine.sql
-- Description: Create tables for Tender Intelligence Engine
-- =====================================================

-- 1. States table
create table if not exists public.tender_states (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    code text unique,
    created_at timestamptz default now()
);

-- 2. Categories table
create table if not exists public.tender_categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text unique,
    created_at timestamptz default now()
);

-- 3. Departments table
create table if not exists public.tender_departments (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    sector text not null, -- 'Roads & Infrastructure', 'Water & Sewerage', etc.
    created_at timestamptz default now()
);

-- 4. Tenders main table
create table if not exists public.tenders (
    id uuid primary key default gen_random_uuid(),
    tender_number text not null unique,
    title text not null,
    description text,
    department_id uuid references public.tender_departments(id) on delete set null,
    state_id uuid references public.tender_states(id) on delete set null,
    category_id uuid references public.tender_categories(id) on delete set null,
    estimated_value numeric(20,2),
    emd numeric(20,2),
    tender_fee numeric(15,2),
    performance_security text,
    bid_validity text,
    publish_date timestamptz,
    pre_bid_date timestamptz,
    submission_deadline timestamptz,
    opening_date timestamptz,
    authority text,
    location text,
    district text,
    status text not null default 'active', -- 'new', 'active', 'closing_soon', 'corrigendum', 'awarded'
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 5. Tender documents table
create table if not exists public.tender_documents (
    id uuid primary key default gen_random_uuid(),
    tender_id uuid references public.tenders(id) on delete cascade,
    file_name text not null,
    file_url text not null,
    mime_type text,
    file_size text,
    created_at timestamptz default now()
);

-- 6. Tender AI Summary table
create table if not exists public.tender_ai_summary (
    id uuid primary key default gen_random_uuid(),
    tender_id uuid references public.tenders(id) on delete cascade unique,
    nature_of_work text,
    scope text,
    project_category text,
    attractiveness_score integer check (attractiveness_score >= 0 and attractiveness_score <= 100),
    ease_of_qualification_score integer check (ease_of_qualification_score >= 0 and ease_of_qualification_score <= 100),
    competition_risk_score integer check (competition_risk_score >= 0 and competition_risk_score <= 100),
    executive_brief text,
    key_risks text[],
    recommended_vendor_type text,
    created_at timestamptz default now()
);

-- 7. Tender Eligibility table
create table if not exists public.tender_eligibility (
    id uuid primary key default gen_random_uuid(),
    tender_id uuid references public.tenders(id) on delete cascade unique,
    turnover_requirement numeric(20,2),
    net_worth_requirement numeric(20,2),
    similar_experience_years integer,
    similar_experience_description text,
    oem_requirements text,
    jv_allowed boolean default false,
    consortium_allowed boolean default false,
    eligibility_summary text,
    created_at timestamptz default now()
);

-- 8. Tender Alerts table
create table if not exists public.tender_alerts (
    id uuid primary key default gen_random_uuid(),
    tender_id uuid references public.tenders(id) on delete cascade,
    profile_id uuid references public.profiles(id) on delete cascade,
    alert_type text not null, -- '7_days_left', '3_days_left', '24_hours_left'
    is_read boolean default false,
    created_at timestamptz default now()
);

-- 9. Tender Matches table
create table if not exists public.tender_matches (
    id uuid primary key default gen_random_uuid(),
    tender_id uuid references public.tenders(id) on delete cascade,
    vendor_id uuid references public.profiles(id) on delete cascade,
    match_score integer check (match_score >= 0 and match_score <= 100),
    category_match boolean default false,
    state_match boolean default false,
    turnover_match boolean default false,
    experience_match boolean default false,
    created_at timestamptz default now(),
    unique(tender_id, vendor_id)
);

-- 10. Tender Awards table
create table if not exists public.tender_awards (
    id uuid primary key default gen_random_uuid(),
    tender_id uuid references public.tenders(id) on delete cascade unique,
    awarded_to text not null,
    award_value numeric(20,2),
    award_date date,
    created_at timestamptz default now()
);

-- 11. Tender Corrigendum table
create table if not exists public.tender_corrigendum (
    id uuid primary key default gen_random_uuid(),
    tender_id uuid references public.tenders(id) on delete cascade,
    title text not null,
    details text,
    publish_date timestamptz,
    document_url text,
    created_at timestamptz default now()
);

-- 12. Add capabilities to profiles table
alter table public.profiles
add column if not exists annual_turnover numeric(20,2),
add column if not exists net_worth numeric(20,2),
add column if not exists years_experience integer,
add column if not exists operating_states text[],
add column if not exists service_categories text[];

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

alter table public.tender_states enable row level security;
alter table public.tender_categories enable row level security;
alter table public.tender_departments enable row level security;
alter table public.tenders enable row level security;
alter table public.tender_documents enable row level security;
alter table public.tender_ai_summary enable row level security;
alter table public.tender_eligibility enable row level security;
alter table public.tender_alerts enable row level security;
alter table public.tender_matches enable row level security;
alter table public.tender_awards enable row level security;
alter table public.tender_corrigendum enable row level security;

-- Read policies: Authenticated users can view anything
create policy "Authenticated users can select tender_states" on public.tender_states for select using (true);
create policy "Authenticated users can select tender_categories" on public.tender_categories for select using (true);
create policy "Authenticated users can select tender_departments" on public.tender_departments for select using (true);
create policy "Authenticated users can select tenders" on public.tenders for select using (true);
create policy "Authenticated users can select tender_documents" on public.tender_documents for select using (true);
create policy "Authenticated users can select tender_ai_summary" on public.tender_ai_summary for select using (true);
create policy "Authenticated users can select tender_eligibility" on public.tender_eligibility for select using (true);
create policy "Authenticated users can select tender_alerts" on public.tender_alerts for select using (true);
create policy "Authenticated users can select tender_matches" on public.tender_matches for select using (true);
create policy "Authenticated users can select tender_awards" on public.tender_awards for select using (true);
create policy "Authenticated users can select tender_corrigendum" on public.tender_corrigendum for select using (true);

-- Write/Modify policies: Admins can modify everything
create policy "Admins can manage tender_states" on public.tender_states for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_categories" on public.tender_categories for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_departments" on public.tender_departments for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tenders" on public.tenders for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_documents" on public.tender_documents for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_ai_summary" on public.tender_ai_summary for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_eligibility" on public.tender_eligibility for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_alerts" on public.tender_alerts for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_matches" on public.tender_matches for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_awards" on public.tender_awards for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can manage tender_corrigendum" on public.tender_corrigendum for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- =====================================================
-- SEED DATA
-- =====================================================

-- Seed States
insert into public.tender_states (name, code) values
('Uttar Pradesh', 'UP'),
('Haryana', 'HR'),
('Madhya Pradesh', 'MP'),
('Rajasthan', 'RJ'),
('Jharkhand', 'JH'),
('Uttarakhand', 'UT'),
('Maharashtra', 'MH'),
('Goa', 'GA'),
('Bihar', 'BR')
on conflict (name) do nothing;

-- Seed Categories
insert into public.tender_categories (name, slug) values
('EPC', 'epc'),
('Civil Construction', 'civil-construction'),
('Roads & Highways', 'roads-highways'),
('Bridges', 'bridges'),
('Solar EPC', 'solar-epc'),
('Electrical Works', 'electrical-works'),
('Mechanical Works', 'mechanical-works'),
('Water Supply', 'water-supply'),
('Sewerage', 'sewerage'),
('STP', 'stp'),
('Mining', 'mining'),
('Coal Transportation', 'coal-transportation'),
('Railways', 'railways'),
('Metro', 'metro'),
('Buildings', 'buildings'),
('Consultancy', 'consultancy'),
('PMC', 'pmc'),
('Supply', 'supply'),
('Services', 'services'),
('O&M', 'o-m'),
('AMC', 'amc'),
('IT', 'it'),
('Data Center', 'data-center'),
('Telecom', 'telecom'),
('Airport Infrastructure', 'airport-infrastructure')
on conflict (name) do nothing;

-- Seed Departments
insert into public.tender_departments (name, sector) values
('PWD', 'Roads & Infrastructure'),
('NHAI', 'Roads & Infrastructure'),
('NHIDCL', 'Roads & Infrastructure'),
('State Road Development Corporation', 'Roads & Infrastructure'),
('Bridge Corporation', 'Roads & Infrastructure'),
('Rural Engineering Services', 'Roads & Infrastructure'),
('PHED', 'Water & Sewerage'),
('Jal Nigam', 'Water & Sewerage'),
('Water Resources Department', 'Water & Sewerage'),
('Irrigation Department', 'Water & Sewerage'),
('SECI', 'Solar & Renewable'),
('State Renewable Energy Agency', 'Solar & Renewable'),
('HAREDA', 'Solar & Renewable'),
('UPNEDA', 'Solar & Renewable'),
('MPUVN', 'Solar & Renewable'),
('RRECL', 'Solar & Renewable'),
('MEDA', 'Solar & Renewable'),
('BREDA', 'Solar & Renewable'),
('UREDA', 'Solar & Renewable'),
('JREDA', 'Solar & Renewable'),
('GEDA', 'Solar & Renewable'),
('CPWD', 'Buildings & Civil'),
('NBCC', 'Buildings & Civil'),
('HSVP', 'Buildings & Civil'),
('HSIIDC', 'Buildings & Civil'),
('Development Authorities', 'Buildings & Civil'),
('Smart City SPVs', 'Buildings & Civil'),
('RailTel', 'Rail & Metro'),
('RVNL', 'Rail & Metro'),
('DFCCIL', 'Rail & Metro'),
('Metro Rail Corporation', 'Rail & Metro'),
('Coal India', 'Coal & Mining'),
('WCL', 'Coal & Mining'),
('SECL', 'Coal & Mining'),
('CCL', 'Coal & Mining'),
('ECL', 'Coal & Mining'),
('SCCL', 'Coal & Mining'),
('State Mining Departments', 'Coal & Mining'),
('NTPC', 'Power & Electrical'),
('NHPC', 'Power & Electrical'),
('PGCIL', 'Power & Electrical'),
('State DISCOMs', 'Power & Electrical'),
('State Electricity Boards', 'Power & Electrical'),
('Industrial Development Authorities', 'Industrial Infrastructure'),
('Industrial Area Development Corporations', 'Industrial Infrastructure')
on conflict (name) do nothing;
