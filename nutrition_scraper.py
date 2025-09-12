#!/usr/bin/env python3
"""
Comprehensive Nutrition Data Scraper
Scrapes nutritional information from multiple reliable sources
"""

import requests
import pandas as pd
import json
import time
import csv
from typing import Dict, List, Optional
import re
from urllib.parse import urljoin, quote

class NutritionScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.nutrition_data = []
        
    def scrape_usda_api(self, api_key: Optional[str] = None):
        """
        Scrape nutrition data from USDA FoodData Central API
        Get your free API key from: https://fdc.nal.usda.gov/api-key-signup/
        """
        if not api_key:
            print("USDA API key required. Get one from: https://fdc.nal.usda.gov/api-key-signup/")
            return []
        
        base_url = "https://api.nal.usda.gov/fdc/v1"
        
        # Common food search terms
        common_foods = [
            "apple", "banana", "chicken breast", "salmon", "broccoli", 
            "rice", "pasta", "bread", "milk", "cheese", "egg", "potato",
            "tomato", "carrot", "spinach", "orange", "beef", "pork",
            "beans", "lentils", "quinoa", "oats", "almonds", "avocado"
        ]
        
        foods_data = []
        
        for food_term in common_foods:
            try:
                # Search for food
                search_url = f"{base_url}/foods/search"
                params = {
                    'query': food_term,
                    'api_key': api_key,
                    'dataType': ['Foundation', 'SR Legacy'],
                    'pageSize': 5
                }
                
                response = self.session.get(search_url, params=params)
                response.raise_for_status()
                data = response.json()
                
                if 'foods' in data and data['foods']:
                    # Get the first result
                    food = data['foods'][0]
                    food_data = self.extract_nutrition_from_usda(food)
                    if food_data:
                        foods_data.append(food_data)
                        print(f"Retrieved data for: {food_data['food_name']}")
                
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"Error retrieving {food_term}: {e}")
                continue
        
        return foods_data
    
    def extract_nutrition_from_usda(self, food_data: Dict) -> Dict:
        """Extract nutrition information from USDA food data"""
        try:
            food_name = food_data.get('description', '').lower()
            
            # Initialize nutrition values
            nutrition = {
                'food_name': food_name,
                'calories_per_100g': 0,
                'protein_g': 0,
                'carbs_g': 0,
                'fat_g': 0,
                'fiber_g': 0,
                'sugar_g': 0,
                'sodium_mg': 0
            }
            
            # Map USDA nutrient IDs to our fields
            nutrient_mapping = {
                1008: 'calories_per_100g',  # Energy
                1003: 'protein_g',          # Protein
                1005: 'carbs_g',            # Carbohydrate
                1004: 'fat_g',              # Total lipid (fat)
                1079: 'fiber_g',            # Fiber, total dietary
                2000: 'sugar_g',            # Sugars, total
                1093: 'sodium_mg'           # Sodium
            }
            
            # Extract nutrients
            if 'foodNutrients' in food_data:
                for nutrient in food_data['foodNutrients']:
                    nutrient_id = nutrient.get('nutrient', {}).get('id')
                    if nutrient_id in nutrient_mapping:
                        field = nutrient_mapping[nutrient_id]
                        value = nutrient.get('amount', 0)
                        nutrition[field] = round(float(value), 1) if value else 0
            
            return nutrition
            
        except Exception as e:
            print(f"Error extracting nutrition data: {e}")
            return None
    
    def scrape_nutrition_value_org(self, food_list: List[str]):
        """
        Scrape data from nutritionvalue.org
        """
        foods_data = []
        base_url = "https://www.nutritionvalue.org"
        
        for food_name in food_list:
            try:
                # Format food name for URL
                formatted_name = food_name.lower().replace(' ', '_')
                url = f"{base_url}/{formatted_name}_nutrition_facts"
                
                response = self.session.get(url)
                if response.status_code == 200:
                    # This would require HTML parsing with BeautifulSoup
                    # For demonstration, we'll skip the parsing implementation
                    print(f"Would scrape: {url}")
                
                time.sleep(1)  # Rate limiting
                
            except Exception as e:
                print(f"Error scraping {food_name}: {e}")
                continue
        
        return foods_data
    
    def load_existing_data(self, filename: str) -> List[Dict]:
        """Load existing nutrition data from CSV"""
        try:
            df = pd.read_csv(filename)
            return df.to_dict('records')
        except Exception as e:
            print(f"Error loading existing data: {e}")
            return []
    
    def save_to_csv(self, data: List[Dict], filename: str):
        """Save nutrition data to CSV"""
        try:
            df = pd.DataFrame(data)
            
            # Ensure proper column order
            column_order = [
                'food_name', 'calories_per_100g', 'protein_g', 'carbs_g', 
                'fat_g', 'fiber_g', 'sugar_g', 'sodium_mg'
            ]
            
            df = df.reindex(columns=column_order)
            df.to_csv(filename, index=False)
            print(f"Saved {len(data)} food items to {filename}")
            
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def expand_food_database(self, existing_csv: str, output_csv: str):
        """
        Expand existing food database with additional common foods
        """
        # Load existing data
        existing_data = self.load_existing_data(existing_csv)
        existing_foods = [food['food_name'].lower() for food in existing_data]
        
        # Additional common foods to add
        additional_foods = [
            {"food_name": "white rice (cooked)", "calories_per_100g": 130, "protein_g": 2.7, "carbs_g": 28.2, "fat_g": 0.3, "fiber_g": 0.4, "sugar_g": 0.1, "sodium_mg": 1},
            {"food_name": "brown rice (cooked)", "calories_per_100g": 112, "protein_g": 2.6, "carbs_g": 23.0, "fat_g": 0.9, "fiber_g": 1.8, "sugar_g": 0.4, "sodium_mg": 1},
            {"food_name": "basmati rice (cooked)", "calories_per_100g": 121, "protein_g": 2.5, "carbs_g": 25.0, "fat_g": 0.4, "fiber_g": 0.6, "sugar_g": 0.1, "sodium_mg": 1},
            {"food_name": "wild rice (cooked)", "calories_per_100g": 101, "protein_g": 4.0, "carbs_g": 21.3, "fat_g": 0.3, "fiber_g": 1.8, "sugar_g": 0.7, "sodium_mg": 3},
            {"food_name": "jasmine rice (cooked)", "calories_per_100g": 129, "protein_g": 2.7, "carbs_g": 28.0, "fat_g": 0.3, "fiber_g": 0.4, "sugar_g": 0.1, "sodium_mg": 1},
            {"food_name": "quinoa (uncooked)", "calories_per_100g": 368, "protein_g": 14.1, "carbs_g": 64.2, "fat_g": 6.1, "fiber_g": 7.0, "sugar_g": 0.0, "sodium_mg": 5},
            {"food_name": "bulgur wheat (cooked)", "calories_per_100g": 83, "protein_g": 3.1, "carbs_g": 18.6, "fat_g": 0.2, "fiber_g": 4.5, "sugar_g": 0.1, "sodium_mg": 5},
            {"food_name": "barley (cooked)", "calories_per_100g": 123, "protein_g": 2.3, "carbs_g": 28.2, "fat_g": 0.4, "fiber_g": 3.8, "sugar_g": 0.8, "sodium_mg": 3},
            {"food_name": "millet (cooked)", "calories_per_100g": 119, "protein_g": 3.5, "carbs_g": 23.7, "fat_g": 1.0, "fiber_g": 1.3, "sugar_g": 0.1, "sodium_mg": 2},
            {"food_name": "amaranth (cooked)", "calories_per_100g": 103, "protein_g": 4.0, "carbs_g": 19.0, "fat_g": 1.6, "fiber_g": 2.1, "sugar_g": 0.0, "sodium_mg": 6},
            {"food_name": "buckwheat (cooked)", "calories_per_100g": 92, "protein_g": 3.4, "carbs_g": 19.9, "fat_g": 0.6, "fiber_g": 2.7, "sugar_g": 0.0, "sodium_mg": 4},
            {"food_name": "teff (cooked)", "calories_per_100g": 101, "protein_g": 3.9, "carbs_g": 20.0, "fat_g": 0.7, "fiber_g": 3.0, "sugar_g": 0.0, "sodium_mg": 3},
            {"food_name": "farro (cooked)", "calories_per_100g": 114, "protein_g": 4.2, "carbs_g": 22.7, "fat_g": 0.8, "fiber_g": 3.2, "sugar_g": 0.6, "sodium_mg": 2},
            {"food_name": "spelt (cooked)", "calories_per_100g": 127, "protein_g": 5.5, "carbs_g": 26.4, "fat_g": 0.8, "fiber_g": 3.9, "sugar_g": 0.0, "sodium_mg": 2},
            {"food_name": "freekeh (cooked)", "calories_per_100g": 141, "protein_g": 5.2, "carbs_g": 30.1, "fat_g": 0.8, "fiber_g": 4.2, "sugar_g": 0.0, "sodium_mg": 3},
            {"food_name": "chia seeds (1 tbsp)", "calories_per_100g": 486, "protein_g": 16.5, "carbs_g": 42.1, "fat_g": 30.7, "fiber_g": 34.4, "sugar_g": 0.0, "sodium_mg": 16},
            {"food_name": "hemp seeds", "calories_per_100g": 553, "protein_g": 31.6, "carbs_g": 8.7, "fat_g": 48.8, "fiber_g": 4.0, "sugar_g": 1.5, "sodium_mg": 5},
            {"food_name": "pumpkin seeds (pepitas)", "calories_per_100g": 559, "protein_g": 30.2, "carbs_g": 10.7, "fat_g": 49.0, "fiber_g": 6.0, "sugar_g": 1.4, "sodium_mg": 7},
            {"food_name": "sunflower seeds (hulled)", "calories_per_100g": 584, "protein_g": 20.8, "carbs_g": 20.0, "fat_g": 51.5, "fiber_g": 8.6, "sugar_g": 2.6, "sodium_mg": 9},
            {"food_name": "sesame seeds (hulled)", "calories_per_100g": 573, "protein_g": 17.7, "carbs_g": 23.4, "fat_g": 49.7, "fiber_g": 11.8, "sugar_g": 0.3, "sodium_mg": 11},
            {"food_name": "pine nuts", "calories_per_100g": 673, "protein_g": 13.7, "carbs_g": 13.1, "fat_g": 68.4, "fiber_g": 3.7, "sugar_g": 3.6, "sodium_mg": 2},
            {"food_name": "macadamia nuts", "calories_per_100g": 718, "protein_g": 7.9, "carbs_g": 13.8, "fat_g": 75.8, "fiber_g": 8.6, "sugar_g": 4.6, "sodium_mg": 5},
            {"food_name": "brazil nuts", "calories_per_100g": 656, "protein_g": 14.3, "carbs_g": 12.3, "fat_g": 66.4, "fiber_g": 7.5, "sugar_g": 2.3, "sodium_mg": 3},
            {"food_name": "hazelnuts", "calories_per_100g": 628, "protein_g": 15.0, "carbs_g": 16.7, "fat_g": 60.8, "fiber_g": 9.7, "sugar_g": 4.3, "sodium_mg": 0},
            {"food_name": "pistachios", "calories_per_100g": 560, "protein_g": 20.2, "carbs_g": 27.2, "fat_g": 45.3, "fiber_g": 10.6, "sugar_g": 7.7, "sodium_mg": 1},
            {"food_name": "pecans", "calories_per_100g": 691, "protein_g": 9.2, "carbs_g": 13.9, "fat_g": 72.0, "fiber_g": 9.6, "sugar_g": 4.0, "sodium_mg": 0}
        ]
        
        # Add new foods that aren't already in the database
        new_foods = []
        for food in additional_foods:
            if food['food_name'].lower() not in existing_foods:
                new_foods.append(food)
        
        # Combine existing and new data
        all_foods = existing_data + new_foods
        
        # Remove duplicates based on food name
        seen = set()
        unique_foods = []
        for food in all_foods:
            food_key = food['food_name'].lower()
            if food_key not in seen:
                seen.add(food_key)
                unique_foods.append(food)
        
        # Sort by food name
        unique_foods.sort(key=lambda x: x['food_name'])
        
        # Save expanded database
        self.save_to_csv(unique_foods, output_csv)
        print(f"Expanded database from {len(existing_data)} to {len(unique_foods)} foods")
        
        return unique_foods

def main():
    """Main function to demonstrate usage"""
    scraper = NutritionScraper()
    
    # Expand the existing food database
    input_file = "common_foods_nutrition.csv"
    output_file = "expanded_foods_nutrition.csv"
    
    print("Expanding food nutrition database...")
    expanded_data = scraper.expand_food_database(input_file, output_file)
    
    print(f"\nDatabase expansion complete!")
    print(f"Total foods in database: {len(expanded_data)}")
    
    # If you have a USDA API key, uncomment the following:
    # usda_key = "YOUR_USDA_API_KEY_HERE"
    # usda_data = scraper.scrape_usda_api(usda_key)
    # if usda_data:
    #     scraper.save_to_csv(usda_data, "usda_nutrition_data.csv")

if __name__ == "__main__":
    main()