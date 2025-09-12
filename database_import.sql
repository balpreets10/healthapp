-- Database schema and import script for food nutrition data
-- This script creates a comprehensive food nutrition database

-- Create the main foods table
DROP TABLE IF EXISTS foods;
CREATE TABLE foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL UNIQUE,
    calories_per_100g DECIMAL(6,2) NOT NULL,
    protein_g DECIMAL(5,2) NOT NULL,
    carbs_g DECIMAL(5,2) NOT NULL,
    fat_g DECIMAL(5,2) NOT NULL,
    fiber_g DECIMAL(5,2) NOT NULL,
    sugar_g DECIMAL(5,2) NOT NULL,
    sodium_mg DECIMAL(7,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_food_name (food_name),
    INDEX idx_calories (calories_per_100g),
    INDEX idx_protein (protein_g),
    INDEX idx_carbs (carbs_g)
);

-- Create food categories table
DROP TABLE IF EXISTS food_categories;
CREATE TABLE food_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert basic food categories
INSERT INTO food_categories (category_name, description) VALUES
('Fruits', 'Fresh and dried fruits'),
('Vegetables', 'Fresh vegetables and greens'),
('Grains', 'Rice, wheat, oats, quinoa, and other grains'),
('Proteins', 'Meat, fish, poultry, eggs, and plant-based proteins'),
('Dairy', 'Milk, cheese, yogurt, and dairy products'),
('Nuts & Seeds', 'Tree nuts, peanuts, and seeds'),
('Legumes', 'Beans, lentils, peas, and legumes'),
('Oils & Fats', 'Cooking oils, butter, and fat sources'),
('Beverages', 'Drinks, juices, and liquid refreshments'),
('Processed Foods', 'Prepared and packaged foods'),
('Spices & Seasonings', 'Herbs, spices, and flavor enhancers'),
('Sweets & Desserts', 'Sugary treats and desserts');

-- Add category_id to foods table
ALTER TABLE foods ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES food_categories(id);

-- Create user meals tracking table
DROP TABLE IF EXISTS user_meals;
CREATE TABLE user_meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    serving_size_g DECIMAL(6,2) NOT NULL DEFAULT 100,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    meal_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (food_id) REFERENCES foods(id),
    INDEX idx_user_date (user_id, meal_date),
    INDEX idx_food_id (food_id)
);

-- Create nutritional goals table
DROP TABLE IF EXISTS user_nutrition_goals;
CREATE TABLE user_nutrition_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    daily_calories_goal DECIMAL(6,2),
    daily_protein_goal DECIMAL(5,2),
    daily_carbs_goal DECIMAL(5,2),
    daily_fat_goal DECIMAL(5,2),
    daily_fiber_goal DECIMAL(5,2),
    daily_sodium_limit DECIMAL(7,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create food search view for easy searching
CREATE OR REPLACE VIEW food_search AS
SELECT 
    f.id,
    f.food_name,
    f.calories_per_100g,
    f.protein_g,
    f.carbs_g,
    f.fat_g,
    f.fiber_g,
    f.sugar_g,
    f.sodium_mg,
    fc.category_name,
    -- Calculated nutrition per serving (100g)
    f.calories_per_100g as calories_per_serving,
    f.protein_g as protein_per_serving,
    f.carbs_g as carbs_per_serving,
    f.fat_g as fat_per_serving,
    f.fiber_g as fiber_per_serving,
    f.sugar_g as sugar_per_serving,
    f.sodium_mg as sodium_per_serving
FROM foods f
LEFT JOIN food_categories fc ON f.category_id = fc.id;

-- Create stored procedure for calculating nutrition for custom serving size
DELIMITER //
CREATE PROCEDURE GetNutritionForServing(
    IN food_id_param INT,
    IN serving_size_g_param DECIMAL(6,2)
)
BEGIN
    SELECT 
        food_name,
        serving_size_g_param as serving_size_g,
        ROUND((calories_per_100g * serving_size_g_param / 100), 2) as calories,
        ROUND((protein_g * serving_size_g_param / 100), 2) as protein_g,
        ROUND((carbs_g * serving_size_g_param / 100), 2) as carbs_g,
        ROUND((fat_g * serving_size_g_param / 100), 2) as fat_g,
        ROUND((fiber_g * serving_size_g_param / 100), 2) as fiber_g,
        ROUND((sugar_g * serving_size_g_param / 100), 2) as sugar_g,
        ROUND((sodium_mg * serving_size_g_param / 100), 2) as sodium_mg
    FROM foods 
    WHERE id = food_id_param;
END //
DELIMITER ;

-- Create stored procedure for daily nutrition summary
DELIMITER //
CREATE PROCEDURE GetDailyNutritionSummary(
    IN user_id_param INT,
    IN date_param DATE
)
BEGIN
    SELECT 
        date_param as meal_date,
        COUNT(*) as total_food_items,
        SUM(ROUND((f.calories_per_100g * um.serving_size_g / 100), 2)) as total_calories,
        SUM(ROUND((f.protein_g * um.serving_size_g / 100), 2)) as total_protein_g,
        SUM(ROUND((f.carbs_g * um.serving_size_g / 100), 2)) as total_carbs_g,
        SUM(ROUND((f.fat_g * um.serving_size_g / 100), 2)) as total_fat_g,
        SUM(ROUND((f.fiber_g * um.serving_size_g / 100), 2)) as total_fiber_g,
        SUM(ROUND((f.sugar_g * um.serving_size_g / 100), 2)) as total_sugar_g,
        SUM(ROUND((f.sodium_mg * um.serving_size_g / 100), 2)) as total_sodium_mg
    FROM user_meals um
    JOIN foods f ON um.food_id = f.id
    WHERE um.user_id = user_id_param 
    AND um.meal_date = date_param;
END //
DELIMITER ;

-- Import data from CSV (MySQL syntax)
-- Note: Adjust the file path according to your system
LOAD DATA LOCAL INFILE 'comprehensive_foods_nutrition.csv'
INTO TABLE foods
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(food_name, calories_per_100g, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg);

-- Update category assignments based on food names (basic categorization)
UPDATE foods SET category_id = 1 WHERE food_name LIKE '%apple%' OR food_name LIKE '%banana%' OR food_name LIKE '%orange%' OR food_name LIKE '%grape%' OR food_name LIKE '%berry%' OR food_name LIKE '%fruit%' OR food_name LIKE '%peach%' OR food_name LIKE '%pear%' OR food_name LIKE '%cherry%' OR food_name LIKE '%plum%' OR food_name LIKE '%apricot%' OR food_name LIKE '%mango%' OR food_name LIKE '%pineapple%' OR food_name LIKE '%kiwi%' OR food_name LIKE '%watermelon%' OR food_name LIKE '%cantaloupe%' OR food_name LIKE '%honeydew%' OR food_name LIKE '%grapefruit%' OR food_name LIKE '%lemon%' OR food_name LIKE '%lime%' OR food_name LIKE '%papaya%' OR food_name LIKE '%pomegranate%' OR food_name LIKE '%coconut%' OR food_name LIKE '%dates%' OR food_name LIKE '%figs%' OR food_name LIKE '%prunes%' OR food_name LIKE '%raisins%' OR food_name LIKE '%cranberries%';

UPDATE foods SET category_id = 2 WHERE food_name LIKE '%broccoli%' OR food_name LIKE '%spinach%' OR food_name LIKE '%carrot%' OR food_name LIKE '%tomato%' OR food_name LIKE '%cucumber%' OR food_name LIKE '%pepper%' OR food_name LIKE '%onion%' OR food_name LIKE '%garlic%' OR food_name LIKE '%potato%' OR food_name LIKE '%mushroom%' OR food_name LIKE '%zucchini%' OR food_name LIKE '%squash%' OR food_name LIKE '%eggplant%' OR food_name LIKE '%cauliflower%' OR food_name LIKE '%cabbage%' OR food_name LIKE '%kale%' OR food_name LIKE '%lettuce%' OR food_name LIKE '%celery%' OR food_name LIKE '%radish%' OR food_name LIKE '%beets%' OR food_name LIKE '%asparagus%' OR food_name LIKE '%artichoke%' OR food_name LIKE '%corn%' OR food_name LIKE '%peas%';

UPDATE foods SET category_id = 3 WHERE food_name LIKE '%rice%' OR food_name LIKE '%bread%' OR food_name LIKE '%oat%' OR food_name LIKE '%quinoa%' OR food_name LIKE '%bulgur%' OR food_name LIKE '%barley%' OR food_name LIKE '%millet%' OR food_name LIKE '%amaranth%' OR food_name LIKE '%buckwheat%' OR food_name LIKE '%pasta%' OR food_name LIKE '%noodles%' OR food_name LIKE '%bagel%' OR food_name LIKE '%croissant%' OR food_name LIKE '%muffin%' OR food_name LIKE '%pancake%' OR food_name LIKE '%waffle%' OR food_name LIKE '%granola%' OR food_name LIKE '%cereal%';

UPDATE foods SET category_id = 4 WHERE food_name LIKE '%chicken%' OR food_name LIKE '%turkey%' OR food_name LIKE '%beef%' OR food_name LIKE '%pork%' OR food_name LIKE '%ham%' OR food_name LIKE '%bacon%' OR food_name LIKE '%sausage%' OR food_name LIKE '%salmon%' OR food_name LIKE '%tuna%' OR food_name LIKE '%cod%' OR food_name LIKE '%fish%' OR food_name LIKE '%shrimp%' OR food_name LIKE '%crab%' OR food_name LIKE '%lobster%' OR food_name LIKE '%egg%' OR food_name LIKE '%tofu%' OR food_name LIKE '%tempeh%' OR food_name LIKE '%seitan%';

UPDATE foods SET category_id = 5 WHERE food_name LIKE '%milk%' OR food_name LIKE '%yogurt%' OR food_name LIKE '%cheese%' OR food_name LIKE '%butter%' OR food_name LIKE '%cream%';

UPDATE foods SET category_id = 6 WHERE food_name LIKE '%almond%' OR food_name LIKE '%walnut%' OR food_name LIKE '%cashew%' OR food_name LIKE '%peanut%' OR food_name LIKE '%pistachio%' OR food_name LIKE '%brazil%' OR food_name LIKE '%hazelnut%' OR food_name LIKE '%pecan%' OR food_name LIKE '%macadamia%' OR food_name LIKE '%pine%' OR food_name LIKE '%seed%';

UPDATE foods SET category_id = 7 WHERE food_name LIKE '%beans%' OR food_name LIKE '%lentils%' OR food_name LIKE '%chickpeas%' OR food_name LIKE '%soybeans%' OR food_name LIKE '%edamame%';

UPDATE foods SET category_id = 8 WHERE food_name LIKE '%oil%' OR food_name LIKE '%margarine%';

UPDATE foods SET category_id = 9 WHERE food_name LIKE '%juice%' OR food_name LIKE '%water%' OR food_name LIKE '%coffee%' OR food_name LIKE '%tea%' OR food_name LIKE '%soda%' OR food_name LIKE '%beer%' OR food_name LIKE '%wine%' OR food_name LIKE '%vodka%' OR food_name LIKE '%whiskey%' OR food_name LIKE '%drink%';

UPDATE foods SET category_id = 10 WHERE food_name LIKE '%pizza%' OR food_name LIKE '%hamburger%' OR food_name LIKE '%hot dog%' OR food_name LIKE '%fries%' OR food_name LIKE '%nuggets%' OR food_name LIKE '%taco%' OR food_name LIKE '%burrito%' OR food_name LIKE '%nachos%';

UPDATE foods SET category_id = 11 WHERE food_name LIKE '%pepper%' OR food_name LIKE '%paprika%' OR food_name LIKE '%cinnamon%' OR food_name LIKE '%turmeric%' OR food_name LIKE '%ginger%' OR food_name LIKE '%cumin%' OR food_name LIKE '%coriander%' OR food_name LIKE '%salt%' OR food_name LIKE '%vanilla%' OR food_name LIKE '%herb%' OR food_name LIKE '%spice%';

UPDATE foods SET category_id = 12 WHERE food_name LIKE '%ice cream%' OR food_name LIKE '%cookie%' OR food_name LIKE '%cake%' OR food_name LIKE '%pie%' OR food_name LIKE '%donut%' OR food_name LIKE '%brownie%' OR food_name LIKE '%chocolate%' OR food_name LIKE '%honey%' OR food_name LIKE '%syrup%' OR food_name LIKE '%sugar%';

-- Create indexes for better performance
CREATE INDEX idx_foods_category ON foods(category_id);
CREATE INDEX idx_foods_nutrition ON foods(calories_per_100g, protein_g, carbs_g, fat_g);

-- Insert some sample data for testing
INSERT INTO user_nutrition_goals (user_id, daily_calories_goal, daily_protein_goal, daily_carbs_goal, daily_fat_goal, daily_fiber_goal, daily_sodium_limit) 
VALUES (1, 2000, 150, 250, 70, 25, 2300);

-- Show database statistics
SELECT 'Total Foods' as metric, COUNT(*) as value FROM foods
UNION ALL
SELECT 'Total Categories', COUNT(*) FROM food_categories
UNION ALL
SELECT 'Foods with Categories', COUNT(*) FROM foods WHERE category_id IS NOT NULL;

-- Show sample of foods by category
SELECT 
    fc.category_name,
    COUNT(*) as food_count,
    GROUP_CONCAT(f.food_name ORDER BY f.food_name LIMIT 5) as sample_foods
FROM foods f
JOIN food_categories fc ON f.category_id = fc.id
GROUP BY fc.category_name
ORDER BY food_count DESC;