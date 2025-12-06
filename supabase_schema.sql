-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Ensure ai_analysis_results has the new status columns
alter table ai_analysis_results 
add column if not exists status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
add column if not exists rejection_reason text,

add column if not exists visual_summary text,
add column if not exists research_summary text,
add column if not exists meal_plan jsonb,
add column if not exists gorocky_recommendation jsonb;

-- Create Audit Logs table
create table if not exists audit_logs (
  id uuid default uuid_generate_v4() primary key,
  intake_id uuid references patient_intake(id) on delete cascade,
  action text not null check (action in ('approved', 'rejected', 'edited')),
  reviewer_name text not null,
  reviewer_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on audit_logs
alter table audit_logs enable row level security;

-- Policy for audit_logs (allow read/write for authenticated users for now)
create policy "Enable read access for all users" on audit_logs for select using (true);
create policy "Enable insert access for all users" on audit_logs for insert with check (true);

-- Create Patients view (optional, if you want a dedicated patients table, otherwise we use patient_intake)
-- For now, we assume patient_intake is the source of truth for patients.

-- Ensure patient_intake table exists (reference)
create table if not exists patient_intake (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  age integer not null,
  sex text not null,
  height_cm numeric,
  weight_kg numeric,
  bmi numeric,
  blood_pressure text,
  lifestyle jsonb,
  medical_history jsonb,
  medications jsonb,
  primary_complaint text,
  full_body_image text,
  intake_date timestamp with time zone default timezone('utc'::text, now()) not null
);
