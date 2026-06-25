-- Migration: 004_new_opportunity_fields.sql

ALTER TABLE public.opportunities 
ADD COLUMN industry_type text,
ADD COLUMN authority_name text,
ADD COLUMN state_location_name text,
ADD COLUMN key_work_components text[],
ADD COLUMN eligibility_criteria text[],
ADD COLUMN emd_required boolean DEFAULT false,
ADD COLUMN emd_amount numeric,
ADD COLUMN royalty_required boolean DEFAULT false,
ADD COLUMN won_rate_status text,
ADD COLUMN won_rate_percentage numeric,
ADD COLUMN additional_input text,
ADD COLUMN key_actions text[];
