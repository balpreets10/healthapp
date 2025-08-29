-- DATABASE RESET QUERY  
-- This query safely removes any functions that may have been created by the accidental query.sql execution
-- Run this in your Supabase SQL editor to clean up any partial changes

-- ===== SAFELY REMOVE ANY ACCIDENTALLY CREATED RPC FUNCTIONS =====
-- Using IF EXISTS to avoid errors if functions don't exist

-- Drop any RPC functions that may have been created by query.sql
DROP FUNCTION IF EXISTS public.ensure_user_profile(uuid);
DROP FUNCTION IF EXISTS public.check_profile_completion(uuid); 
DROP FUNCTION IF EXISTS public.complete_user_profile(uuid, jsonb);
DROP FUNCTION IF EXISTS public.handle_user_login(uuid);
DROP FUNCTION IF EXISTS public.get_users_without_profiles();

-- ===== CLEAN UP ANY TABLES THAT MAY HAVE BEEN CREATED =====
-- The original query references a 'profiles' table that doesn't exist in your schema
-- Remove it if it was accidentally created

DROP TABLE IF EXISTS public.profiles;

-- ===== VERIFICATION QUERY =====
-- Run this after the reset to verify functions are removed:
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name IN (
--     'ensure_user_profile', 
--     'check_profile_completion', 
--     'complete_user_profile', 
--     'handle_user_login',
--     'get_users_without_profiles'
-- );
-- This should return no rows if the reset was successful

-- ===== NOTE =====
-- Your original database schema and policies remain intact:
-- - Tables: custom_meal_rate_limits, custom_meals, foods, health_journal_entries, meals, orientations, user_profiles, user_roles
-- - All Row Level Security (RLS) policies are preserved
-- - No data has been affected, only the accidentally added functions have been removed