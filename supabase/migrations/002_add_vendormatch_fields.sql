-- Migration: 002_add_vendormatch_fields.sql

ALTER TABLE public.opportunities 
ADD COLUMN category text,
ADD COLUMN recommended_size text,
ADD COLUMN min_years_exp integer,
ADD COLUMN financial_strength text,
ADD COLUMN core_expertise text[],
ADD COLUMN tech_know_how text[],
ADD COLUMN red_flags text[],
ADD COLUMN questions_for_vendor text[],
ADD COLUMN summary text,
ADD COLUMN applications_count integer DEFAULT 0;
