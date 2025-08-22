import React, { useEffect, useRef } from 'react';
import { useContentManager } from '../hooks/useContentManager';
import { useCalorieTracker } from '../hooks/useCalorieTracker';
import { 
    getProgressPercentage,
    calculateAverageCaloriesPerMeal,
    calculateMacroRatio
} from '../utils/nutritionCalculations';
import { NUTRITION_CONSTANTS } from '../config/constants';
import './Journal.css';

interface MealEntry {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
}

const Journal: React.FC = () => {
    const pageRef = useRef<HTMLElement>(null);
    const { setCurrentSection } = useContentManager();
    const { todaysMeals, calorieData } = useCalorieTracker();

    // Calculate nutrition goals from calorieData
    const nutritionGoals = {
        goalCalories: calorieData.targetCalories,
        goalProtein: Math.round(calorieData.targetCalories * 0.3 / 4), // 30% of calories from protein
        goalCarbs: Math.round(calorieData.targetCalories * 0.45 / 4), // 45% of calories from carbs
        goalFat: Math.round(calorieData.targetCalories * 0.25 / 9)    // 25% of calories from fat
    };

    // Calculate current nutrition from today's meals
    const nutritionSummary = {
        totalCalories: calorieData.currentCalories,
        totalProtein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0),
        ...nutritionGoals
    };

    useEffect(() => {
        setCurrentSection('journal');
    }, [setCurrentSection]);

    const getMealsByType = (type: MealEntry['mealType']) => {
        return todaysMeals.filter(meal => meal.mealType === type);
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
                            <div className="journal__nutrition-icon">{NUTRITION_CONSTANTS.nutritionIcons.calories}</div>
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
                            <div className="journal__nutrition-icon">{NUTRITION_CONSTANTS.nutritionIcons.protein}</div>
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
                            <div className="journal__nutrition-icon">{NUTRITION_CONSTANTS.nutritionIcons.carbs}</div>
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
                            <div className="journal__nutrition-icon">{NUTRITION_CONSTANTS.nutritionIcons.fat}</div>
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
                                            {NUTRITION_CONSTANTS.mealTypeIcons[mealType]}
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
                                                {meal.time}
                                            </div>
                                            <div className="journal__meal-details">
                                                <div className="journal__meal-name">{meal.name}</div>
                                                <div className="journal__meal-nutrition">
                                                    <span className="journal__nutrition-item">
                                                        {NUTRITION_CONSTANTS.nutritionIcons.calories} {meal.calories} cal
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        {NUTRITION_CONSTANTS.nutritionIcons.protein} {meal.protein}g protein
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        {NUTRITION_CONSTANTS.nutritionIcons.carbs} {meal.carbs}g carbs
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        {NUTRITION_CONSTANTS.nutritionIcons.fat} {meal.fat}g fat
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
                            <div className="journal__stat-value">{todaysMeals.length}</div>
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
                                {calculateAverageCaloriesPerMeal(nutritionSummary.totalCalories, todaysMeals.length)}
                            </div>
                            <div className="journal__stat-label">Avg Calories per Meal</div>
                        </div>
                        <div className="journal__stat-card">
                            <div className="journal__stat-value">
                                {calculateMacroRatio(nutritionSummary.totalProtein, nutritionSummary.totalCalories)}%
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