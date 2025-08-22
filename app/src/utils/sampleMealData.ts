import { type NutritionGoals } from './nutritionCalculations';

export interface MealEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    timestamp: Date;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const MEAL_TEMPLATES = {
    breakfast: [
        { name: 'Greek Yogurt with Berries', calories: 180, protein: 15, carbs: 20, fat: 5 },
        { name: 'Oatmeal with Banana', calories: 220, protein: 8, carbs: 42, fat: 4 },
        { name: 'Scrambled Eggs with Toast', calories: 280, protein: 16, carbs: 18, fat: 16 },
        { name: 'Protein Smoothie', calories: 250, protein: 20, carbs: 25, fat: 8 },
        { name: 'Avocado Toast', calories: 300, protein: 12, carbs: 28, fat: 18 }
    ],
    lunch: [
        { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 12, fat: 18 },
        { name: 'Turkey and Hummus Wrap', calories: 320, protein: 25, carbs: 35, fat: 12 },
        { name: 'Quinoa Bowl with Vegetables', calories: 380, protein: 15, carbs: 55, fat: 12 },
        { name: 'Lentil Soup with Bread', calories: 290, protein: 16, carbs: 45, fat: 6 },
        { name: 'Tuna Salad Sandwich', calories: 340, protein: 28, carbs: 32, fat: 14 }
    ],
    dinner: [
        { name: 'Salmon with Quinoa', calories: 420, protein: 38, carbs: 35, fat: 16 },
        { name: 'Grilled Chicken with Sweet Potato', calories: 380, protein: 32, carbs: 40, fat: 12 },
        { name: 'Beef Stir Fry with Rice', calories: 450, protein: 28, carbs: 48, fat: 18 },
        { name: 'Vegetable Pasta', calories: 360, protein: 14, carbs: 58, fat: 10 },
        { name: 'Fish Tacos', calories: 390, protein: 26, carbs: 42, fat: 16 }
    ],
    snack: [
        { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14 },
        { name: 'Apple with Peanut Butter', calories: 180, protein: 7, carbs: 20, fat: 8 },
        { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0 },
        { name: 'Trail Mix', calories: 150, protein: 5, carbs: 13, fat: 9 },
        { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fat: 6 }
    ]
};

const generateMealTime = (mealType: MealEntry['mealType'], baseDate: Date = new Date()): Date => {
    const date = new Date(baseDate);
    date.setSeconds(0, 0);
    
    const timeRanges = {
        breakfast: { start: 7, end: 9 },
        snack: mealType === 'snack' ? { start: 10, end: 16 } : { start: 15, end: 16 },
        lunch: { start: 12, end: 14 },
        dinner: { start: 18, end: 20 }
    };
    
    const range = timeRanges[mealType === 'snack' ? 'snack' : mealType];
    const hour = Math.floor(Math.random() * (range.end - range.start)) + range.start;
    const minute = Math.floor(Math.random() * 60);
    
    date.setHours(hour, minute);
    return date;
};

const scaleMealToTarget = (
    baseMeal: Omit<MealEntry, 'id' | 'timestamp' | 'mealType'>, 
    targetCalories: number
): Omit<MealEntry, 'id' | 'timestamp' | 'mealType'> => {
    const scale = targetCalories / baseMeal.calories;
    
    return {
        name: baseMeal.name,
        calories: Math.round(baseMeal.calories * scale),
        protein: Math.round(baseMeal.protein * scale * 10) / 10,
        carbs: Math.round(baseMeal.carbs * scale * 10) / 10,
        fat: Math.round(baseMeal.fat * scale * 10) / 10
    };
};

export const generateSampleMeals = (goals: NutritionGoals): MealEntry[] => {
    const meals: MealEntry[] = [];
    
    const calorieDistribution = {
        breakfast: 0.25,
        lunch: 0.35,
        dinner: 0.30,
        snack: 0.10
    };
    
    const mealTypes: Array<{ type: MealEntry['mealType']; count: number }> = [
        { type: 'breakfast', count: 1 },
        { type: 'lunch', count: 1 },
        { type: 'dinner', count: 1 },
        { type: 'snack', count: 2 }
    ];
    
    mealTypes.forEach(({ type, count }) => {
        const targetCaloriesPerMeal = (goals.goalCalories * calorieDistribution[type]) / count;
        const templates = MEAL_TEMPLATES[type];
        
        for (let i = 0; i < count; i++) {
            const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
            const scaledMeal = scaleMealToTarget(randomTemplate, targetCaloriesPerMeal);
            
            meals.push({
                id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                ...scaledMeal,
                timestamp: generateMealTime(type),
                mealType: type
            });
        }
    });
    
    const totalActualCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const adjustmentFactor = goals.goalCalories / totalActualCalories;
    
    if (Math.abs(adjustmentFactor - 1) > 0.05) {
        meals.forEach(meal => {
            meal.calories = Math.round(meal.calories * adjustmentFactor);
            meal.protein = Math.round(meal.protein * adjustmentFactor * 10) / 10;
            meal.carbs = Math.round(meal.carbs * adjustmentFactor * 10) / 10;
            meal.fat = Math.round(meal.fat * adjustmentFactor * 10) / 10;
        });
    }
    
    return meals.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};