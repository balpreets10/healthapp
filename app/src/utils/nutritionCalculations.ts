export interface UserProfile {
    age: number;
    gender: 'male' | 'female';
    weight: number; // kg
    height: number; // cm
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
    goal: 'lose_weight' | 'maintain_weight' | 'gain_weight';
}

export interface NutritionGoals {
    goalCalories: number;
    goalProtein: number;
    goalCarbs: number;
    goalFat: number;
}

const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
} as const;

const GOAL_MULTIPLIERS = {
    lose_weight: 0.8,
    maintain_weight: 1.0,
    gain_weight: 1.2
} as const;

export const calculateBMR = (profile: Pick<UserProfile, 'age' | 'gender' | 'weight' | 'height'>): number => {
    const { age, gender, weight, height } = profile;
    
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
};

export const calculateTDEE = (profile: UserProfile): number => {
    const bmr = calculateBMR(profile);
    return bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel];
};

export const calculateNutritionGoals = (profile: UserProfile): NutritionGoals => {
    const tdee = calculateTDEE(profile);
    const goalCalories = Math.round(tdee * GOAL_MULTIPLIERS[profile.goal]);
    
    const proteinCaloriesPerKg = profile.goal === 'gain_weight' ? 2.2 : 1.6;
    const goalProtein = Math.round(profile.weight * proteinCaloriesPerKg);
    
    const fatPercentage = 0.25;
    const goalFat = Math.round((goalCalories * fatPercentage) / 9);
    
    const proteinCalories = goalProtein * 4;
    const fatCalories = goalFat * 9;
    const remainingCalories = goalCalories - proteinCalories - fatCalories;
    const goalCarbs = Math.round(remainingCalories / 4);
    
    return {
        goalCalories,
        goalProtein,
        goalCarbs,
        goalFat
    };
};

export const getDefaultUserProfile = (): UserProfile => ({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderately_active',
    goal: 'maintain_weight'
});

export const getProgressPercentage = (current: number, goal: number): number => {
    return Math.min((current / goal) * 100, 100);
};

export const calculateMacroRatio = (macro: number, totalCalories: number): number => {
    const macroCalories = macro * (macro === totalCalories ? 1 : 4);
    return totalCalories > 0 ? Math.round((macroCalories / totalCalories) * 100) : 0;
};

export const calculateAverageCaloriesPerMeal = (totalCalories: number, mealCount: number): number => {
    return mealCount > 0 ? Math.round(totalCalories / mealCount) : 0;
};