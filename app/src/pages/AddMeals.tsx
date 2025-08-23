import React, { useEffect, useRef, useState } from 'react';
import { useContentManager } from '../hooks/useContentManager';
import { useCalorieTracker } from '../hooks/useCalorieTracker';
import { useAuth } from '../hooks/useAuth';
import SupabaseService from '../services/SupabaseService';
import { getLocalDateString, getLocalTimeString } from '../utils/dateUtils';
import AutocompleteSearch from '../components/meals/AutocompleteSearch';
import QuickAddPanel from '../components/meals/QuickAddPanel';
import CustomMealForm from '../components/meals/CustomMealForm';
import NutritionSummary from '../components/meals/NutritionSummary';
import MealTypeSection from '../components/meals/MealTypeSection';
import {
    NutritionSummary as NutritionSummaryType,
    QuickAddFood,
    SearchResult,
    CustomMealForm as CustomMealFormType,
    MealType
} from '../types/meal-types';
import './AddMeals.css';
import './Journal.css';

const AddMeals: React.FC = () => {
    const pageRef = useRef<HTMLElement>(null);
    const { setCurrentSection } = useContentManager();
    const { todaysMeals, calorieData, refreshData } = useCalorieTracker();
    const { user } = useAuth();

    // State management
    const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showCustomEntry, setShowCustomEntry] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [quickAddFoods, setQuickAddFoods] = useState<QuickAddFood[]>([]);
    const [isLoadingQuickFoods, setIsLoadingQuickFoods] = useState(false);
    const [selectedMealTypeForSearch, setSelectedMealTypeForSearch] = useState<MealType>('breakfast');

    // Custom entry form state
    const [customMealForm, setCustomMealForm] = useState<CustomMealFormType>({
        mealName: '',
        mealType: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        sugar: '',
        sodium: '',
        notes: '',
        time: '',
        saveMeal: false
    });

    // Nutrition summary derived from calorieData
    const nutritionSummary: NutritionSummaryType = {
        totalCalories: calorieData.currentCalories,
        totalProtein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0),
        goalCalories: calorieData.targetCalories,
        goalProtein: Math.round(calorieData.targetCalories * 0.3 / 4), // 30% of calories from protein
        goalCarbs: Math.round(calorieData.targetCalories * 0.45 / 4), // 45% of calories from carbs
        goalFat: Math.round(calorieData.targetCalories * 0.25 / 9)    // 25% of calories from fat
    };

    // Load quick foods on component mount
    useEffect(() => {
        const loadQuickFoods = async () => {
            if (!user) return;
            
            setIsLoadingQuickFoods(true);
            try {
                const { data, error } = await SupabaseService.getQuickFoods(user.id, 8);
                if (error) {
                    console.error('Error loading quick foods:', error);
                    // Fallback to static foods if service fails
                    setQuickAddFoods([
                        { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
                        { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
                        { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
                        { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0 },
                        { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14 }
                    ]);
                } else {
                    setQuickAddFoods(data || []);
                }
            } catch (error) {
                console.error('Failed to load quick foods:', error);
                // Fallback to static foods
                setQuickAddFoods([
                    { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
                    { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
                    { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
                    { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0 },
                    { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14 }
                ]);
            } finally {
                setIsLoadingQuickFoods(false);
            }
        };

        loadQuickFoods();
    }, [user]);

    // Set current section on mount
    useEffect(() => {
        setCurrentSection('add-meals');
    }, [setCurrentSection]);


    // Add meal function
    const addMeal = async (food: QuickAddFood) => {
        if (!user) {
            setSubmitMessage({ text: 'Please log in to add meals', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const currentDate = new Date();
            const dateStr = getLocalDateString(currentDate);
            const timeStr = getLocalTimeString(currentDate);

            const mealData = {
                user_id: user.id,
                meal_type: selectedMealType,
                meal_name: food.name,
                date: dateStr,
                time: timeStr,
                foods: {
                    quick_add: {
                        name: food.name,
                        calories: food.calories,
                        protein: food.protein,
                        carbs: food.carbs,
                        fat: food.fat
                    }
                },
                total_calories: Math.round(food.calories),
                total_protein_g: food.protein,
                total_carbs_g: food.carbs,
                total_fat_g: food.fat,
                total_fiber_g: 0,
                total_sugar_g: 0,
                total_sodium_mg: 0
            };

            const { error } = await SupabaseService.addMeal(mealData);
            
            if (error) {
                console.error('Error adding meal:', error);
                setSubmitMessage({ text: 'Failed to add meal. Please try again.', type: 'error' });
            } else {
                setSubmitMessage({ text: `${food.name} added successfully!`, type: 'success' });
                await refreshData();
                
                // Refresh quick foods to potentially update most used meals
                if (user) {
                    try {
                        const { data } = await SupabaseService.getQuickFoods(user.id, 8);
                        if (data) {
                            setQuickAddFoods(data);
                        }
                    } catch (error) {
                        console.error('Failed to refresh quick foods:', error);
                    }
                }
                
                setShowQuickAdd(false);

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    setSubmitMessage(null);
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding meal:', error);
            setSubmitMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add meal from search result
    const addMealFromSearch = async (searchResult: SearchResult) => {
        if (!user) return;

        try {
            const currentDate = new Date();
            const dateStr = getLocalDateString(currentDate);
            const timeStr = getLocalTimeString(currentDate);

            // Convert from per 100g to actual serving (assuming 100g serving for now)
            const calories = Math.round(searchResult.calories_per_100g);
            const protein = searchResult.protein_g;
            const carbs = searchResult.carbohydrates_g;
            const fat = searchResult.fats_g;
            const fiber = searchResult.fiber_g || 0;
            const sugar = searchResult.free_sugar_g || 0;
            const sodium = searchResult.sodium_mg || 0;

            const mealData = {
                user_id: user.id,
                meal_type: selectedMealTypeForSearch,
                meal_name: searchResult.name,
                date: dateStr,
                time: timeStr,
                foods: {
                    [searchResult.source]: {
                        id: searchResult.id,
                        name: searchResult.name,
                        calories: calories,
                        protein: protein,
                        carbs: carbs,
                        fat: fat,
                        fiber: fiber,
                        sugar: sugar,
                        sodium: sodium,
                        serving: '100g'
                    }
                },
                total_calories: calories,
                total_protein_g: protein,
                total_carbs_g: carbs,
                total_fat_g: fat,
                total_fiber_g: fiber,
                total_sugar_g: sugar,
                total_sodium_mg: sodium
            };

            const { error } = await SupabaseService.addMeal(mealData);
            
            if (error) {
                console.error('Error adding meal from search:', error);
                setSubmitMessage({ text: 'Failed to add meal. Please try again.', type: 'error' });
            } else {
                setSubmitMessage({ text: `${searchResult.name} added successfully!`, type: 'success' });
                await refreshData();

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    setSubmitMessage(null);
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding meal from search:', error);
            setSubmitMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
        }
    };

    // Remove meal function - TODO: Implement actual database deletion
    const removeMeal = async (mealId: string) => {
        // TODO: Remove meal from database via SupabaseService
        console.log('Removing meal from database:', mealId);
        
        // Refresh data after removing
        await refreshData();
    };

    const handleMealTypeAdd = (mealType: MealType) => {
        setSelectedMealType(mealType);
        setShowQuickAdd(true);
        setShowCustomEntry(false);
    };

    // Custom meal form submission
    const handleCustomMealSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            setSubmitMessage({ text: 'Please log in to add meals', type: 'error' });
            return;
        }

        // Validate required fields
        if (!customMealForm.mealName.trim() || !customMealForm.calories) {
            setSubmitMessage({ text: 'Please fill in meal name and calories', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const calories = parseFloat(customMealForm.calories) || 0;
            const protein = parseFloat(customMealForm.protein) || 0;
            const carbs = parseFloat(customMealForm.carbs) || 0;
            const fat = parseFloat(customMealForm.fat) || 0;
            const fiber = parseFloat(customMealForm.fiber) || 0;
            const sugar = parseFloat(customMealForm.sugar) || 0;
            const sodium = parseFloat(customMealForm.sodium) || 0;

            // Prepare meal data for meals table
            const currentDate = new Date();
            const dateStr = getLocalDateString(currentDate);
            const timeStr = customMealForm.time || getLocalTimeString(currentDate);

            const mealData = {
                user_id: user.id,
                meal_type: customMealForm.mealType,
                meal_name: customMealForm.mealName.trim(),
                date: dateStr,
                time: timeStr,
                foods: {
                    custom: {
                        name: customMealForm.mealName.trim(),
                        calories,
                        protein,
                        carbs,
                        fat,
                        fiber,
                        sugar,
                        sodium,
                        notes: customMealForm.notes
                    }
                },
                total_calories: Math.round(calories),
                total_protein_g: protein,
                total_carbs_g: carbs,
                total_fat_g: fat,
                total_fiber_g: fiber,
                total_sugar_g: sugar,
                total_sodium_mg: sodium,
                notes: customMealForm.notes
            };

            // Add meal to meals table
            const { error: mealError } = await SupabaseService.addMeal(mealData);
            
            if (mealError) {
                console.error('Error adding meal:', mealError);
                setSubmitMessage({ text: 'Failed to add meal. Please try again.', type: 'error' });
                return;
            }

            // If "save meal for future references" is checked, also add to custom_meals table
            if (customMealForm.saveMeal) {
                // First check if this custom meal already exists for this user
                const { exists, error: checkError } = await SupabaseService.checkCustomMealExists(
                    user.id,
                    customMealForm.mealName.trim(),
                    calories,
                    protein,
                    carbs,
                    fat
                );

                if (checkError) {
                    console.error('Error checking custom meal existence:', checkError);
                    setSubmitMessage({ text: 'Meal added, but failed to save for future reference', type: 'info' });
                } else if (exists) {
                    setSubmitMessage({ text: 'Meal added! This meal is already saved for future reference.', type: 'success' });
                } else {
                    // Add to custom_meals table
                    const customMealData = {
                        name: customMealForm.mealName.trim(),
                        calories_per_100g: calories,
                        protein_g: protein,
                        carbohydrates_g: carbs,
                        fats_g: fat,
                        fiber_g: fiber,
                        free_sugar_g: sugar,
                        sodium_mg: sodium,
                        submitted_by: user.id,
                        status: 'pending' as const
                    };

                    const { error: customMealError } = await SupabaseService.addCustomMeal(customMealData);
                    
                    if (customMealError) {
                        console.error('Error adding custom meal:', customMealError);
                        setSubmitMessage({ text: 'Meal added, but failed to save for future reference', type: 'info' });
                    } else {
                        setSubmitMessage({ text: 'Meal added successfully and saved for future reference!', type: 'success' });
                    }
                }
            } else {
                setSubmitMessage({ text: 'Meal added successfully!', type: 'success' });
            }

            // Reset form
            setCustomMealForm({
                mealName: '',
                mealType: 'breakfast',
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                fiber: '',
                sugar: '',
                sodium: '',
                notes: '',
                time: '',
                saveMeal: false
            });

            // Refresh data to show the new meal
            await refreshData();

            // Refresh quick foods to potentially update most used meals
            if (user) {
                try {
                    const { data } = await SupabaseService.getQuickFoods(user.id, 8);
                    if (data) {
                        setQuickAddFoods(data);
                    }
                } catch (error) {
                    console.error('Failed to refresh quick foods:', error);
                }
            }

            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                setSubmitMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Error submitting custom meal:', error);
            setSubmitMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section ref={pageRef} id="add-meals" className="add-meals">
            <div className="add-meals__container">
                <div className="journal__header">
                    <h1 className="journal__title">🍽️ Add Meals</h1>
                    <div className="journal__date">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                <AutocompleteSearch
                    selectedMealType={selectedMealTypeForSearch}
                    setSelectedMealType={setSelectedMealTypeForSearch}
                    onMealAdd={addMealFromSearch}
                    submitMessage={submitMessage}
                />

                {/* Quick Actions */}
                <div className="add-meals__quick-actions">
                    <button
                        className="add-meals__quick-btn add-meals__quick-btn--primary"
                        onClick={() => {
                            setShowQuickAdd(!showQuickAdd);
                            if (!showQuickAdd) setShowCustomEntry(false);
                        }}
                    >
                        🍎 Quick Add Food
                    </button>
                    <button 
                        className="add-meals__quick-btn"
                        onClick={() => {
                            setShowCustomEntry(!showCustomEntry);
                            if (!showCustomEntry) setShowQuickAdd(false);
                        }}
                    >
                        📊 Custom Entry
                    </button>
                </div>

                <NutritionSummary nutritionSummary={nutritionSummary} />

                <QuickAddPanel
                    showQuickAdd={showQuickAdd}
                    setShowQuickAdd={setShowQuickAdd}
                    selectedMealType={selectedMealType}
                    setSelectedMealType={setSelectedMealType}
                    quickAddFoods={quickAddFoods}
                    isLoadingQuickFoods={isLoadingQuickFoods}
                    onAddMeal={addMeal}
                    isSubmitting={isSubmitting}
                />

                <CustomMealForm
                    showCustomEntry={showCustomEntry}
                    setShowCustomEntry={setShowCustomEntry}
                    customMealForm={customMealForm}
                    setCustomMealForm={setCustomMealForm}
                    onSubmit={handleCustomMealSubmit}
                    isSubmitting={isSubmitting}
                    submitMessage={submitMessage}
                />

                <MealTypeSection
                    todaysMeals={todaysMeals}
                    onRemoveMeal={removeMeal}
                    onAddMeal={handleMealTypeAdd}
                />
            </div>
        </section>
    );
};

export default AddMeals;