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
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
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
            
            let additionalData = { target_weight_kg: 0, target_duration: 0, target_duration_unit: 'weeks' as const };
            try {
                const stored = localStorage.getItem(`profile_extra_${user.id}`);
                if (stored) {
                    additionalData = JSON.parse(stored);
                }
            } catch (e) {
                console.warn('Failed to load additional profile data:', e);
            }

            if (data && data.height_cm && data.weight_kg && additionalData.target_weight_kg && additionalData.target_duration) {
                const userProfile: UserProfile = {
                    height_cm: data.height_cm,
                    weight_kg: data.weight_kg,
                    target_weight_kg: additionalData.target_weight_kg,
                    target_duration: additionalData.target_duration,
                    target_duration_unit: additionalData.target_duration_unit,
                    activity_level: data.activity_level || 'moderate',
                    age: 30, 
                    gender: 'male' 
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

    const loadTodaysMeals = () => {
        const mockMeals: MealData[] = [
            {
                id: '1',
                name: 'Oatmeal with Berries',
                calories: 320,
                protein: 12,
                carbs: 58,
                fat: 6,
                mealType: 'breakfast',
                time: '8:00 AM'
            },
            {
                id: '2',
                name: 'Grilled Chicken Salad',
                calories: 450,
                protein: 35,
                carbs: 25,
                fat: 18,
                mealType: 'lunch',
                time: '12:30 PM'
            },
            {
                id: '3',
                name: 'Greek Yogurt',
                calories: 150,
                protein: 15,
                carbs: 12,
                fat: 5,
                mealType: 'snack',
                time: '3:15 PM'
            }
        ];
        
        setTodaysMeals(mockMeals);
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

    const refreshData = () => {
        loadProfile();
        loadTodaysMeals();
    };

    return {
        calorieData,
        todaysMeals,
        profile,
        refreshData
    };
};