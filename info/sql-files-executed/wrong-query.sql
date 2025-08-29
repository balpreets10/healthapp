-- ===== SUPABASE RPC FUNCTIONS FOR USER PROFILE MANAGEMENT =====
-- Deploy this file to fix the 404 error with ensure_user_profile RPC function
-- Run this SQL in the Supabase SQL editor to create all necessary RPC functions

-- ===== 1. ENSURE USER PROFILE FUNCTION =====
-- Main function to create/update profile for users during login
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id uuid)
RETURNS JSONB AS $$
DECLARE
    auth_user RECORD;
    existing_profile RECORD;
    profile_data JSONB;
    user_provider TEXT;
    result JSONB;
BEGIN
    -- Get the auth user data
    SELECT * INTO auth_user FROM auth.users WHERE id = user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found in auth.users'
        );
    END IF;

    -- Check if profile already exists
    SELECT * INTO existing_profile FROM public.profiles WHERE id = user_id;
    
    -- Extract metadata
    profile_data := COALESCE(auth_user.raw_user_meta_data, '{}'::jsonb);
    user_provider := COALESCE(auth_user.app_metadata->>'provider', 'email');
    
    IF existing_profile IS NULL THEN
        -- Create new profile
        INSERT INTO public.profiles (
            id, 
            email, 
            full_name,
            avatar_url,
            provider,
            provider_id,
            oauth_metadata,
            is_verified,
            profile_completed,
            profile_completion_date,
            last_login_at,
            login_count
        ) VALUES (
            user_id,
            auth_user.email,
            COALESCE(
                profile_data->>'full_name',
                profile_data->>'name',
                split_part(auth_user.email, '@', 1)
            ),
            profile_data->>'avatar_url',
            user_provider,
            profile_data->>'sub',
            profile_data,
            COALESCE(auth_user.email_confirmed_at IS NOT NULL, FALSE),
            CASE 
                WHEN user_provider = 'google' THEN TRUE
                ELSE FALSE
            END,
            CASE 
                WHEN user_provider = 'google' THEN NOW()
                ELSE NULL
            END,
            NOW(),
            1
        );
        
        result := jsonb_build_object(
            'success', true,
            'action', 'created',
            'profile_completed', user_provider = 'google'
        );
    ELSE
        -- Update existing profile with missing OAuth data if available
        UPDATE public.profiles SET
            oauth_metadata = CASE 
                WHEN oauth_metadata = '{}'::jsonb OR oauth_metadata IS NULL 
                THEN profile_data 
                ELSE oauth_metadata 
            END,
            avatar_url = CASE 
                WHEN avatar_url IS NULL AND profile_data->>'avatar_url' IS NOT NULL 
                THEN profile_data->>'avatar_url' 
                ELSE avatar_url 
            END,
            full_name = CASE 
                WHEN full_name IS NULL AND (
                    profile_data->>'full_name' IS NOT NULL OR 
                    profile_data->>'name' IS NOT NULL
                ) 
                THEN COALESCE(profile_data->>'full_name', profile_data->>'name')
                ELSE full_name 
            END,
            provider = CASE 
                WHEN provider IS NULL 
                THEN user_provider 
                ELSE provider 
            END,
            provider_id = CASE 
                WHEN provider_id IS NULL AND profile_data->>'sub' IS NOT NULL 
                THEN profile_data->>'sub' 
                ELSE provider_id 
            END,
            last_login_at = NOW(),
            login_count = login_count + 1,
            updated_at = NOW()
        WHERE id = user_id;
        
        result := jsonb_build_object(
            'success', true,
            'action', 'updated',
            'profile_completed', existing_profile.profile_completed
        );
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql security definer;

-- ===== 2. CHECK PROFILE COMPLETION FUNCTION =====
-- Function to check if user profile needs completion
CREATE OR REPLACE FUNCTION public.check_profile_completion(user_id uuid)
RETURNS JSONB AS $$
DECLARE
    profile RECORD;
    completion_status JSONB;
BEGIN
    SELECT * INTO profile FROM public.profiles WHERE id = user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'exists', false,
            'completed', false,
            'needs_creation', true
        );
    END IF;
    
    -- Calculate completion based on available data
    completion_status := jsonb_build_object(
        'exists', true,
        'completed', profile.profile_completed,
        'needs_creation', false,
        'has_full_name', profile.full_name IS NOT NULL,
        'has_avatar', profile.avatar_url IS NOT NULL,
        'is_verified', profile.is_verified,
        'provider', profile.provider,
        'last_login', profile.last_login_at,
        'login_count', profile.login_count
    );
    
    RETURN completion_status;
END;
$$ LANGUAGE plpgsql security definer;

-- ===== 3. COMPLETE USER PROFILE FUNCTION =====
-- Function to mark profile as completed with additional data
CREATE OR REPLACE FUNCTION public.complete_user_profile(
    user_id uuid,
    additional_data JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
BEGIN
    UPDATE public.profiles SET
        profile_completed = true,
        profile_completion_date = NOW(),
        full_name = COALESCE(additional_data->>'full_name', full_name),
        bio = COALESCE(additional_data->>'bio', bio),
        company = COALESCE(additional_data->>'company', company),
        website = COALESCE(additional_data->>'website', website),
        phone = COALESCE(additional_data->>'phone', phone),
        location = COALESCE(additional_data->>'location', location),
        preferences = CASE 
            WHEN additional_data ? 'preferences' 
            THEN additional_data->'preferences'
            ELSE preferences 
        END,
        updated_at = NOW()
    WHERE id = user_id;
    
    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Profile completed successfully'
        );
    ELSE
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Profile not found'
        );
    END IF;
END;
$$ LANGUAGE plpgsql security definer;

-- ===== 4. HANDLE USER LOGIN FUNCTION =====
-- Function to handle user login and profile management
CREATE OR REPLACE FUNCTION public.handle_user_login(user_id uuid)
RETURNS JSONB AS $$
BEGIN
    -- Ensure profile exists and is updated
    RETURN public.ensure_user_profile(user_id);
END;
$$ LANGUAGE plpgsql security definer;

-- ===== 5. GET USERS WITHOUT PROFILES FUNCTION =====
-- Helper function for migration - finds auth users without profiles
CREATE OR REPLACE FUNCTION public.get_users_without_profiles()
RETURNS UUID[] AS $$
DECLARE
    result UUID[];
BEGIN
    SELECT ARRAY(
        SELECT au.id 
        FROM auth.users au 
        LEFT JOIN public.profiles p ON au.id = p.id 
        WHERE p.id IS NULL
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql security definer;

-- ===== GRANTS & PERMISSIONS =====
-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_profile_completion(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_user_profile(uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_user_login(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_users_without_profiles() TO authenticated;

-- Grant execute permissions to service_role for admin operations
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_profile_completion(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_user_profile(uuid, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_user_login(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_users_without_profiles() TO service_role;

-- ===== VERIFICATION QUERIES =====
-- Run these queries after deployment to verify functions are created:
/*
-- 1. Check if functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'ensure_user_profile', 
    'check_profile_completion', 
    'complete_user_profile', 
    'handle_user_login',
    'get_users_without_profiles'
);

-- 2. Test ensure_user_profile function (replace with actual user ID)
-- SELECT public.ensure_user_profile('your-user-id-here');
*/