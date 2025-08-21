import React, { useEffect, useRef, useState } from 'react';
import { useContentManager } from '../hooks/useContentManager';
import { useAuth } from '../hooks/useAuth';
import './Journal.css';

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

const Journal: React.FC = () => {
    const pageRef = useRef<HTMLElement>(null);
    const { setCurrentSection } = useContentManager();
    const { user } = useAuth();

    const [meals, setMeals] = useState<MealEntry[]>([]);
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

    useEffect(() => {
        setCurrentSection('journal');

        // Load sample meals data for today (this would come from your data source)
        const todaysMeals: MealEntry[] = [
            {
                id: '1',
                name: 'Greek Yogurt with Berries',
                calories: 180,
                protein: 15,
                carbs: 20,
                fat: 5,
                timestamp: new Date(new Date().setHours(8, 30, 0, 0)),
                mealType: 'breakfast'
            },
            {
                id: '2',
                name: 'Banana',
                calories: 105,
                protein: 1.3,
                carbs: 27,
                fat: 0.4,
                timestamp: new Date(new Date().setHours(10, 15, 0, 0)),
                mealType: 'snack'
            },
            {
                id: '3',
                name: 'Grilled Chicken Salad',
                calories: 350,
                protein: 35,
                carbs: 12,
                fat: 18,
                timestamp: new Date(new Date().setHours(12, 45, 0, 0)),
                mealType: 'lunch'
            },
            {
                id: '4',
                name: 'Almonds (28g)',
                calories: 164,
                protein: 6,
                carbs: 6,
                fat: 14,
                timestamp: new Date(new Date().setHours(15, 20, 0, 0)),
                mealType: 'snack'
            },
            {
                id: '5',
                name: 'Salmon with Quinoa',
                calories: 420,
                protein: 38,
                carbs: 35,
                fat: 16,
                timestamp: new Date(new Date().setHours(19, 0, 0, 0)),
                mealType: 'dinner'
            },
            {
                id: '6',
                name: 'Mixed Vegetables',
                calories: 80,
                protein: 4,
                carbs: 16,
                fat: 1,
                timestamp: new Date(new Date().setHours(19, 0, 0, 0)),
                mealType: 'dinner'
            }
        ];

        setMeals(todaysMeals);
        updateNutritionSummary(todaysMeals);
    }, [setCurrentSection]);

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

    const getMealsByType = (type: MealEntry['mealType']) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return meals.filter(meal => {
            const mealDate = new Date(meal.timestamp);
            mealDate.setHours(0, 0, 0, 0);
            return meal.mealType === type && mealDate.getTime() === today.getTime();
        }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    };

    const formatTime = (timestamp: Date) => {
        return timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    const getTotalMealsByType = (type: MealEntry['mealType']) => {
        const typeMeals = getMealsByType(type);
        return typeMeals.reduce((sum, meal) => sum + meal.calories, 0);
    };

    return (
        <section ref={pageRef} id="journal" className="journal">
            <div className="journal__container">
                <div className="journal__header">
                    <h1 className="journal__title">📝 Today's Health Journal</h1>
                    <div className="journal__date">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Nutrition Overview */}
                <div className="journal__nutrition-overview">
                    <h2 className="journal__section-title">Daily Nutrition Summary</h2>
                    <div className="journal__nutrition-grid">
                        <div className="journal__nutrition-card journal__nutrition-card--calories">
                            <div className="journal__nutrition-icon">🔥</div>
                            <div className="journal__nutrition-content">
                                <div className="journal__nutrition-value">
                                    {Math.round(nutritionSummary.totalCalories)} / {nutritionSummary.goalCalories}
                                </div>
                                <div className="journal__nutrition-label">Calories</div>
                                <div className="journal__progress-bar">
                                    <div 
                                        className="journal__progress-fill journal__progress-fill--calories"
                                        style={{ width: `${getProgressPercentage(nutritionSummary.totalCalories, nutritionSummary.goalCalories)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="journal__nutrition-card journal__nutrition-card--protein">
                            <div className="journal__nutrition-icon">💪</div>
                            <div className="journal__nutrition-content">
                                <div className="journal__nutrition-value">
                                    {Math.round(nutritionSummary.totalProtein)}g / {nutritionSummary.goalProtein}g
                                </div>
                                <div className="journal__nutrition-label">Protein</div>
                                <div className="journal__progress-bar">
                                    <div 
                                        className="journal__progress-fill journal__progress-fill--protein"
                                        style={{ width: `${getProgressPercentage(nutritionSummary.totalProtein, nutritionSummary.goalProtein)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="journal__nutrition-card journal__nutrition-card--carbs">
                            <div className="journal__nutrition-icon">🌾</div>
                            <div className="journal__nutrition-content">
                                <div className="journal__nutrition-value">
                                    {Math.round(nutritionSummary.totalCarbs)}g / {nutritionSummary.goalCarbs}g
                                </div>
                                <div className="journal__nutrition-label">Carbs</div>
                                <div className="journal__progress-bar">
                                    <div 
                                        className="journal__progress-fill journal__progress-fill--carbs"
                                        style={{ width: `${getProgressPercentage(nutritionSummary.totalCarbs, nutritionSummary.goalCarbs)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="journal__nutrition-card journal__nutrition-card--fat">
                            <div className="journal__nutrition-icon">🥑</div>
                            <div className="journal__nutrition-content">
                                <div className="journal__nutrition-value">
                                    {Math.round(nutritionSummary.totalFat)}g / {nutritionSummary.goalFat}g
                                </div>
                                <div className="journal__nutrition-label">Fat</div>
                                <div className="journal__progress-bar">
                                    <div 
                                        className="journal__progress-fill journal__progress-fill--fat"
                                        style={{ width: `${getProgressPercentage(nutritionSummary.totalFat, nutritionSummary.goalFat)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Meal Timeline */}
                <div className="journal__meals-timeline">
                    <h2 className="journal__section-title">Today's Detailed Meal Log</h2>
                    
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealType => {
                        const typeMeals = getMealsByType(mealType);
                        const typeCalories = getTotalMealsByType(mealType);

                        if (typeMeals.length === 0) return null;

                        return (
                            <div key={mealType} className="journal__meal-section">
                                <div className="journal__meal-header">
                                    <div className="journal__meal-type">
                                        <span className="journal__meal-icon">
                                            {mealType === 'breakfast' && '🌅'}
                                            {mealType === 'lunch' && '☀️'}
                                            {mealType === 'dinner' && '🌙'}
                                            {mealType === 'snack' && '🍿'}
                                        </span>
                                        <h3 className="journal__meal-title">
                                            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                        </h3>
                                    </div>
                                    <div className="journal__meal-summary">
                                        <span className="journal__meal-count">
                                            {typeMeals.length} {typeMeals.length === 1 ? 'item' : 'items'}
                                        </span>
                                        <span className="journal__meal-calories">
                                            {Math.round(typeCalories)} cal
                                        </span>
                                    </div>
                                </div>

                                <div className="journal__meal-items">
                                    {typeMeals.map(meal => (
                                        <div key={meal.id} className="journal__meal-item">
                                            <div className="journal__meal-time">
                                                {formatTime(meal.timestamp)}
                                            </div>
                                            <div className="journal__meal-details">
                                                <div className="journal__meal-name">{meal.name}</div>
                                                <div className="journal__meal-nutrition">
                                                    <span className="journal__nutrition-item">
                                                        🔥 {meal.calories} cal
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        💪 {meal.protein}g protein
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        🌾 {meal.carbs}g carbs
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        🥑 {meal.fat}g fat
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="journal__quick-stats">
                    <h2 className="journal__section-title">Today's Quick Stats</h2>
                    <div className="journal__stats-grid">
                        <div className="journal__stat-card">
                            <div className="journal__stat-value">{meals.length}</div>
                            <div className="journal__stat-label">Total Meals/Snacks</div>
                        </div>
                        <div className="journal__stat-card">
                            <div className="journal__stat-value">
                                {Math.round((nutritionSummary.totalCalories / nutritionSummary.goalCalories) * 100)}%
                            </div>
                            <div className="journal__stat-label">Daily Goal Progress</div>
                        </div>
                        <div className="journal__stat-card">
                            <div className="journal__stat-value">
                                {meals.length > 0 ? Math.round(nutritionSummary.totalCalories / meals.length) : 0}
                            </div>
                            <div className="journal__stat-label">Avg Calories per Meal</div>
                        </div>
                        <div className="journal__stat-card">
                            <div className="journal__stat-value">
                                {Math.round((nutritionSummary.totalProtein / nutritionSummary.totalCalories) * 100)}%
                            </div>
                            <div className="journal__stat-label">Protein Ratio</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Journal;