import React, { useEffect, useRef, useState } from 'react';
import { useContentManager } from '../hooks/useContentManager';
import { useCalorieTracker } from '../hooks/useCalorieTracker';
import { useAuth } from '../hooks/useAuth';
import { JournalSkeleton } from '../components/ui/SkeletonLoader';
import SupabaseService from '../services/SupabaseService';
import { 
    getProgressPercentage,
    calculateAverageCaloriesPerMeal,
    calculateMacroRatio
} from '../utils/nutritionCalculations';
import { NUTRITION_CONSTANTS } from '../config/constants';
import { MealEntry } from '../types/meal-types';
import './Journal.css';

const Journal: React.FC = () => {
    const pageRef = useRef<HTMLElement>(null);
    const { setCurrentSection } = useContentManager();
    const { todaysMeals, calorieData, refreshData } = useCalorieTracker();
    const { user } = useAuth();
    
    // Loading and editing states
    const [isLoading, setIsLoading] = useState(true);
    const [editingMealId, setEditingMealId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

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
        
        // Simulate loading delay to show skeleton
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [setCurrentSection]);

    // Remove meal function
    const removeMeal = async (mealId: string, mealName: string) => {
        if (!user) {
            setSubmitMessage({ text: 'Please log in to delete meals', type: 'error' });
            return;
        }

        if (!window.confirm(`Are you sure you want to delete "${mealName}"? This action cannot be undone.`)) {
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const { error } = await SupabaseService.deleteMeal(mealId);
            
            if (error) {
                console.error('Error deleting meal:', error);
                setSubmitMessage({ text: 'Failed to delete meal. Please try again.', type: 'error' });
            } else {
                setSubmitMessage({ text: 'Meal deleted successfully!', type: 'success' });
                await refreshData();

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    setSubmitMessage(null);
                }, 3000);
            }
        } catch (error) {
            console.error('Error deleting meal:', error);
            setSubmitMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update meal serving size
    const updateMealServing = async (mealId: string, newServingSize: number) => {
        if (!user) {
            setSubmitMessage({ text: 'Please log in to update meals', type: 'error' });
            return;
        }

        // Find the meal to get its original data
        const meal = todaysMeals.find(m => m.id === mealId);
        if (!meal || !meal.originalCaloriesPer100g) {
            setSubmitMessage({ text: 'Cannot update serving size for this meal', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            // Calculate new nutritional values based on serving size
            const ratio = newServingSize / 100; // Since original values are per 100g
            const newCalories = Math.round(meal.originalCaloriesPer100g * ratio);
            const newProtein = Math.round((meal.originalProteinPer100g || 0) * ratio * 10) / 10;
            const newCarbs = Math.round((meal.originalCarbsPer100g || 0) * ratio * 10) / 10;
            const newFat = Math.round((meal.originalFatPer100g || 0) * ratio * 10) / 10;

            // Get the current meal data from database to update the foods JSONB
            const mealData = await SupabaseService.getMealById(mealId);
            if (!mealData.data) {
                throw new Error('Could not fetch meal data');
            }

            const currentFoods = mealData.data.foods;
            let updatedFoods = { ...currentFoods };

            // Update serving size in the foods JSONB structure - handle all food source types
            let foodDataKey = null;
            if (updatedFoods.foods) {
                foodDataKey = 'foods';
            } else if (updatedFoods.custom_meals) {
                foodDataKey = 'custom_meals';
            } else if (updatedFoods.quick_add) {
                foodDataKey = 'quick_add';
            } else if (updatedFoods.custom) {
                foodDataKey = 'custom';
            }

            if (foodDataKey && updatedFoods[foodDataKey]) {
                updatedFoods[foodDataKey].serving = `${newServingSize}${meal.servingUnit || 'g'}`;
            }

            // Update the meal in database
            const { error } = await SupabaseService.updateMeal(mealId, {
                foods: updatedFoods,
                total_calories: newCalories,
                total_protein_g: newProtein,
                total_carbs_g: newCarbs,
                total_fat_g: newFat
            });

            if (error) {
                console.error('Error updating meal serving size:', error);
                setSubmitMessage({ text: 'Failed to update serving size. Please try again.', type: 'error' });
            } else {
                setSubmitMessage({ text: 'Serving size updated successfully!', type: 'success' });
                await refreshData();

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    setSubmitMessage(null);
                }, 3000);
            }
        } catch (error) {
            console.error('Error updating meal serving size:', error);
            setSubmitMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditingServing = (meal: MealEntry) => {
        setEditingMealId(meal.id);
        setEditingValue((meal.servingSize || 100).toString());
    };

    const handleServingUpdate = (mealId: string) => {
        const newServingSize = parseFloat(editingValue);
        if (!isNaN(newServingSize) && newServingSize > 0) {
            updateMealServing(mealId, newServingSize);
        }
        setEditingMealId(null);
        setEditingValue('');
    };

    const cancelEditing = () => {
        setEditingMealId(null);
        setEditingValue('');
    };

    const getMealsByType = (type: MealEntry['mealType']) => {
        return todaysMeals.filter(meal => meal.mealType === type);
    };


    const getTotalMealsByType = (type: MealEntry['mealType']) => {
        const typeMeals = getMealsByType(type);
        return typeMeals.reduce((sum, meal) => sum + meal.calories, 0);
    };

    // Show skeleton loader while loading
    if (isLoading) {
        return (
            <section ref={pageRef} id="journal" className="journal">
                <div className="journal__container">
                    <JournalSkeleton />
                </div>
            </section>
        );
    }

    return (
        <section ref={pageRef} id="journal" className="journal">
            <div className="journal__container">
                {/* Submit Message */}
                {submitMessage && (
                    <div className={`add-meals__message add-meals__message--${submitMessage.type}`}>
                        {submitMessage.text}
                    </div>
                )}
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
                                                        {NUTRITION_CONSTANTS.nutritionIcons.calories} {Math.round(meal.calories)} cal
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        {NUTRITION_CONSTANTS.nutritionIcons.protein} {meal.protein.toFixed(1)}g protein
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        {NUTRITION_CONSTANTS.nutritionIcons.carbs} {meal.carbs.toFixed(1)}g carbs
                                                    </span>
                                                    <span className="journal__nutrition-item">
                                                        {NUTRITION_CONSTANTS.nutritionIcons.fat} {meal.fat.toFixed(1)}g fat
                                                    </span>
                                                </div>
                                                {/* Serving Size Info and Edit Controls */}
                                                <div className="journal__serving-info">
                                                    <span className="journal__serving-label">Serving: </span>
                                                    {meal.originalCaloriesPer100g && editingMealId === meal.id ? (
                                                        <div className="journal__serving-editor">
                                                            <input
                                                                type="number"
                                                                value={editingValue}
                                                                onChange={(e) => setEditingValue(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleServingUpdate(meal.id);
                                                                    } else if (e.key === 'Escape') {
                                                                        cancelEditing();
                                                                    }
                                                                }}
                                                                className="journal__serving-input"
                                                                step="0.1"
                                                                min="0.1"
                                                                autoFocus
                                                                disabled={isSubmitting}
                                                            />
                                                            <span>{meal.servingUnit || 'g'}</span>
                                                            <button 
                                                                onClick={() => handleServingUpdate(meal.id)}
                                                                className="journal__serving-save-btn"
                                                                title="Save serving size"
                                                                disabled={isSubmitting}
                                                            >
                                                                ✓
                                                            </button>
                                                            <button 
                                                                onClick={cancelEditing}
                                                                className="journal__serving-cancel-btn"
                                                                title="Cancel editing"
                                                                disabled={isSubmitting}
                                                            >
                                                                ✗
                                                            </button>
                                                        </div>
                                                    ) : meal.originalCaloriesPer100g ? (
                                                        <button
                                                            onClick={() => startEditingServing(meal)}
                                                            className="journal__serving-display"
                                                            title="Click to edit serving size"
                                                            disabled={isSubmitting}
                                                        >
                                                            {meal.servingSize || 100}{meal.servingUnit || 'g'} ✏️
                                                        </button>
                                                    ) : (
                                                        <span className="journal__serving-default">
                                                            {meal.servingSize || 100}{meal.servingUnit || 'g'} (default)
                                                        </span>
                                                    )}
                                                    {meal.originalCaloriesPer100g && (
                                                        <span className="journal__per-100g-info">
                                                            ({Math.round(meal.originalCaloriesPer100g)} cal per 100g)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Meal Actions */}
                                            <div className="journal__meal-actions">
                                                <button
                                                    className="journal__remove-btn"
                                                    onClick={() => removeMeal(meal.id, meal.name)}
                                                    title="Delete meal"
                                                    disabled={isSubmitting}
                                                >
                                                    🗑️
                                                </button>
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