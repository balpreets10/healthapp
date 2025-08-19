import React, { useEffect, useRef, useState } from 'react';
import { useContentManager } from '../hooks/useContentManager';
import { useAuth } from '../hooks/useAuth';
import './AddMeals.css';

interface MealEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    timestamp: Date;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface NutritionSummary {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    goalCalories: number;
    goalProtein: number;
    goalCarbs: number;
    goalFat: number;
}

interface QuickAddFood {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

const AddMeals: React.FC = () => {
    const pageRef = useRef<HTMLElement>(null);
    const { setCurrentSection } = useContentManager();
    const { user } = useAuth();

    // State management
    const [meals, setMeals] = useState<MealEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMealType, setSelectedMealType] = useState<MealEntry['mealType']>('breakfast');
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    // Nutrition summary state
    const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary>({
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        goalCalories: 2000,
        goalProtein: 150,
        goalCarbs: 250,
        goalFat: 65
    });

    // Quick add foods for demo
    const quickAddFoods: QuickAddFood[] = [
        { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
        { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0 },
        { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14 },
        { name: 'Avocado (half)', calories: 160, protein: 2, carbs: 8.5, fat: 15 },
        { name: 'Oatmeal (1 cup)', calories: 154, protein: 6, carbs: 28, fat: 3 },
        { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
    ];

    // Set current section on mount
    useEffect(() => {
        setCurrentSection('add-meals');

        // Load sample data for demo
        const sampleMeals: MealEntry[] = [
            {
                id: '1',
                name: 'Oatmeal with Banana',
                calories: 259,
                protein: 7.3,
                carbs: 55,
                fat: 3.4,
                timestamp: new Date(),
                mealType: 'breakfast'
            },
            {
                id: '2',
                name: 'Grilled Chicken Salad',
                calories: 285,
                protein: 35,
                carbs: 12,
                fat: 8,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                mealType: 'lunch'
            }
        ];

        setMeals(sampleMeals);
        updateNutritionSummary(sampleMeals);
    }, [setCurrentSection]);

    // Update nutrition summary when meals change
    const updateNutritionSummary = (mealList: MealEntry[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysMeals = mealList.filter(meal => {
            const mealDate = new Date(meal.timestamp);
            mealDate.setHours(0, 0, 0, 0);
            return mealDate.getTime() === today.getTime();
        });

        const summary = todaysMeals.reduce(
            (acc, meal) => ({
                ...acc,
                totalCalories: acc.totalCalories + meal.calories,
                totalProtein: acc.totalProtein + meal.protein,
                totalCarbs: acc.totalCarbs + meal.carbs,
                totalFat: acc.totalFat + meal.fat
            }),
            {
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0,
                goalCalories: nutritionSummary.goalCalories,
                goalProtein: nutritionSummary.goalProtein,
                goalCarbs: nutritionSummary.goalCarbs,
                goalFat: nutritionSummary.goalFat
            }
        );

        setNutritionSummary(summary);
    };

    // Add meal function
    const addMeal = (food: QuickAddFood) => {
        const newMeal: MealEntry = {
            id: Date.now().toString(),
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            timestamp: new Date(),
            mealType: selectedMealType
        };

        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        updateNutritionSummary(updatedMeals);
        setShowQuickAdd(false);
    };

    // Remove meal function
    const removeMeal = (mealId: string) => {
        const updatedMeals = meals.filter(meal => meal.id !== mealId);
        setMeals(updatedMeals);
        updateNutritionSummary(updatedMeals);
    };

    // Filter foods based on search
    const filteredFoods = quickAddFoods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get meals by type for today
    const getMealsByType = (type: MealEntry['mealType']) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return meals.filter(meal => {
            const mealDate = new Date(meal.timestamp);
            mealDate.setHours(0, 0, 0, 0);
            return meal.mealType === type && mealDate.getTime() === today.getTime();
        });
    };

    // Calculate progress percentage
    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    return (
        <section ref={pageRef} id="add-meals" className="add-meals">
            <div className="add-meals__container">

                {/* Quick Actions */}
                <div className="add-meals__quick-actions">
                    <button
                        className="add-meals__quick-btn add-meals__quick-btn--primary"
                        onClick={() => setShowQuickAdd(!showQuickAdd)}
                    >
                        🍎 Quick Add Food
                    </button>
                    <button className="add-meals__quick-btn">
                        🔍 Search Foods
                    </button>
                    <button className="add-meals__quick-btn">
                        📊 Custom Entry
                    </button>
                </div>

                {/* Nutrition Summary */}
                <div className="add-meals__nutrition-summary">
                    <h2 className="add-meals__section-title">Today's Nutrition</h2>
                    <div className="add-meals__nutrition-visual">
                        {/* Calories Circle */}
                        <div className="add-meals__macro-circle">
                            <div className="add-meals__circle-container">
                                <svg className="add-meals__circle-svg" width="100" height="100" viewBox="0 0 36 36">
                                    <path className="add-meals__circle-bg"
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path className="add-meals__circle-progress add-meals__circle-progress--calories"
                                        strokeDasharray={`${getProgressPercentage(nutritionSummary.totalCalories, nutritionSummary.goalCalories)}, 100`}
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className="add-meals__circle-content">
                                    <div className="add-meals__circle-icon">🔥</div>
                                    <div className="add-meals__circle-value">{Math.round(nutritionSummary.totalCalories)}</div>
                                    <div className="add-meals__circle-label">Calories</div>
                                </div>
                            </div>
                        </div>

                        {/* Protein Circle */}
                        <div className="add-meals__macro-circle">
                            <div className="add-meals__circle-container">
                                <svg className="add-meals__circle-svg" width="100" height="100" viewBox="0 0 36 36">
                                    <path className="add-meals__circle-bg"
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path className="add-meals__circle-progress add-meals__circle-progress--protein"
                                        strokeDasharray={`${getProgressPercentage(nutritionSummary.totalProtein, nutritionSummary.goalProtein)}, 100`}
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className="add-meals__circle-content">
                                    <div className="add-meals__circle-icon">💪</div>
                                    <div className="add-meals__circle-value">{Math.round(nutritionSummary.totalProtein)}g</div>
                                    <div className="add-meals__circle-label">Protein</div>
                                </div>
                            </div>
                        </div>

                        {/* Carbs Circle */}
                        <div className="add-meals__macro-circle">
                            <div className="add-meals__circle-container">
                                <svg className="add-meals__circle-svg" width="100" height="100" viewBox="0 0 36 36">
                                    <path className="add-meals__circle-bg"
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path className="add-meals__circle-progress add-meals__circle-progress--carbs"
                                        strokeDasharray={`${getProgressPercentage(nutritionSummary.totalCarbs, nutritionSummary.goalCarbs)}, 100`}
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className="add-meals__circle-content">
                                    <div className="add-meals__circle-icon">🌾</div>
                                    <div className="add-meals__circle-value">{Math.round(nutritionSummary.totalCarbs)}g</div>
                                    <div className="add-meals__circle-label">Carbs</div>
                                </div>
                            </div>
                        </div>

                        {/* Fat Circle */}
                        <div className="add-meals__macro-circle">
                            <div className="add-meals__circle-container">
                                <svg className="add-meals__circle-svg" width="100" height="100" viewBox="0 0 36 36">
                                    <path className="add-meals__circle-bg"
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path className="add-meals__circle-progress add-meals__circle-progress--fat"
                                        strokeDasharray={`${getProgressPercentage(nutritionSummary.totalFat, nutritionSummary.goalFat)}, 100`}
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className="add-meals__circle-content">
                                    <div className="add-meals__circle-icon">🥑</div>
                                    <div className="add-meals__circle-value">{Math.round(nutritionSummary.totalFat)}g</div>
                                    <div className="add-meals__circle-label">Fat</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Add Panel */}
                {showQuickAdd && (
                    <div className="add-meals__quick-add-panel">
                        <div className="add-meals__panel-header">
                            <h3 className="add-meals__panel-title">Quick Add Foods</h3>
                            <button
                                className="add-meals__close-btn"
                                onClick={() => setShowQuickAdd(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="add-meals__meal-type-selector">
                            <label className="add-meals__meal-label">Meal Type:</label>
                            <select
                                value={selectedMealType}
                                onChange={(e) => setSelectedMealType(e.target.value as MealEntry['mealType'])}
                                className="add-meals__meal-select"
                            >
                                <option value="breakfast">🌅 Breakfast</option>
                                <option value="lunch">☀️ Lunch</option>
                                <option value="dinner">🌙 Dinner</option>
                                <option value="snack">🍿 Snack</option>
                            </select>
                        </div>

                        <div className="add-meals__search-box">
                            <input
                                type="text"
                                placeholder="Search foods..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="add-meals__search-input"
                            />
                        </div>

                        <div className="add-meals__foods-grid">
                            {filteredFoods.map((food, index) => (
                                <div key={index} className="add-meals__food-card">
                                    <div className="add-meals__food-info">
                                        <h4 className="add-meals__food-name">{food.name}</h4>
                                        <div className="add-meals__food-nutrition">
                                            <span>{food.calories} cal</span>
                                            <span>{food.protein}g protein</span>
                                        </div>
                                    </div>
                                    <button
                                        className="add-meals__add-food-btn"
                                        onClick={() => addMeal(food)}
                                    >
                                        +
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Meals by Type */}
                <div className="add-meals__meals-section">
                    <h2 className="add-meals__section-title">Today's Meals</h2>

                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealType => {
                        const typeMeals = getMealsByType(mealType);
                        const typeCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);

                        return (
                            <div key={mealType} className="add-meals__meal-type-section">
                                <div className="add-meals__meal-type-header">
                                    <h3 className="add-meals__meal-type-title">
                                        {mealType === 'breakfast' && '🌅'}
                                        {mealType === 'lunch' && '☀️'}
                                        {mealType === 'dinner' && '🌙'}
                                        {mealType === 'snack' && '🍿'}
                                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                    </h3>
                                    <span className="add-meals__meal-type-calories">
                                        {Math.round(typeCalories)} calories
                                    </span>
                                </div>

                                {typeMeals.length > 0 ? (
                                    <div className="add-meals__meal-list">
                                        {typeMeals.map(meal => (
                                            <div key={meal.id} className="add-meals__meal-item">
                                                <div className="add-meals__meal-info">
                                                    <span className="add-meals__meal-name">{meal.name}</span>
                                                    <span className="add-meals__meal-nutrition">
                                                        {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                                                    </span>
                                                </div>
                                                <button
                                                    className="add-meals__remove-btn"
                                                    onClick={() => removeMeal(meal.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="add-meals__empty-meal-type">
                                        <p>No {mealType} entries yet</p>
                                        <button
                                            className="add-meals__add-meal-btn"
                                            onClick={() => {
                                                setSelectedMealType(mealType);
                                                setShowQuickAdd(true);
                                            }}
                                        >
                                            + Add {mealType}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default AddMeals;