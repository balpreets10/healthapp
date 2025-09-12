# Comprehensive Food Nutrition Database

## Overview
This project provides a comprehensive food nutrition database with over 400+ common foods including fruits, vegetables, grains, proteins, dairy, nuts, seeds, and processed foods. The database includes detailed nutritional information per 100g serving.

## Files Included

1. **comprehensive_foods_nutrition.csv** - Main CSV file with 400+ foods and nutritional data
2. **common_foods_nutrition.csv** - Basic CSV file with essential common foods
3. **nutrition_scraper.py** - Python script for expanding the database with additional sources
4. **database_import.sql** - Complete MySQL database schema and import script
5. **FOOD_DATABASE_README.md** - This comprehensive guide

## Database Schema

### Main Tables

#### `foods` table
- `id` - Primary key
- `food_name` - Name of the food item
- `calories_per_100g` - Calories per 100g serving
- `protein_g` - Protein in grams per 100g
- `carbs_g` - Carbohydrates in grams per 100g
- `fat_g` - Fat in grams per 100g
- `fiber_g` - Fiber in grams per 100g
- `sugar_g` - Sugar in grams per 100g
- `sodium_mg` - Sodium in milligrams per 100g
- `category_id` - Foreign key to food categories
- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last updated

#### `food_categories` table
- `id` - Primary key
- `category_name` - Category name (Fruits, Vegetables, Grains, etc.)
- `description` - Category description

#### `user_meals` table
- `id` - Primary key
- `user_id` - User identifier
- `food_id` - Foreign key to foods table
- `serving_size_g` - Actual serving size in grams
- `meal_type` - breakfast, lunch, dinner, or snack
- `meal_date` - Date of the meal
- `created_at` - Timestamp when record was created

#### `user_nutrition_goals` table
- `id` - Primary key
- `user_id` - User identifier
- `daily_calories_goal` - Daily calorie goal
- `daily_protein_goal` - Daily protein goal in grams
- `daily_carbs_goal` - Daily carbohydrates goal in grams
- `daily_fat_goal` - Daily fat goal in grams
- `daily_fiber_goal` - Daily fiber goal in grams
- `daily_sodium_limit` - Daily sodium limit in milligrams

## Installation & Setup

### 1. Database Setup (MySQL/MariaDB)

```sql
-- Create database
CREATE DATABASE nutrition_db;
USE nutrition_db;

-- Run the import script
SOURCE database_import.sql;
```

### 2. CSV Import Alternative

If you prefer to import the CSV directly:

```sql
LOAD DATA LOCAL INFILE 'comprehensive_foods_nutrition.csv'
INTO TABLE foods
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(food_name, calories_per_100g, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg);
```

### 3. Python Dependencies (for scraper script)

```bash
pip install requests pandas beautifulsoup4
```

## API Integration Examples

### PHP Integration

```php
<?php
class NutritionAPI {
    private $pdo;
    
    public function __construct($host, $dbname, $username, $password) {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $this->pdo = new PDO($dsn, $username, $password);
    }
    
    // Search foods by name
    public function searchFoods($query, $limit = 20) {
        $stmt = $this->pdo->prepare(
            "SELECT * FROM food_search 
             WHERE food_name LIKE ? 
             ORDER BY food_name 
             LIMIT ?"
        );
        $stmt->execute(["%$query%", $limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Get nutrition for specific serving size
    public function getNutritionForServing($foodId, $servingSize) {
        $stmt = $this->pdo->prepare("CALL GetNutritionForServing(?, ?)");
        $stmt->execute([$foodId, $servingSize]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Log user meal
    public function logMeal($userId, $foodId, $servingSize, $mealType) {
        $stmt = $this->pdo->prepare(
            "INSERT INTO user_meals (user_id, food_id, serving_size_g, meal_type, meal_date) 
             VALUES (?, ?, ?, ?, CURDATE())"
        );
        return $stmt->execute([$userId, $foodId, $servingSize, $mealType]);
    }
    
    // Get daily nutrition summary
    public function getDailyNutrition($userId, $date) {
        $stmt = $this->pdo->prepare("CALL GetDailyNutritionSummary(?, ?)");
        $stmt->execute([$userId, $date]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Get foods by category
    public function getFoodsByCategory($categoryId, $limit = 50) {
        $stmt = $this->pdo->prepare(
            "SELECT * FROM foods WHERE category_id = ? ORDER BY food_name LIMIT ?"
        );
        $stmt->execute([$categoryId, $limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

// Usage example
$api = new NutritionAPI('localhost', 'nutrition_db', 'username', 'password');

// Search for foods
$foods = $api->searchFoods('chicken');

// Get nutrition for 150g serving of chicken breast
$nutrition = $api->getNutritionForServing(1, 150);

// Log a meal
$api->logMeal(1, 1, 150, 'lunch');

// Get daily nutrition summary
$summary = $api->getDailyNutrition(1, '2025-01-15');
?>
```

### JavaScript/Node.js Integration

```javascript
const mysql = require('mysql2/promise');

class NutritionAPI {
    constructor(config) {
        this.pool = mysql.createPool(config);
    }
    
    // Search foods
    async searchFoods(query, limit = 20) {
        const [rows] = await this.pool.execute(
            'SELECT * FROM food_search WHERE food_name LIKE ? ORDER BY food_name LIMIT ?',
            [`%${query}%`, limit]
        );
        return rows;
    }
    
    // Calculate nutrition for serving size
    async calculateNutrition(foodId, servingSize) {
        const [rows] = await this.pool.execute(
            'CALL GetNutritionForServing(?, ?)',
            [foodId, servingSize]
        );
        return rows[0];
    }
    
    // Log meal
    async logMeal(userId, foodId, servingSize, mealType) {
        const [result] = await this.pool.execute(
            'INSERT INTO user_meals (user_id, food_id, serving_size_g, meal_type, meal_date) VALUES (?, ?, ?, ?, CURDATE())',
            [userId, foodId, servingSize, mealType]
        );
        return result.insertId;
    }
    
    // Get daily summary
    async getDailySummary(userId, date) {
        const [rows] = await this.pool.execute(
            'CALL GetDailyNutritionSummary(?, ?)',
            [userId, date]
        );
        return rows[0];
    }
}

// Usage
const api = new NutritionAPI({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'nutrition_db'
});

// Example usage
(async () => {
    const foods = await api.searchFoods('apple');
    console.log(foods);
    
    const nutrition = await api.calculateNutrition(1, 200);
    console.log(nutrition);
})();
```

### REST API Endpoints (PHP Example)

```php
// api/foods/search.php
<?php
header('Content-Type: application/json');
require_once 'NutritionAPI.php';

$api = new NutritionAPI($host, $dbname, $username, $password);
$query = $_GET['q'] ?? '';
$limit = min($_GET['limit'] ?? 20, 100);

$foods = $api->searchFoods($query, $limit);
echo json_encode(['success' => true, 'data' => $foods]);
?>

// api/nutrition/calculate.php
<?php
header('Content-Type: application/json');
require_once 'NutritionAPI.php';

$input = json_decode(file_get_contents('php://input'), true);
$foodId = $input['food_id'] ?? 0;
$servingSize = $input['serving_size'] ?? 100;

$api = new NutritionAPI($host, $dbname, $username, $password);
$nutrition = $api->getNutritionForServing($foodId, $servingSize);

echo json_encode(['success' => true, 'data' => $nutrition]);
?>

// api/meals/log.php
<?php
header('Content-Type: application/json');
require_once 'NutritionAPI.php';

$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['user_id'] ?? 0;
$foodId = $input['food_id'] ?? 0;
$servingSize = $input['serving_size'] ?? 100;
$mealType = $input['meal_type'] ?? 'snack';

$api = new NutritionAPI($host, $dbname, $username, $password);
$result = $api->logMeal($userId, $foodId, $servingSize, $mealType);

echo json_encode(['success' => $result, 'message' => $result ? 'Meal logged' : 'Error logging meal']);
?>
```

## Common SQL Queries

### Search foods by name
```sql
SELECT * FROM foods WHERE food_name LIKE '%chicken%' ORDER BY food_name;
```

### Get high-protein foods
```sql
SELECT food_name, protein_g, calories_per_100g 
FROM foods 
WHERE protein_g > 20 
ORDER BY protein_g DESC;
```

### Get low-calorie foods
```sql
SELECT food_name, calories_per_100g, fiber_g 
FROM foods 
WHERE calories_per_100g < 50 
ORDER BY calories_per_100g ASC;
```

### Calculate nutrition for custom serving
```sql
SELECT 
    food_name,
    150 as serving_size_g,
    ROUND((calories_per_100g * 150 / 100), 2) as calories,
    ROUND((protein_g * 150 / 100), 2) as protein_g,
    ROUND((carbs_g * 150 / 100), 2) as carbs_g,
    ROUND((fat_g * 150 / 100), 2) as fat_g
FROM foods 
WHERE id = 1;
```

### Get foods by category
```sql
SELECT f.food_name, f.calories_per_100g, fc.category_name
FROM foods f
JOIN food_categories fc ON f.category_id = fc.id
WHERE fc.category_name = 'Fruits'
ORDER BY f.food_name;
```

## Data Sources & Accuracy

The nutritional data in this database is compiled from multiple reliable sources:

1. **USDA FoodData Central** - Primary source for accurate nutritional data
2. **FDA Nutrition Labels** - For branded and processed foods
3. **NCCDB (Nutrition Coordinating Center Database)** - Academic nutrition database
4. **International food composition databases** - For comprehensive coverage

### Data Validation

All nutritional values are validated against multiple sources and represent typical values per 100g serving. Values are rounded to appropriate decimal places for practical use.

## Extending the Database

### Adding New Foods

```python
# Using the nutrition_scraper.py script
from nutrition_scraper import NutritionScraper

scraper = NutritionScraper()

# Add custom foods
new_foods = [
    {
        'food_name': 'Custom Food',
        'calories_per_100g': 100,
        'protein_g': 5.0,
        'carbs_g': 20.0,
        'fat_g': 2.0,
        'fiber_g': 3.0,
        'sugar_g': 10.0,
        'sodium_mg': 50
    }
]

scraper.save_to_csv(new_foods, 'new_foods.csv')
```

### USDA API Integration

Get a free API key from: https://fdc.nal.usda.gov/api-key-signup/

```python
# Using USDA API to get fresh data
usda_key = "YOUR_API_KEY"
usda_data = scraper.scrape_usda_api(usda_key)
scraper.save_to_csv(usda_data, 'usda_foods.csv')
```

## Performance Tips

1. **Indexing**: The database includes proper indexes for common queries
2. **Caching**: Consider implementing caching for frequently accessed foods
3. **Batch Operations**: Use batch inserts for logging multiple meals
4. **Connection Pooling**: Use connection pooling for high-traffic applications

## License & Usage

This nutritional database is compiled from public domain sources and is provided for educational and commercial use. While we strive for accuracy, always verify critical nutritional information with official sources.

## Support & Updates

For questions, bug reports, or feature requests, please refer to the project documentation or create an issue in the project repository.

The database is regularly updated with new foods and improved nutritional accuracy based on the latest USDA releases.