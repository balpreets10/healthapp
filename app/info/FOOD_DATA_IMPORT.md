# Food Data Import Instructions

This guide explains how to import your CSV food data into the Supabase database.

## Prerequisites

1. **Supabase Project Setup**: Ensure you have a Supabase project with the required environment variables set
2. **CSV File**: Your `food_data.csv` file should be in the root directory
3. **Node.js**: Make sure Node.js is installed

## Files Created

- `foods-table.sql` - Database schema for the foods table
- `load-food-data.js` - Data import script
- `food_data.csv` - Your source CSV file

## Step 1: Create the Foods Table

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `foods-table.sql`
4. Execute the SQL to create the table and security policies

## Step 2: Set Environment Variables

You need to set your Supabase service role key for data loading:

```bash
# Add this to your .env file
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**To find your service role key:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the "service_role" key (NOT the anon public key)
3. ⚠️ **Keep this key secure - it has admin access to your database**

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Import

```bash
npm run load-food-data
```

## What the Import Does

1. **Reads** your `food_data.csv` file
2. **Parses** the CSV and maps columns to database fields:
   - `Dish Name` → `name`
   - `Calories (kcal)` → `calories_per_100g`
   - `Carbohydrates (g)` → `carbohydrates_g`
   - `Protein (g)` → `protein_g`
   - `Fats (g)` → `fats_g`
   - `Free Sugar (g)` → `free_sugar_g`
   - `Fibre (g)` → `fiber_g`
   - `Sodium (mg)` → `sodium_mg`
   - `Calcium (mg)` → `calcium_mg`
   - `Iron (mg)` → `iron_mg`
   - `Vitamin C (mg)` → `vitamin_c_mg`
   - `Folate (µg)` → `folate_mcg`

3. **Clears** existing food data (optional - modify script if you want to keep existing data)
4. **Inserts** new data in batches of 100 items
5. **Verifies** the import was successful

## Security Features

- **Row Level Security (RLS)** enabled on foods table
- **Authenticated users only** can read food data
- **Service role access** required for data management
- **Automatic timestamps** for created_at and updated_at

## Troubleshooting

### Table doesn't exist
```
❌ Foods table does not exist. Please run the SQL schema first
```
**Solution**: Execute `foods-table.sql` in Supabase SQL Editor

### Missing environment variables
```
❌ Please set your Supabase URL and Service Role Key
```
**Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file

### CSV file not found
```
❌ CSV file not found at: /path/to/food_data.csv
```
**Solution**: Ensure `food_data.csv` is in the root directory

### Permission errors
```
❌ Batch insert error: insufficient_privilege
```
**Solution**: Verify you're using the service_role key, not the anon key

## After Import

Once imported successfully, you can:
1. View data in Supabase Dashboard → Table Editor → foods
2. Query data in your application using the SupabaseService
3. Use the foods data in your meal tracking features

## Sample Query

```javascript
// Get all foods
const { data: foods, error } = await supabase
  .from('foods')
  .select('*')
  .order('name');

// Search foods by name
const { data: searchResults, error } = await supabase
  .from('foods')
  .select('*')
  .ilike('name', '%rice%');
```