-- Create foods table for storing nutritional data
CREATE TABLE IF NOT EXISTS foods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    calories_per_100g numeric NOT NULL DEFAULT 0,
    carbohydrates_g numeric NOT NULL DEFAULT 0,
    protein_g numeric NOT NULL DEFAULT 0,
    fats_g numeric NOT NULL DEFAULT 0,
    free_sugar_g numeric NOT NULL DEFAULT 0,
    fiber_g numeric NOT NULL DEFAULT 0,
    sodium_mg numeric NOT NULL DEFAULT 0,
    calcium_mg numeric NOT NULL DEFAULT 0,
    iron_mg numeric NOT NULL DEFAULT 0,
    vitamin_c_mg numeric NOT NULL DEFAULT 0,
    folate_mcg numeric NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security) policies for logged-in users only
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read foods
CREATE POLICY "Allow authenticated users to read foods" ON foods
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy to allow only service_role to insert/update/delete foods (for data loading)
CREATE POLICY "Allow service_role to manage foods" ON foods
    FOR ALL USING (auth.role() = 'service_role');

-- Create index for faster name searches
CREATE INDEX IF NOT EXISTS foods_name_idx ON foods(name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON foods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();