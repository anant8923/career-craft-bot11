-- Drop the legacy users table that has RLS disabled
-- This table is obsolete as the application uses Supabase Auth (auth.users) 
-- with the profiles table for user management
DROP TABLE IF EXISTS public.users;