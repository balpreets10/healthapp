import React, { useEffect } from 'react';
import { CustomMealForm as CustomMealFormType, MealType } from '../../types/meal-types';
import { calculateCaloriesFromMacros } from '../../utils/nutritionCalculations';

interface CustomMealFormProps {
    showCustomEntry: boolean;
    setShowCustomEntry: (show: boolean) => void;
    customMealForm: CustomMealFormType;
    setCustomMealForm: React.Dispatch<React.SetStateAction<CustomMealFormType>>;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    submitMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
}

const CustomMealForm: React.FC<CustomMealFormProps> = ({
    showCustomEntry,
    setShowCustomEntry,
    customMealForm,
    setCustomMealForm,
    onSubmit,
    isSubmitting,
    submitMessage
}) => {
    useEffect(() => {
        const protein = parseFloat(customMealForm.protein) || 0;
        const carbs = parseFloat(customMealForm.carbs) || 0;
        const fat = parseFloat(customMealForm.fat) || 0;
        const sugar = parseFloat(customMealForm.sugar) || 0;

        if ((protein > 0 || carbs > 0 || fat > 0 || sugar > 0)) {
            const calculatedCalories = calculateCaloriesFromMacros(protein, carbs, fat, sugar);
            setCustomMealForm(prev => ({
                ...prev, 
                calories: calculatedCalories.toString()
            }));
        }
    }, [customMealForm.protein, customMealForm.carbs, customMealForm.fat, customMealForm.sugar, setCustomMealForm]);

    if (!showCustomEntry) {
        return null;
    }

    return (
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

            <form className="add-meals__custom-form" onSubmit={onSubmit}>
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
                        onChange={(e) => setCustomMealForm(prev => ({...prev, mealType: e.target.value as MealType}))}
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

                <div className="add-meals__form-group">
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

                <div className="add-meals__nutrition-inputs">
                    <div className="add-meals__form-group">
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

                    <div className="add-meals__form-group">
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

                    <div className="add-meals__form-group">
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

                    <div className="add-meals__form-group">
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

                    <div className="add-meals__form-group">
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
    );
};

export default CustomMealForm;