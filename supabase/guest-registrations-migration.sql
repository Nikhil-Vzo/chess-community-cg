-- ==============================================================================
-- 1. Add guest details columns to registrations
-- ==============================================================================
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS guest_email text,
ADD COLUMN IF NOT EXISTS guest_name text,
ADD COLUMN IF NOT EXISTS guest_phone text;

-- ==============================================================================
-- 2. Drop the restrictive INSERT policy and add a permissive one
-- ==============================================================================
DROP POLICY IF EXISTS "Users can register for events" ON public.registrations;

CREATE POLICY "Anyone can register for events" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- ==============================================================================
-- 3. Update the SELECT policy to allow users to view guest registrations matching their email
-- ==============================================================================
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.registrations;

CREATE POLICY "Users can view their own or matched email registrations" 
ON public.registrations 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  (auth.jwt() ->> 'email') = guest_email
);
