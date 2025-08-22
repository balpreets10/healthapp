-- Migration to add missing fields to user_profiles table
-- This adds the fields needed for the Profile page functionality

-- Add target_weight_kg field
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS target_weight_kg NUMERIC;

-- Add target_duration field  
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS target_duration INTEGER;

-- Add target_duration_unit field
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS target_duration_unit TEXT DEFAULT 'weeks';

-- Add orientation field
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS orientation TEXT;

-- Add age field
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER;

-- Add gender field
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add check constraints for data validation
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_target_weight_positive') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_target_weight_positive 
        CHECK (target_weight_kg IS NULL OR target_weight_kg > 0);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_target_duration_positive') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_target_duration_positive 
        CHECK (target_duration IS NULL OR target_duration > 0);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_target_duration_unit_valid') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_target_duration_unit_valid 
        CHECK (target_duration_unit IN ('days', 'weeks', 'months'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_age_valid') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_age_valid 
        CHECK (age IS NULL OR (age >= 1 AND age <= 120));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_gender_valid') THEN
        ALTER TABLE user_profiles ADD CONSTRAINT check_gender_valid 
        CHECK (gender IS NULL OR gender IN ('male', 'female', 'other'));
    END IF;
END $$;

-- Comment explaining the migration
COMMENT ON COLUMN user_profiles.target_weight_kg IS 'User target weight in kilograms';
COMMENT ON COLUMN user_profiles.target_duration IS 'Duration to reach target weight';
COMMENT ON COLUMN user_profiles.target_duration_unit IS 'Unit for target duration: days, weeks, or months';
COMMENT ON COLUMN user_profiles.orientation IS 'User fitness orientation/goal type';
COMMENT ON COLUMN user_profiles.age IS 'User age in years';
COMMENT ON COLUMN user_profiles.gender IS 'User gender: male, female, or other';