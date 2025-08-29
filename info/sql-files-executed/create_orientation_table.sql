-- Create orientation lookup table
CREATE TABLE IF NOT EXISTS orientations (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    applicable_for VARCHAR(20) NOT NULL CHECK (applicable_for IN ('weight_loss', 'weight_gain', 'both')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orientations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read orientations (public data)
CREATE POLICY "Allow public read access to orientations" 
ON orientations FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orientations_applicable_for ON orientations(applicable_for);