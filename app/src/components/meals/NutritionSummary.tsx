import React from 'react';
import { NutritionSummary as NutritionSummaryType } from '../../types/meal-types';

interface NutritionSummaryProps {
    nutritionSummary: NutritionSummaryType;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ nutritionSummary }) => {
    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    return (
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
    );
};

export default NutritionSummary;