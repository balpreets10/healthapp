import React, { useState } from 'react';
import { QuickAddFood, MealType } from '../../types/meal-types';

interface QuickAddPanelProps {
    showQuickAdd: boolean;
    setShowQuickAdd: (show: boolean) => void;
    selectedMealType: MealType;
    setSelectedMealType: (mealType: MealType) => void;
    quickAddFoods: QuickAddFood[];
    isLoadingQuickFoods: boolean;
    onAddMeal: (food: QuickAddFood) => void;
    isSubmitting: boolean;
}

const QuickAddPanel: React.FC<QuickAddPanelProps> = ({
    showQuickAdd,
    setShowQuickAdd,
    selectedMealType,
    setSelectedMealType,
    quickAddFoods,
    isLoadingQuickFoods,
    onAddMeal,
    isSubmitting
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFoods = quickAddFoods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!showQuickAdd) {
        return null;
    }

    return (
        <div className="add-meals__quick-add-panel">
            <div className="add-meals__panel-header">
                <h3 className="add-meals__panel-title">
                    {isLoadingQuickFoods ? 'Loading Foods...' : 'Quick Add Foods'}
                    {!isLoadingQuickFoods && (
                        <span style={{fontSize: '0.8em', fontWeight: 'normal', opacity: 0.7}}>
                            {' • Based on your eating habits'}
                        </span>
                    )}
                </h3>
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
                    onChange={(e) => setSelectedMealType(e.target.value as MealType)}
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
                {isLoadingQuickFoods ? (
                    <div className="add-meals__loading-state">
                        <span>Loading personalized foods...</span>
                    </div>
                ) : filteredFoods.length > 0 ? (
                    filteredFoods.map((food, index) => (
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
                                onClick={() => onAddMeal(food)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '...' : '+'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="add-meals__empty-state">
                        <span>No foods available</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickAddPanel;