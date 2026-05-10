-- Farmers table
create table if not exists farmers (
  id uuid default gen_random_uuid() 
    primary key,
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

-- Loan applications
create table if not exists loan_applications (
  id uuid default gen_random_uuid() 
    primary key,
  created_at timestamptz default now(),
  application_id text unique,
  farmer_id uuid references farmers(id),
  full_name text,
  phone text,
  kisan_id text,
  crop_name text,
  crop_quantity decimal,
  crop_unit text,
  crop_value_estimate decimal,
  loan_amount decimal,
  loan_purpose text,
  repayment_date date,
  stored_location text,
  status text default 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  disbursed_at timestamptz,
  review_notes text,
  reviewed_at timestamptz
);

-- Surplus listings
create table if not exists surplus_listings (
  id uuid default gen_random_uuid() 
    primary key,
  created_at timestamptz default now(),
  listing_id text unique,
  farmer_id uuid references farmers(id),
  full_name text,
  phone text,
  location text,
  district text,
  state text,
  crop_name text,
  quantity decimal,
  quantity_unit text,
  condition text,
  expected_price decimal,
  description text,
  photo_url text,
  status text default 'active',
  matched_buyer text,
  final_price decimal,
  sold_at timestamptz
);

-- Buyer inquiries
create table if not exists buyer_inquiries (
  id uuid default gen_random_uuid() 
    primary key,
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

-- Waitlist
create table if not exists waitlist (
  id uuid default gen_random_uuid() 
    primary key,
  created_at timestamptz default now(),
  full_name text,
  phone text,
  email text,
  user_type text,
  state text,
  source text
);

-- WhatsApp conversations log
create table if not exists whatsapp_logs (
  id uuid default gen_random_uuid() 
    primary key,
  created_at timestamptz default now(),
  phone text,
  direction text,
  message text,
  template_name text,
  status text
);

-- Enable RLS
alter table farmers enable row level security;
alter table loan_applications enable row level security;
alter table surplus_listings enable row level security;
alter table buyer_inquiries enable row level security;
alter table waitlist enable row level security;
alter table whatsapp_logs enable row level security;

-- Policies
create policy "Allow anon insert" on farmers for insert to anon with check (true);
create policy "Allow anon insert" on loan_applications for insert to anon with check (true);
create policy "Allow anon insert" on surplus_listings for insert to anon with check (true);
create policy "Allow anon insert" on buyer_inquiries for insert to anon with check (true);
create policy "Allow anon insert" on waitlist for insert to anon with check (true);
create policy "Allow anon insert" on whatsapp_logs for insert to anon with check (true);

create policy "Allow anon select" on farmers for select to anon using (true);
create policy "Allow anon select" on surplus_listings for select to anon using (true);

