-- Create custom_meals table with rate limiting
-- This table stores user-submitted custom meals for approval by admins

-- Create custom_meals table
CREATE TABLE IF NOT EXISTS custom_meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Food nutritional data (similar to foods table)
    name TEXT NOT NULL,
    calories_per_100g NUMERIC(8,2) NOT NULL CHECK (calories_per_100g >= 0),
    carbohydrates_g NUMERIC(8,2) DEFAULT 0 CHECK (carbohydrates_g >= 0),
    protein_g NUMERIC(8,2) DEFAULT 0 CHECK (protein_g >= 0),
    fats_g NUMERIC(8,2) DEFAULT 0 CHECK (fats_g >= 0),
    free_sugar_g NUMERIC(8,2) DEFAULT 0 CHECK (free_sugar_g >= 0),
    fiber_g NUMERIC(8,2) DEFAULT 0 CHECK (fiber_g >= 0),
    sodium_mg NUMERIC(8,2) DEFAULT 0 CHECK (sodium_mg >= 0),
    calcium_mg NUMERIC(8,2) DEFAULT 0 CHECK (calcium_mg >= 0),
    iron_mg NUMERIC(8,2) DEFAULT 0 CHECK (iron_mg >= 0),
    vitamin_c_mg NUMERIC(8,2) DEFAULT 0 CHECK (vitamin_c_mg >= 0),
    folate_mcg NUMERIC(8,2) DEFAULT 0 CHECK (folate_mcg >= 0),
    
    -- Custom meal specific fields
    submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    admin_notes TEXT, -- Notes from admin during review
    denial_reason TEXT, -- Reason for denial if status is 'denied'
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rate limiting table for custom meal submissions
CREATE TABLE IF NOT EXISTS custom_meal_rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_submission TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_count INTEGER DEFAULT 1,
    
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_meals_submitted_by ON custom_meals(submitted_by);
CREATE INDEX IF NOT EXISTS idx_custom_meals_status ON custom_meals(status);
CREATE INDEX IF NOT EXISTS idx_custom_meals_created_at ON custom_meals(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_meals_name ON custom_meals(name);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_id ON custom_meal_rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_submission ON custom_meal_rate_limits(last_submission);

-- Enable Row Level Security
ALTER TABLE custom_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_meal_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_meals table

-- Users can read their own submitted meals and approved meals
CREATE POLICY "Users can view own submissions and approved meals" ON custom_meals
    FOR SELECT
    USING (
        submitted_by = auth.uid() OR 
        status = 'approved' OR
        EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Users can insert custom meals (with rate limiting handled by function)
CREATE POLICY "Users can submit custom meals" ON custom_meals
    FOR INSERT
    WITH CHECK (submitted_by = auth.uid());

-- Only admins can update custom meals (approve/deny)
CREATE POLICY "Only admins can update custom meals" ON custom_meals
    FOR UPDATE
    USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Only admins can delete custom meals
CREATE POLICY "Only admins can delete custom meals" ON custom_meals
    FOR DELETE
    USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- RLS Policies for rate_limits table

-- Users can only see their own rate limit records
CREATE POLICY "Users can view own rate limits" ON custom_meal_rate_limits
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can insert their own rate limit records
CREATE POLICY "Users can insert own rate limits" ON custom_meal_rate_limits
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own rate limit records
CREATE POLICY "Users can update own rate limits" ON custom_meal_rate_limits
    FOR UPDATE
    USING (user_id = auth.uid());

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_custom_meals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at column
CREATE TRIGGER update_custom_meals_updated_at_trigger
    BEFORE UPDATE ON custom_meals
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_meals_updated_at();

-- Function to check and enforce rate limiting (1 submission per 15 seconds)
CREATE OR REPLACE FUNCTION check_custom_meal_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    last_submission_time TIMESTAMP WITH TIME ZONE;
    time_diff INTERVAL;
BEGIN
    -- Check if user has any previous submissions
    SELECT last_submission INTO last_submission_time 
    FROM custom_meal_rate_limits 
    WHERE user_id = NEW.submitted_by;
    
    IF last_submission_time IS NOT NULL THEN
        -- Calculate time difference
        time_diff := NOW() - last_submission_time;
        
        -- If less than 15 seconds have passed, reject the submission
        IF time_diff < INTERVAL '15 seconds' THEN
            RAISE EXCEPTION 'Rate limit exceeded. Please wait % seconds before submitting another custom meal.', 
                EXTRACT(EPOCH FROM (INTERVAL '15 seconds' - time_diff))::INTEGER;
        END IF;
        
        -- Update the rate limit record
        UPDATE custom_meal_rate_limits 
        SET last_submission = NOW(), submission_count = submission_count + 1
        WHERE user_id = NEW.submitted_by;
    ELSE
        -- First submission for this user
        INSERT INTO custom_meal_rate_limits (user_id, last_submission, submission_count)
        VALUES (NEW.submitted_by, NOW(), 1);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce rate limiting before inserting custom meals
CREATE TRIGGER enforce_custom_meal_rate_limit
    BEFORE INSERT ON custom_meals
    FOR EACH ROW
    EXECUTE FUNCTION check_custom_meal_rate_limit();

-- Function to approve custom meal and add it to foods table
CREATE OR REPLACE FUNCTION approve_custom_meal(meal_id UUID)
RETURNS VOID AS $$
DECLARE
    meal_record custom_meals%ROWTYPE;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Only admins can approve custom meals';
    END IF;
    
    -- Get the meal record
    SELECT * INTO meal_record FROM custom_meals WHERE id = meal_id;
    
    IF meal_record.id IS NULL THEN
        RAISE EXCEPTION 'Custom meal not found';
    END IF;
    
    IF meal_record.status != 'pending' THEN
        RAISE EXCEPTION 'Custom meal is not in pending status';
    END IF;
    
    -- Insert into foods table
    INSERT INTO foods (
        name, calories_per_100g, carbohydrates_g, protein_g, fats_g,
        free_sugar_g, fiber_g, sodium_mg, calcium_mg, iron_mg,
        vitamin_c_mg, folate_mcg, created_at, updated_at
    ) VALUES (
        meal_record.name, meal_record.calories_per_100g, meal_record.carbohydrates_g,
        meal_record.protein_g, meal_record.fats_g, meal_record.free_sugar_g,
        meal_record.fiber_g, meal_record.sodium_mg, meal_record.calcium_mg,
        meal_record.iron_mg, meal_record.vitamin_c_mg, meal_record.folate_mcg,
        NOW(), NOW()
    );
    
    -- Update custom meal status to approved
    UPDATE custom_meals SET status = 'approved', updated_at = NOW() WHERE id = meal_id;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE custom_meals IS 'User-submitted custom meals pending admin approval';
COMMENT ON COLUMN custom_meals.status IS 'Status of the custom meal: pending, approved, or denied';
COMMENT ON COLUMN custom_meals.admin_notes IS 'Notes from admin during review process';
COMMENT ON COLUMN custom_meals.denial_reason IS 'Reason provided when a custom meal is denied';

COMMENT ON TABLE custom_meal_rate_limits IS 'Rate limiting table to prevent spam submissions';
COMMENT ON FUNCTION check_custom_meal_rate_limit() IS 'Enforces 15-second rate limit between custom meal submissions';
COMMENT ON FUNCTION approve_custom_meal(UUID) IS 'Admin function to approve custom meal and add to foods table';