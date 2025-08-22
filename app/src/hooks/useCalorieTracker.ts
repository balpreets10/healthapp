import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import SupabaseService from '../services/SupabaseService';
import CalorieCalculatorService, { CalorieCalculation, UserProfile } from '../services/CalorieCalculatorService';

interface CalorieTrackerData {
    targetCalories: number;
    currentCalories: number;
    remainingCalories: number;
    percentageConsumed: number;
    calculation?: CalorieCalculation;
    recommendation?: {
        message: string;
        type: 'gain' | 'loss' | 'maintain';
        weeklyGoal: string;
    };
    hasProfile: boolean;
    isLoading: boolean;
}

interface MealData {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
}

interface DatabaseMeal {
    id: string;
    user_id: string;
    meal_type: string;
    meal_name: string;
    date: string;
    time: string;
    foods: any; // JSONB field
    total_calories: number;
    total_protein_g: number;
    total_carbs_g: number;
    total_fat_g: number;
    total_fiber_g?: number;
    total_sugar_g?: number;
    total_sodium_mg?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export const useCalorieTracker = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [todaysMeals, setTodaysMeals] = useState<MealData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadProfile = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await SupabaseService.getUserProfile(user.id);
            
            if (data && data.height_cm && data.weight_kg && data.target_weight_kg && data.target_duration && data.age && data.gender) {
                const userProfile: UserProfile = {
                    height_cm: data.height_cm,
                    weight_kg: data.weight_kg,
                    target_weight_kg: data.target_weight_kg,
                    target_duration: data.target_duration,
                    target_duration_unit: data.target_duration_unit || 'weeks',
                    activity_level: data.activity_level || 'moderate',
                    age: data.age,
                    gender: data.gender,
                    orientation: data.orientation || ''
                };
                
                setProfile(userProfile);
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTodaysMeals = async () => {
        if (!user) {
            setTodaysMeals([]);
            return;
        }

        try {
            const { data, error } = await SupabaseService.getTodaysMeals(user.id);
            
            if (error) {
                console.error('Error loading today\'s meals:', error);
                setTodaysMeals([]);
                return;
            }

            // Transform database meal data to match the MealData interface
            const transformedMeals: MealData[] = data.map((meal: DatabaseMeal) => ({
                id: meal.id,
                name: meal.meal_name,
                calories: meal.total_calories,
                protein: meal.total_protein_g,
                carbs: meal.total_carbs_g,
                fat: meal.total_fat_g,
                fiber: meal.total_fiber_g || 0,
                mealType: meal.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
                time: meal.time ? new Date(`1970-01-01T${meal.time}`).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }) : 'Not specified'
            }));

            setTodaysMeals(transformedMeals);
        } catch (error) {
            console.error('Failed to load today\'s meals:', error);
            setTodaysMeals([]);
        }
    };

    useEffect(() => {
        loadProfile();
        loadTodaysMeals();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const calorieData: CalorieTrackerData = useMemo(() => {
        if (!profile) {
            return {
                targetCalories: 0,
                currentCalories: 0,
                remainingCalories: 0,
                percentageConsumed: 0,
                hasProfile: false,
                isLoading
            };
        }

        const validation = CalorieCalculatorService.validateProfile(profile);
        if (!validation.isValid) {
            return {
                targetCalories: 0,
                currentCalories: 0,
                remainingCalories: 0,
                percentageConsumed: 0,
                hasProfile: false,
                isLoading
            };
        }

        const calculation = CalorieCalculatorService.calculateTargetCalories(profile);
        const recommendation = CalorieCalculatorService.getCalorieRecommendation(calculation);
        
        const currentCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const remainingCalories = calculation.targetCalories - currentCalories;
        const percentageConsumed = calculation.targetCalories > 0 
            ? Math.round((currentCalories / calculation.targetCalories) * 100)
            : 0;

        return {
            targetCalories: calculation.targetCalories,
            currentCalories,
            remainingCalories,
            percentageConsumed,
            calculation,
            recommendation,
            hasProfile: true,
            isLoading
        };
    }, [profile, todaysMeals, isLoading]);

    const refreshData = async () => {
        await loadProfile();
        await loadTodaysMeals();
    };

    return {
        calorieData,
        todaysMeals,
        profile,
        refreshData
    };
};