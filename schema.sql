-- Farm Registrations (Matches API /api/register-farm)
create table if not exists farm_registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  phone text not null,
  whatsapp text,
  email text,
  village text,
  district text,
  state text,
  land_size decimal,
  land_unit text,
  primary_crop text,
  secondary_crop text,
  land_ownership text,
  kisan_id text unique,
  status text default 'pending'
);

-- Farmers table (Legacy/Original, kept for compatibility)
create table if not exists farmers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  kisan_id text unique,
  full_name text not null,
  phone text not null unique,
  whatsapp text,
  email text,
  aadhaar_last4 text,
  village text,
  tehsil text,
  district text,
  state text,
  pincode text,
  land_size decimal,
  land_unit text default 'acres',
  land_ownership text,
  khasra_number text,
  primary_crop text,
  secondary_crop text,
  years_farming integer,
  farm_score integer default 0,
  farm_score_breakdown jsonb,
  land_verified boolean default false,
  satellite_data jsonb,
  soil_health_data jsonb,
  status text default 'pending',
  notes text,
  latitude decimal,
  longitude decimal
);

-- Loan Applications (Matches API /api/apply-loan)
create table if not exists loan_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  phone text not null,
  crop_name text,
  crop_quantity decimal,
  crop_quantity_unit text,
  stored_location text,
  loan_amount_requested decimal,
  repayment_date date,
  purpose text,
  status text default 'pending'
);

-- Insurance Applications (Matches API /api/apply-insurance)
create table if not exists insurance_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  phone text not null,
  village text,
  district text,
  state text,
  crop_name text,
  land_size decimal,
  plan_selected text,
  season text,
  status text default 'pending'
);

-- Surplus listings (Matches API /api/list-surplus)
create table if not exists surplus_listings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  phone text not null,
  location text,
  crop_name text,
  quantity decimal,
  quantity_unit text,
  condition text,
  expected_price decimal,
  description text,
  status text default 'active'
);

-- Buyer inquiries
create table if not exists buyer_inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  company_name text,
  contact_name text,
  phone text,
  email text,
  buyer_type text,
  crops_needed text,
  quantity_per_month decimal,
  location text,
  message text,
  status text default 'new'
);

-- Waitlist (Matches API /api/join-waitlist)
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  full_name text not null,
  phone text not null,
  email text,
  user_type text,
  state text,
  source text
);

-- WhatsApp conversations log
create table if not exists whatsapp_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  phone text,
  direction text,
  message text,
  template_name text,
  status text
);

-- WhatsApp Sessions
create table if not exists whatsapp_sessions (
  phone text primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  current_step text default 'PURPOSE',
  purpose text,
  eligible boolean,
  name text,
  location text
);

-- Enable RLS
alter table farm_registrations enable row level security;
alter table farmers enable row level security;
alter table loan_applications enable row level security;
alter table insurance_applications enable row level security;
alter table surplus_listings enable row level security;
alter table buyer_inquiries enable row level security;
alter table waitlist enable row level security;
alter table whatsapp_logs enable row level security;
alter table whatsapp_sessions enable row level security;

-- Policies (Allow insert/select for anon)
create policy "Allow anon insert" on farm_registrations for insert to anon with check (true);
create policy "Allow anon insert" on farmers for insert to anon with check (true);
create policy "Allow anon insert" on loan_applications for insert to anon with check (true);
create policy "Allow anon insert" on insurance_applications for insert to anon with check (true);
create policy "Allow anon insert" on surplus_listings for insert to anon with check (true);
create policy "Allow anon insert" on buyer_inquiries for insert to anon with check (true);
create policy "Allow anon insert" on waitlist for insert to anon with check (true);
create policy "Allow anon insert" on whatsapp_logs for insert to anon with check (true);
create policy "Allow anon insert" on whatsapp_sessions for insert to anon with check (true);

create policy "Allow anon select" on farm_registrations for select to anon using (true);
create policy "Allow anon select" on farmers for select to anon using (true);
create policy "Allow anon select" on loan_applications for select to anon using (true);
create policy "Allow anon select" on insurance_applications for select to anon using (true);
create policy "Allow anon select" on surplus_listings for select to anon using (true);
create policy "Allow anon select" on whatsapp_sessions for select to anon using (true);

create policy "Allow anon update" on whatsapp_sessions for update to anon using (true);
