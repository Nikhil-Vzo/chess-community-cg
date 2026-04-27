-- ==============================================================================
-- Add guest_age column to registrations
-- ==============================================================================
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS guest_age integer;
