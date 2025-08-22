import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useContentManager } from '../hooks/useContentManager';
import { useCalorieTracker } from '../hooks/useCalorieTracker';
import { useAuth } from '../hooks/useAuth';
import SupabaseService from '../services/SupabaseService';
import { calculateCaloriesFromMacros } from '../utils/nutritionCalculations';
import './AddMeals.css';

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

interface SearchResult {
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

const AddMeals: React.FC = () => {
    const pageRef = useRef<HTMLElement>(null);
    const { setCurrentSection } = useContentManager();
    const { todaysMeals, calorieData, refreshData } = useCalorieTracker();
    const { user } = useAuth();

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMealType, setSelectedMealType] = useState<MealEntry['mealType']>('breakfast');
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showCustomEntry, setShowCustomEntry] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Autocomplete search state
    const [autocompleteQuery, setAutocompleteQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [selectedMealTypeForSearch, setSelectedMealTypeForSearch] = useState<MealEntry['mealType']>('breakfast');
    const [isSearching, setIsSearching] = useState(false);
    const autocompleteRef = useRef<HTMLDivElement>(null);

    // Custom entry form state
    const [customMealForm, setCustomMealForm] = useState({
        mealName: '',
        mealType: 'breakfast' as MealEntry['mealType'],
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
    const nutritionSummary: NutritionSummary = {
        totalCalories: calorieData.currentCalories,
        totalProtein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0),
        goalCalories: calorieData.targetCalories,
        goalProtein: Math.round(calorieData.targetCalories * 0.3 / 4), // 30% of calories from protein
        goalCarbs: Math.round(calorieData.targetCalories * 0.45 / 4), // 45% of calories from carbs
        goalFat: Math.round(calorieData.targetCalories * 0.25 / 9)    // 25% of calories from fat
    };

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
    }, [setCurrentSection]);

    // Debounced search function
    const debouncedSearch = useCallback(
        async (query: string) => {
            if (!query.trim() || !user) {
                setSearchResults([]);
                setShowAutocomplete(false);
                return;
            }

            setIsSearching(true);
            try {
                const { data, error } = await SupabaseService.searchFoodsAndCustomMeals(user.id, query.trim(), 5);
                
                if (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } else {
                    setSearchResults(data);
                    setShowAutocomplete(data.length > 0);
                }
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        [user]
    );

    // Debounce effect for search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (autocompleteQuery.length >= 2) {
                debouncedSearch(autocompleteQuery);
            } else {
                setSearchResults([]);
                setShowAutocomplete(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [autocompleteQuery, debouncedSearch]);

    // Handle click outside autocomplete
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
                setShowAutocomplete(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-calculate calories when macronutrients change
    useEffect(() => {
        const protein = parseFloat(customMealForm.protein) || 0;
        const carbs = parseFloat(customMealForm.carbs) || 0;
        const fat = parseFloat(customMealForm.fat) || 0;
        const sugar = parseFloat(customMealForm.sugar) || 0;

        // Only auto-calculate if at least one macro has a value and calories field is empty or was auto-calculated
        if ((protein > 0 || carbs > 0 || fat > 0 || sugar > 0)) {
            const calculatedCalories = calculateCaloriesFromMacros(protein, carbs, fat, sugar);
            setCustomMealForm(prev => ({
                ...prev, 
                calories: calculatedCalories.toString()
            }));
        }
    }, [customMealForm.protein, customMealForm.carbs, customMealForm.fat, customMealForm.sugar]);


    // Add meal function - TODO: Implement actual database insertion
    const addMeal = async (food: QuickAddFood) => {
        // TODO: Add meal to database via SupabaseService
        console.log('Adding meal to database:', {
            name: food.name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            mealType: selectedMealType
        });
        
        // Refresh data after adding
        await refreshData();
        setShowQuickAdd(false);
    };

    // Add meal from search result
    const addMealFromSearch = async (searchResult: SearchResult) => {
        if (!user) return;

        try {
            const currentDate = new Date();
            const dateStr = currentDate.toISOString().split('T')[0];
            const timeStr = currentDate.toTimeString().split(' ')[0].substring(0, 5);

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
                setAutocompleteQuery('');
                setShowAutocomplete(false);
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

    // Filter foods based on search
    const filteredFoods = quickAddFoods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get meals by type for today from database data
    const getMealsByType = (type: MealEntry['mealType']) => {
        return todaysMeals.filter(meal => meal.mealType === type);
    };

    // Calculate progress percentage
    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
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
            const dateStr = currentDate.toISOString().split('T')[0];
            const timeStr = customMealForm.time || currentDate.toTimeString().split(' ')[0].substring(0, 5);

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

                {/* Autocomplete Search Bar */}
                <div className="add-meals__search-section">
                    <div className="add-meals__search-container" ref={autocompleteRef}>
                        <div className="add-meals__search-input-row">
                            <input
                                type="text"
                                placeholder="Search foods and meals..."
                                value={autocompleteQuery}
                                onChange={(e) => {
                                    setAutocompleteQuery(e.target.value);
                                    if (e.target.value.length >= 2) {
                                        setShowAutocomplete(true);
                                    }
                                }}
                                onFocus={() => {
                                    if (autocompleteQuery.length >= 2 && searchResults.length > 0) {
                                        setShowAutocomplete(true);
                                    }
                                }}
                                className="add-meals__autocomplete-input"
                            />
                            <select
                                value={selectedMealTypeForSearch}
                                onChange={(e) => setSelectedMealTypeForSearch(e.target.value as MealEntry['mealType'])}
                                className="add-meals__meal-type-select"
                            >
                                <option value="breakfast">🌅 Breakfast</option>
                                <option value="lunch">☀️ Lunch</option>
                                <option value="dinner">🌙 Dinner</option>
                                <option value="snack">🍿 Snack</option>
                            </select>
                        </div>

                        {/* Autocomplete Dropdown */}
                        {showAutocomplete && (
                            <div className="add-meals__autocomplete-dropdown">
                                {isSearching ? (
                                    <div className="add-meals__autocomplete-loading">
                                        <span>Searching...</span>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((result) => (
                                        <div
                                            key={`${result.source}-${result.id}`}
                                            className="add-meals__autocomplete-item"
                                            onClick={() => addMealFromSearch(result)}
                                        >
                                            <div className="add-meals__autocomplete-item-content">
                                                <div className="add-meals__autocomplete-item-header">
                                                    <span className="add-meals__autocomplete-item-name">{result.name}</span>
                                                    <span className="add-meals__autocomplete-item-source">
                                                        {result.source === 'custom_meals' ? '👤 Custom' : '🍎 Standard'}
                                                    </span>
                                                </div>
                                                <div className="add-meals__autocomplete-item-nutrition">
                                                    <span>{Math.round(result.calories_per_100g)} cal</span>
                                                    <span>{result.protein_g}g protein</span>
                                                    <span>{result.carbohydrates_g}g carbs</span>
                                                    <span>{result.fats_g}g fat</span>
                                                </div>
                                            </div>
                                            <button className="add-meals__autocomplete-add-btn">
                                                +
                                            </button>
                                        </div>
                                    ))
                                ) : autocompleteQuery.length >= 2 ? (
                                    <div className="add-meals__autocomplete-empty">
                                        <span>No foods found for "{autocompleteQuery}"</span>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    {/* Display any messages */}
                    {submitMessage && (
                        <div className={`add-meals__message add-meals__message--${submitMessage.type}`}>
                            {submitMessage.text}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="add-meals__quick-actions">
                    <button
                        className="add-meals__quick-btn add-meals__quick-btn--primary"
                        onClick={() => setShowQuickAdd(!showQuickAdd)}
                    >
                        🍎 Quick Add Food
                    </button>
                    <button 
                        className="add-meals__quick-btn"
                        onClick={() => setShowCustomEntry(!showCustomEntry)}
                    >
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

                {/* Custom Entry Panel */}
                {showCustomEntry && (
                    <div className="add-meals__custom-entry-panel">
                        <div className="add-meals__panel-header">
                            <h3 className="add-meals__panel-title">Custom Meal Entry</h3>
                            <button
                                className="add-meals__close-btn"
                                onClick={() => setShowCustomEntry(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form className="add-meals__custom-form" onSubmit={handleCustomMealSubmit}>
                            {submitMessage && (
                                <div className={`add-meals__message add-meals__message--${submitMessage.type}`}>
                                    {submitMessage.text}
                                </div>
                            )}
                            
                            <div className="add-meals__form-group">
                                <label className="add-meals__form-label">Meal Name *</label>
                                <input
                                    type="text"
                                    className="add-meals__form-input"
                                    value={customMealForm.mealName}
                                    onChange={(e) => setCustomMealForm(prev => ({...prev, mealName: e.target.value}))}
                                    placeholder="Enter meal name"
                                    required
                                />
                            </div>

                            <div className="add-meals__form-group">
                                <label className="add-meals__form-label">Meal Type *</label>
                                <select
                                    className="add-meals__form-select"
                                    value={customMealForm.mealType}
                                    onChange={(e) => setCustomMealForm(prev => ({...prev, mealType: e.target.value as MealEntry['mealType']}))}
                                >
                                    <option value="breakfast">🌅 Breakfast</option>
                                    <option value="lunch">☀️ Lunch</option>
                                    <option value="dinner">🌙 Dinner</option>
                                    <option value="snack">🍿 Snack</option>
                                </select>
                            </div>

                            <div className="add-meals__form-group">
                                <label className="add-meals__form-label">Time</label>
                                <input
                                    type="time"
                                    className="add-meals__form-input"
                                    value={customMealForm.time}
                                    onChange={(e) => setCustomMealForm(prev => ({...prev, time: e.target.value}))}
                                />
                            </div>

                            <div className="add-meals__form-row">
                                <div className="add-meals__form-group add-meals__form-group--half">
                                    <label className="add-meals__form-label">
                                        Calories * 
                                        <span className="add-meals__form-label-note">
                                            (auto-calculated from macros)
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        className="add-meals__form-input add-meals__form-input--auto-calculated"
                                        value={customMealForm.calories}
                                        onChange={(e) => setCustomMealForm(prev => ({...prev, calories: e.target.value}))}
                                        placeholder="Enter macros to auto-calculate"
                                        min="0"
                                        step="1"
                                        required
                                    />
                                </div>

                                <div className="add-meals__form-group add-meals__form-group--half">
                                    <label className="add-meals__form-label">Protein (g)</label>
                                    <input
                                        type="number"
                                        className="add-meals__form-input"
                                        value={customMealForm.protein}
                                        onChange={(e) => setCustomMealForm(prev => ({...prev, protein: e.target.value}))}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="add-meals__form-row">
                                <div className="add-meals__form-group add-meals__form-group--half">
                                    <label className="add-meals__form-label">Carbs (g)</label>
                                    <input
                                        type="number"
                                        className="add-meals__form-input"
                                        value={customMealForm.carbs}
                                        onChange={(e) => setCustomMealForm(prev => ({...prev, carbs: e.target.value}))}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>

                                <div className="add-meals__form-group add-meals__form-group--half">
                                    <label className="add-meals__form-label">Fat (g)</label>
                                    <input
                                        type="number"
                                        className="add-meals__form-input"
                                        value={customMealForm.fat}
                                        onChange={(e) => setCustomMealForm(prev => ({...prev, fat: e.target.value}))}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="add-meals__form-row">
                                <div className="add-meals__form-group add-meals__form-group--half">
                                    <label className="add-meals__form-label">Fiber (g)</label>
                                    <input
                                        type="number"
                                        className="add-meals__form-input"
                                        value={customMealForm.fiber}
                                        onChange={(e) => setCustomMealForm(prev => ({...prev, fiber: e.target.value}))}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>

                                <div className="add-meals__form-group add-meals__form-group--half">
                                    <label className="add-meals__form-label">Sugar (g)</label>
                                    <input
                                        type="number"
                                        className="add-meals__form-input"
                                        value={customMealForm.sugar}
                                        onChange={(e) => setCustomMealForm(prev => ({...prev, sugar: e.target.value}))}
                                        placeholder="0"
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="add-meals__form-group">
                                <label className="add-meals__form-label">Sodium (mg)</label>
                                <input
                                    type="number"
                                    className="add-meals__form-input"
                                    value={customMealForm.sodium}
                                    onChange={(e) => setCustomMealForm(prev => ({...prev, sodium: e.target.value}))}
                                    placeholder="0"
                                    min="0"
                                    step="0.1"
                                />
                            </div>

                            <div className="add-meals__form-group">
                                <label className="add-meals__form-label">Notes</label>
                                <textarea
                                    className="add-meals__form-textarea"
                                    value={customMealForm.notes}
                                    onChange={(e) => setCustomMealForm(prev => ({...prev, notes: e.target.value}))}
                                    placeholder="Additional notes about the meal..."
                                    rows={3}
                                />
                            </div>

                            <div className="add-meals__form-group">
                                <label className="add-meals__form-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="add-meals__form-checkbox"
                                        checked={customMealForm.saveMeal}
                                        onChange={(e) => setCustomMealForm(prev => ({...prev, saveMeal: e.target.checked}))}
                                    />
                                    <span className="add-meals__form-checkbox-text">
                                        Save meal for future references
                                    </span>
                                </label>
                            </div>

                            <div className="add-meals__form-actions">
                                <button
                                    type="submit"
                                    className="add-meals__add-meal-btn add-meals__add-meal-btn--primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding Meal...' : 'Add Meal'}
                                </button>
                            </div>
                        </form>
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