interface UserProfile {
    height_cm: number;
    weight_kg: number;
    target_weight_kg: number;
    target_duration: number;
    target_duration_unit: 'days' | 'weeks' | 'months';
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    age?: number;
    gender?: 'male' | 'female';
}

interface CalorieCalculation {
    bmr: number;
    tdee: number;
    targetCalories: number;
    weightChangePerWeek: number;
    dailyCalorieDeficit: number;
}

class CalorieCalculatorService {
    private static readonly ACTIVITY_MULTIPLIERS = {
        sedentary: 1.05,
        light: 1.2,
        moderate: 1.375,
        active: 1.55,
        very_active: 1.725
    } as const;

    private static readonly CALORIES_PER_KG = 7700;

    static calculateBMR(profile: UserProfile): number {
        const { height_cm, weight_kg, age = 30, gender = 'male' } = profile;

        if (gender === 'male') {
            return (5 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5;
        } else {
            return (5 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161;
        }
    }

    static calculateTDEE(bmr: number, activityLevel: UserProfile['activity_level']): number {
        const multiplier = this.ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
        return Math.round(bmr * multiplier);
    }

    private static convertDurationToWeeks(duration: number, unit: UserProfile['target_duration_unit']): number {
        switch (unit) {
            case 'days':
                return duration / 7;
            case 'weeks':
                return duration;
            case 'months':
                return duration * 4.33;
            default:
                return duration;
        }
    }

    static calculateTargetCalories(profile: UserProfile): CalorieCalculation {
        const bmr = this.calculateBMR(profile);
        const tdee = this.calculateTDEE(bmr, profile.activity_level);

        const { weight_kg, target_weight_kg, target_duration, target_duration_unit } = profile;

        const weightChangeKg = target_weight_kg - weight_kg;
        const durationWeeks = this.convertDurationToWeeks(target_duration, target_duration_unit);

        const weightChangePerWeek = durationWeeks > 0 ? weightChangeKg / durationWeeks : 0;

        const dailyCalorieDeficit = (weightChangePerWeek * this.CALORIES_PER_KG) / 7;

        let targetCalories = tdee + dailyCalorieDeficit;

        const minCalories = profile.gender === 'male' ? 1300 : 1100;
        if (targetCalories < minCalories) {
            targetCalories = minCalories;
        }

        return {
            bmr: Math.round(bmr),
            tdee,
            targetCalories: Math.round(targetCalories),
            weightChangePerWeek: Math.round(weightChangePerWeek * 100) / 100,
            dailyCalorieDeficit: Math.round(dailyCalorieDeficit)
        };
    }

    static getCalorieRecommendation(calculation: CalorieCalculation): {
        message: string;
        type: 'gain' | 'loss' | 'maintain';
        weeklyGoal: string;
    } {
        const { weightChangePerWeek, targetCalories, tdee } = calculation;

        if (weightChangePerWeek > 0) {
            return {
                message: `To gain ${Math.abs(weightChangePerWeek)}kg per week, aim for ${targetCalories} calories daily`,
                type: 'gain',
                weeklyGoal: `+${Math.abs(weightChangePerWeek)}kg per week`
            };
        } else if (weightChangePerWeek < 0) {
            return {
                message: `To lose ${Math.abs(weightChangePerWeek)}kg per week, aim for ${targetCalories} calories daily`,
                type: 'loss',
                weeklyGoal: `-${Math.abs(weightChangePerWeek)}kg per week`
            };
        } else {
            return {
                message: `To maintain your current weight, aim for ${tdee} calories daily`,
                type: 'maintain',
                weeklyGoal: 'Maintain current weight'
            };
        }
    }

    static validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!profile.height_cm || profile.height_cm <= 0) {
            errors.push('Height is required');
        }

        if (!profile.weight_kg || profile.weight_kg <= 0) {
            errors.push('Current weight is required');
        }

        if (!profile.target_weight_kg || profile.target_weight_kg <= 0) {
            errors.push('Target weight is required');
        }

        if (!profile.target_duration || profile.target_duration <= 0) {
            errors.push('Target duration is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export default CalorieCalculatorService;
export type { UserProfile, CalorieCalculation };