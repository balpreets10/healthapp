// Data loading script for importing CSV food data into Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
config();

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Please set your Supabase URL and Service Role Key in your .env file:');
    console.error('   VITE_SUPABASE_URL=your-supabase-url');
    console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    console.error('\n💡 Add these to your .env file in the project root directory');
    process.exit(1);
}

// Create Supabase client with service role key (for data loading)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function loadFoodData() {
    try {
        console.log('🚀 Starting food data import...');

        // Read and parse CSV file
        const csvFilePath = path.join(__dirname, 'food_data.csv');
        
        if (!fs.existsSync(csvFilePath)) {
            throw new Error(`CSV file not found at: ${csvFilePath}`);
        }

        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        const records = [];

        // Parse CSV
        return new Promise((resolve, reject) => {
            parse(csvData, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            }, async (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    console.log(`📊 Parsed ${data.length} food items from CSV`);

                    // Transform CSV data to match database schema
                    const foodItems = data.map(row => ({
                        name: row['Dish Name'],
                        calories_per_100g: parseFloat(row['Calories (kcal)']) || 0,
                        carbohydrates_g: parseFloat(row['Carbohydrates (g)']) || 0,
                        protein_g: parseFloat(row['Protein (g)']) || 0,
                        fats_g: parseFloat(row['Fats (g)']) || 0,
                        free_sugar_g: parseFloat(row['Free Sugar (g)']) || 0,
                        fiber_g: parseFloat(row['Fibre (g)']) || 0,
                        sodium_mg: parseFloat(row['Sodium (mg)']) || 0,
                        calcium_mg: parseFloat(row['Calcium (mg)']) || 0,
                        iron_mg: parseFloat(row['Iron (mg)']) || 0,
                        vitamin_c_mg: parseFloat(row['Vitamin C (mg)']) || 0,
                        folate_mcg: parseFloat(row['Folate (µg)']) || 0
                    }));

                    // Check if foods table exists
                    console.log('🔍 Checking if foods table exists...');
                    const { data: tableCheck, error: tableError } = await supabase
                        .from('foods')
                        .select('id')
                        .limit(1);

                    if (tableError && tableError.code === '42P01') {
                        console.log('❌ Foods table does not exist. Please run the SQL schema first:');
                        console.log('   Execute the contents of foods-table.sql in your Supabase SQL editor');
                        process.exit(1);
                    }

                    // Clear existing data (optional - remove this if you want to keep existing data)
                    console.log('🧹 Clearing existing food data...');
                    const { error: deleteError } = await supabase
                        .from('foods')
                        .delete()
                        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

                    if (deleteError) {
                        console.warn('⚠️  Warning: Could not clear existing data:', deleteError.message);
                    }

                    // Insert food data in batches
                    const batchSize = 100;
                    let insertedCount = 0;

                    for (let i = 0; i < foodItems.length; i += batchSize) {
                        const batch = foodItems.slice(i, i + batchSize);
                        
                        console.log(`📥 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(foodItems.length / batchSize)} (${batch.length} items)...`);
                        
                        const { data, error } = await supabase
                            .from('foods')
                            .insert(batch)
                            .select('id');

                        if (error) {
                            console.error('❌ Batch insert error:', error);
                            throw error;
                        }

                        insertedCount += data.length;
                        console.log(`✅ Inserted ${data.length} items (Total: ${insertedCount}/${foodItems.length})`);
                    }

                    console.log(`🎉 Successfully imported ${insertedCount} food items!`);
                    
                    // Verify the data
                    const { data: verifyData, error: verifyError } = await supabase
                        .from('foods')
                        .select('id, name')
                        .limit(5);

                    if (!verifyError && verifyData) {
                        console.log('🔍 Sample data verification:');
                        verifyData.forEach((item, index) => {
                            console.log(`   ${index + 1}. ${item.name} (ID: ${item.id.substring(0, 8)}...)`);
                        });
                    }

                    resolve(insertedCount);

                } catch (error) {
                    reject(error);
                }
            });
        });

    } catch (error) {
        console.error('❌ Error loading food data:', error);
        throw error;
    }
}

// Run the import
loadFoodData()
    .then((count) => {
        console.log(`\n✅ Food data import completed successfully!`);
        console.log(`📊 Total items imported: ${count}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Food data import failed:', error);
        process.exit(1);
    });