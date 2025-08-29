import React from 'react';
import { MealEntry, MealType } from '../../types/meal-types';

interface MealTypeSectionProps {
    todaysMeals: MealEntry[];
    onRemoveMeal: (mealId: string) => void;
    onAddMeal: (mealType: MealType) => void;
}

const MealTypeSection: React.FC<MealTypeSectionProps> = ({
    todaysMeals,
    onRemoveMeal,
    onAddMeal
}) => {
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
                                            <span className="add-meals__meal-name">{meal.name}</span>
                                            <span className="add-meals__meal-nutrition">
                                                {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                                            </span>
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