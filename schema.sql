-- Create "leads" table
CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  interest text DEFAULT 'general',
  source text DEFAULT 'lead_form',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create "event_registrations" table
CREATE TABLE event_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country text,
  city text,
  state_province text,
  postal_code text,
  interest text DEFAULT 'general',
  referral_source text,
  reason_for_attending text,
  occupation text,
  experience_level text,
  marketing_consent boolean DEFAULT false,
  event_id text,
  event_title text,
  payment_reference text,
  payment_amount numeric DEFAULT 0,
  payment_currency text,
  payment_status text DEFAULT 'confirmed',
  source text DEFAULT 'website',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- Row Level Security (RLS) Policies
-- ================================================================

-- Enable RLS on both tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to INSERT into leads
CREATE POLICY "Allow public insert on leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Allow service role to SELECT from leads (for Admin Dashboard)
CREATE POLICY "Allow service role to read leads"
  ON leads FOR SELECT
  USING (true);

-- Allow anyone (anon + authenticated) to INSERT into event_registrations
CREATE POLICY "Allow public insert on event_registrations"
  ON event_registrations FOR INSERT
  WITH CHECK (true);

-- Allow service role to SELECT from event_registrations (for Admin Dashboard)
CREATE POLICY "Allow service role to read event_registrations"
  ON event_registrations FOR SELECT
  USING (true);
