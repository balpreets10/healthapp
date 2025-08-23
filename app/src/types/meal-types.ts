export interface MealEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
}

export interface NutritionSummary {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    goalCalories: number;
    goalProtein: number;
    goalCarbs: number;
    goalFat: number;
}

export interface QuickAddFood {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface SearchResult {
    id: string;
    name: string;
    calories_per_100g: number;
    protein_g: number;
    carbohydrates_g: number;
    fats_g: number;
    fiber_g?: number;
    free_sugar_g?: number;
    sodium_mg?: number;
    source: 'foods' | 'custom_meals';
}

export interface CustomMealForm {
    mealName: string;
    mealType: MealEntry['mealType'];
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
    notes: string;
    time: string;
    saveMeal: boolean;
}

export type MealType = MealEntry['mealType'];