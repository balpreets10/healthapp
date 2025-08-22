-- Insert orientation data
INSERT INTO orientations (value, label, description, applicable_for) VALUES
    ('energy_focused', 'Energy Focussed', 'Prioritizes maintaining high energy levels throughout the day', 'weight_loss'),
    ('muscle_preservation', 'Muscle Preservation', 'Focuses on maintaining muscle mass while losing weight', 'weight_loss'),
    ('lean_muscle_building', 'Lean Muscle Building', 'Aims to build lean muscle while gaining weight', 'weight_gain'),
    ('energetic_bulking', 'Energetic Bulking', 'Focuses on weight gain while maintaining energy and vitality', 'weight_gain')
ON CONFLICT (value) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    applicable_for = EXCLUDED.applicable_for,
    updated_at = NOW();