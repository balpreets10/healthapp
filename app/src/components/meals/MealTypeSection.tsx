import React, { useState } from 'react';
import { MealEntry, MealType } from '../../types/meal-types';

interface MealTypeSectionProps {
    todaysMeals: MealEntry[];
    onRemoveMeal: (mealId: string) => void;
    onAddMeal: (mealType: MealType) => void;
    onUpdateMealServing?: (mealId: string, newServingSize: number) => void;
}

const MealTypeSection: React.FC<MealTypeSectionProps> = ({
    todaysMeals,
    onRemoveMeal,
    onAddMeal,
    onUpdateMealServing
}) => {
    const [editingMealId, setEditingMealId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const getMealsByType = (type: MealType) => {
        return todaysMeals.filter(meal => meal.mealType === type);
    };

    const getMealTypeIcon = (mealType: MealType) => {
        switch (mealType) {
            case 'breakfast': return '🌅';
            case 'lunch': return '☀️';
            case 'dinner': return '🌙';
            case 'snack': return '🍿';
            default: return '';
        }
    };

    const startEditingServing = (meal: MealEntry) => {
        setEditingMealId(meal.id);
        setEditingValue((meal.servingSize || 100).toString());
    };

    const handleServingUpdate = (mealId: string) => {
        const newServingSize = parseFloat(editingValue);
        if (!isNaN(newServingSize) && newServingSize > 0 && onUpdateMealServing) {
            onUpdateMealServing(mealId, newServingSize);
        }
        setEditingMealId(null);
        setEditingValue('');
    };

    const cancelEditing = () => {
        setEditingMealId(null);
        setEditingValue('');
    };

    return (
        <div className="add-meals__meals-section">
            <h2 className="add-meals__section-title">Today's Meals</h2>

            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealType => {
                const typeMeals = getMealsByType(mealType);
                const typeCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);

                return (
                    <div key={mealType} className="add-meals__meal-type-section">
                        <div className="add-meals__meal-type-header">
                            <h3 className="add-meals__meal-type-title">
                                {getMealTypeIcon(mealType)}
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
                                            <div className="add-meals__meal-header">
                                                <span className="add-meals__meal-name">{meal.name}</span>
                                                <span className="add-meals__meal-calories">{Math.round(meal.calories)} cal</span>
                                            </div>
                                            <div className="add-meals__meal-macros">
                                                <div className="add-meals__macro-item">
                                                    <span className="add-meals__macro-label">Protein</span>
                                                    <span className="add-meals__macro-value">{meal.protein.toFixed(1)}g</span>
                                                </div>
                                                <div className="add-meals__macro-item">
                                                    <span className="add-meals__macro-label">Carbs</span>
                                                    <span className="add-meals__macro-value">{meal.carbs.toFixed(1)}g</span>
                                                </div>
                                                <div className="add-meals__macro-item">
                                                    <span className="add-meals__macro-label">Fat</span>
                                                    <span className="add-meals__macro-value">{meal.fat.toFixed(1)}g</span>
                                                </div>
                                            </div>
                                            <div className="add-meals__serving-info">
                                                <span className="add-meals__serving-label">Serving: </span>
                                                {meal.originalCaloriesPer100g && editingMealId === meal.id ? (
                                                    <div className="add-meals__serving-editor">
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
                                                            className="add-meals__serving-input"
                                                            step="0.1"
                                                            min="0.1"
                                                            autoFocus
                                                        />
                                                        <span>{meal.servingUnit || 'g'}</span>
                                                        <button 
                                                            onClick={() => handleServingUpdate(meal.id)}
                                                            className="add-meals__serving-save-btn"
                                                            title="Save serving size"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button 
                                                            onClick={cancelEditing}
                                                            className="add-meals__serving-cancel-btn"
                                                            title="Cancel editing"
                                                        >
                                                            ✗
                                                        </button>
                                                    </div>
                                                ) : meal.originalCaloriesPer100g ? (
                                                    <button
                                                        onClick={() => startEditingServing(meal)}
                                                        className="add-meals__serving-display"
                                                        title="Click to edit serving size"
                                                    >
                                                        {meal.servingSize || 100}{meal.servingUnit || 'g'} ✏️
                                                    </button>
                                                ) : (
                                                    <span className="add-meals__serving-default">
                                                        {meal.servingSize || 100}{meal.servingUnit || 'g'} (default)
                                                    </span>
                                                )}
                                                {meal.originalCaloriesPer100g && (
                                                    <span className="add-meals__per-100g-info">
                                                        ({Math.round(meal.originalCaloriesPer100g)} cal per 100g)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            className="add-meals__remove-btn"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete "${meal.name}"? This action cannot be undone.`)) {
                                                    onRemoveMeal(meal.id);
                                                }
                                            }}
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
                                    onClick={() => onAddMeal(mealType)}
                                >
                                    + Add {mealType}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MealTypeSection;