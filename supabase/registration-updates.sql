-- Add new columns to registrations table
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS guest_dob date,
ADD COLUMN IF NOT EXISTS guest_gender text,
ADD COLUMN IF NOT EXISTS guest_state text,
ADD COLUMN IF NOT EXISTS guest_district text,
ADD COLUMN IF NOT EXISTS guest_fide_id text;

-- Update events table default entry fee
ALTER TABLE public.events 
ALTER COLUMN entry_fee SET DEFAULT 900;

-- Update existing upcoming events to 900
UPDATE public.events 
SET entry_fee = 900 
WHERE status = 'upcoming';
