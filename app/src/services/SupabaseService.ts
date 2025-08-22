// services/SupabaseService.ts - Fixed Google OAuth configuration
import { createClient, SupabaseClient, Session, User, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { config } from '../config';
import { getTodayDateString } from '../utils/dateUtils';

interface AuthResponse {
    data?: any;
    error?: AuthError | null;
}

interface GoogleAuthResponse {
    data?: any;
    error?: AuthError | null;
    loading?: boolean;
}

interface SessionResponse {
    session: Session | null;
    error?: AuthError | null;
}

interface UserResponse {
    user: User | null;
    error?: AuthError | null;
}

class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(
            config.supabase.url,
            config.supabase.anonKey,
            {
                auth: {
                    ...config.supabase.auth,
                    flowType: 'pkce',
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            }
        );

        console.log('SupabaseService initialized');
        console.log('URL:', config.supabase.url);
        console.log('Redirect URL will be:', config.supabase.auth.redirectTo);
    }

    // ===== GOOGLE OAUTH WITH POPUP ===== //
    async signInWithGoogle(): Promise<AuthResponse> {
        try {
            console.log('Initiating Google OAuth...');

            const { data, error } = await this.client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    scopes: 'openid email profile'
                }
            });

            if (error) {
                console.error('Google OAuth error:', error);
                return { data, error };
            }

            console.log('Google OAuth initiated successfully');
            return { data, error };

        } catch (err) {
            console.error('Google sign-in failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    // ===== GOOGLE OAUTH WITH POPUP (Safe implementation) ===== //
    async signInWithGooglePopup(): Promise<AuthResponse> {
        try {
            console.log('Initiating Google OAuth via popup...');

            // Use the standard Supabase OAuth flow which handles COOP correctly
            const { data, error } = await this.client.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    scopes: 'openid email profile'
                }
            });

            if (error) {
                console.error('Google OAuth popup error:', error);
                return { data, error };
            }

            console.log('Google OAuth popup initiated successfully');
            return { data, error };

        } catch (err) {
            console.error('Google popup sign-in failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    // ===== POPUP CALLBACK HANDLER ===== //
    private async handlePopupCallback(): Promise<AuthResponse> {
        try {
            // Wait a moment for the session to be established
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { data, error } = await this.client.auth.getSession();
            
            if (error) {
                return { data: null, error };
            }
            
            if (data.session) {
                return { data: data.session, error: null };
            }
            
            return { 
                data: null, 
                error: { 
                    message: 'No session found after authentication',
                    name: 'NoSession',
                    status: 401
                } as AuthError 
            };
        } catch (err) {
            console.error('Popup callback handling failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    // ===== EMAIL/PASSWORD AUTHENTICATION ===== //
    async signInWithEmail(email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            });

            if (!error && data.session && rememberMe) {
                try {
                    await this.extendSessionDuration(data.session);
                } catch (extendError) {
                    console.warn('Failed to extend session duration:', extendError);
                }
            }

            return { data, error };

        } catch (err) {
            console.error('Email sign-in failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    async signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.client.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: config.supabase.auth.redirectTo,
                    data: {
                        email_verify: true
                    }
                }
            });
            return { data, error };

        } catch (err) {
            console.error('Email sign-up failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    // ===== SESSION MANAGEMENT ===== //
    async signOut(): Promise<{ error?: AuthError | null }> {
        try {
            this.clearExtendedSession();
            const { error } = await this.client.auth.signOut();

            if (error) {
                console.error('Sign out error:', error);
            } else {
                console.log('Signed out successfully');
            }

            return { error };

        } catch (err) {
            console.error('Sign out failed:', err);
            const error = err as AuthError;
            return { error };
        }
    }

    async getSession(): Promise<SessionResponse> {
        try {
            const { data: { session }, error } = await this.client.auth.getSession();
            return { session, error };
        } catch (err) {
            console.error('Get session failed:', err);
            const error = err as AuthError;
            return { session: null, error };
        }
    }

    async getUser(): Promise<UserResponse> {
        try {
            const { data: { user }, error } = await this.client.auth.getUser();
            return { user, error };
        } catch (err) {
            console.error('Get user failed:', err);
            const error = err as AuthError;
            return { user: null, error };
        }
    }

    async refreshSession(): Promise<SessionResponse> {
        try {
            const { data: { session }, error } = await this.client.auth.refreshSession();
            return { session, error };
        } catch (err) {
            console.error('Refresh session failed:', err);
            const error = err as AuthError;
            return { session: null, error };
        }
    }

    private async extendSessionDuration(session: Session): Promise<void> {
        try {
            const extendedExpiry = new Date();
            extendedExpiry.setDate(extendedExpiry.getDate() + 30);

            localStorage.setItem('extended_session', JSON.stringify({
                expiry: extendedExpiry.toISOString(),
                userId: session.user.id
            }));
        } catch (error) {
            console.warn('Failed to set extended session:', error);
        }
    }

    // ===== PASSWORD RESET ===== //
    async resetPassword(email: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
                redirectTo: `${config.app.baseUrl}/auth/reset-password`
            });
            return { data, error };
        } catch (err) {
            console.error('Password reset failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    async updatePassword(newPassword: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.client.auth.updateUser({
                password: newPassword
            });
            return { data, error };
        } catch (err) {
            console.error('Password update failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    // ===== EMAIL VERIFICATION ===== //
    async resendEmailVerification(email: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.client.auth.resend({
                type: 'signup',
                email,
                options: {
                    emailRedirectTo: config.supabase.auth.redirectTo
                }
            });
            return { data, error };
        } catch (err) {
            console.error('Email verification resend failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    // ===== AUTH STATE LISTENER ===== //
    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void): () => void {
        const { data: { subscription } } = this.client.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email || 'No user');
            callback(event, session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }

    // ===== USER REGISTRATION ===== //
    async registerUser(user: User): Promise<{ success: boolean; error?: string }> {
        try {
            console.log('Starting user registration for:', user.email);

            // Check if user profile already exists
            const { data: existingProfile, error: checkError } = await this.client
                .from('user_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error checking existing profile:', checkError);
                return { success: false, error: 'Failed to check existing user profile' };
            }

            if (existingProfile) {
                console.log('User profile already exists, skipping registration');
                return { success: true };
            }

            // Create user profile
            const profileData = {
                user_id: user.id,
                full_name: user.user_metadata?.full_name || 
                          user.user_metadata?.name || 
                          user.email?.split('@')[0],
                avatar_url: user.user_metadata?.avatar_url || 
                           user.user_metadata?.picture
            };

            const { error: profileError } = await this.client
                .from('user_profiles')
                .insert([profileData]);

            if (profileError) {
                console.error('Failed to create user profile:', profileError);
                return { success: false, error: 'Failed to create user profile' };
            }

            // Check if user role already exists
            const { data: existingRole, error: roleCheckError } = await this.client
                .from('user_roles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (roleCheckError && roleCheckError.code !== 'PGRST116') {
                console.error('Error checking existing role:', roleCheckError);
                return { success: false, error: 'Failed to check existing user role' };
            }

            if (!existingRole) {
                // Create user role
                const { error: roleError } = await this.client
                    .from('user_roles')
                    .insert([{
                        user_id: user.id,
                        role: 'user'
                    }]);

                if (roleError) {
                    console.error('Failed to create user role:', roleError);
                    return { success: false, error: 'Failed to create user role' };
                }
            }

            console.log('User registration completed successfully');
            return { success: true };

        } catch (error) {
            console.error('User registration failed:', error);
            return { success: false, error: 'Unexpected error during user registration' };
        }
    }

    // ===== ADMIN ROLE CHECK ===== //
    async isAdmin(userId: string): Promise<boolean> {
        try {
            const { data, error } = await this.client
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) {
                console.warn('Admin check error:', error);
                return false;
            }

            // Check if user has admin role
            return data?.role === 'admin';
        } catch (error) {
            console.warn('Failed to check admin status:', error);
            return false;
        }
    }

    // ===== USER PROFILE MANAGEMENT ===== //
    async getUserProfile(userId: string): Promise<{ data: any; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            return { data, error };
        } catch (err) {
            console.error('Get user profile failed:', err);
            return { data: null, error: err };
        }
    }

    async updateUserProfile(userId: string, updates: {
        height_cm?: number;
        weight_kg?: number;
        target_weight_kg?: number;
        target_duration?: number;
        target_duration_unit?: string;
        goal_weight_kg?: number;
        activity_level?: string;
        health_goals?: string[];
        full_name?: string;
        avatar_url?: string;
        [key: string]: any;
    }): Promise<{ data?: any; error?: any }> {
        try {
            // First check if profile exists
            const { data: existingProfile } = await this.client
                .from('user_profiles')
                .select('id')
                .eq('user_id', userId)
                .single();

            if (existingProfile) {
                // Profile exists, update it
                const { data, error } = await this.client
                    .from('user_profiles')
                    .update({
                        ...updates,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId)
                    .select()
                    .single();

                return { data, error };
            } else {
                // Profile doesn't exist, insert new one
                const { data, error } = await this.client
                    .from('user_profiles')
                    .insert({
                        user_id: userId,
                        ...updates,
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                return { data, error };
            }
        } catch (err) {
            console.error('Profile update failed:', err);
            return { data: null, error: err };
        }
    }

    async updateUserMetadata(updates: {
        full_name?: string;
        avatar_url?: string;
        [key: string]: any;
    }): Promise<AuthResponse> {
        try {
            const { data, error } = await this.client.auth.updateUser({
                data: updates
            });
            return { data, error };
        } catch (err) {
            console.error('User metadata update failed:', err);
            const error = err as AuthError;
            return { data: null, error };
        }
    }

    // ===== UTILITY METHODS ===== //
    getClient(): SupabaseClient {
        return this.client;
    }

    async checkEmailExists(email: string): Promise<boolean> {
        try {
            // This requires a custom function in your Supabase database
            const { data, error } = await this.client.rpc('check_email_exists', {
                email_input: email
            });

            return !error && !!data;
        } catch (error) {
            console.warn('Failed to check email existence:', error);
            return false;
        }
    }

    // ===== SESSION HELPERS ===== //
    isSessionValid(session: Session | null): boolean {
        if (!session) return false;

        const now = new Date().getTime() / 1000;
        return session.expires_at ? session.expires_at > now : false;
    }

    shouldRefreshSession(session: Session | null): boolean {
        if (!session || !session.expires_at) return false;

        const now = new Date().getTime() / 1000;
        const timeUntilExpiry = session.expires_at - now;

        // Refresh if less than 5 minutes remaining
        return timeUntilExpiry < 300;
    }

    getExtendedSessionInfo(): { isExtended: boolean; expiry: Date | null } {
        try {
            const stored = localStorage.getItem('extended_session');
            if (!stored) return { isExtended: false, expiry: null };

            const parsed = JSON.parse(stored);
            const expiry = new Date(parsed.expiry);
            const isExtended = expiry > new Date();

            return { isExtended, expiry: isExtended ? expiry : null };
        } catch (error) {
            console.warn('Failed to get extended session info:', error);
            return { isExtended: false, expiry: null };
        }
    }

    clearExtendedSession(): void {
        try {
            localStorage.removeItem('extended_session');
        } catch (error) {
            console.warn('Failed to clear extended session:', error);
        }
    }

    // ===== ORIENTATION MANAGEMENT ===== //
    async getOrientations(applicableFor?: 'weight_loss' | 'weight_gain' | 'both'): Promise<{ data: any[]; error?: any }> {
        try {
            let query = this.client
                .from('orientations')
                .select('*')
                .order('label', { ascending: true });

            if (applicableFor && applicableFor !== 'both') {
                query = query.or(`applicable_for.eq.${applicableFor},applicable_for.eq.both`);
            }

            const { data, error } = await query;

            return { data: data || [], error };
        } catch (err) {
            console.error('Get orientations failed:', err);
            return { data: [], error: err };
        }
    }

    // ===== MEALS MANAGEMENT ===== //
    async getTodaysMeals(userId: string): Promise<{ data: any[]; error?: any }> {
        try {
            const todayDateString = getTodayDateString();
            
            const { data, error } = await this.client
                .from('meals')
                .select('*')
                .eq('user_id', userId)
                .eq('date', todayDateString)
                .order('time', { ascending: true });

            return { data: data || [], error };
        } catch (err) {
            console.error('Get today\'s meals failed:', err);
            return { data: [], error: err };
        }
    }

    async getMealsByDateRange(userId: string, startDate: string, endDate: string): Promise<{ data: any[]; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('meals')
                .select('*')
                .eq('user_id', userId)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: false })
                .order('time', { ascending: true });

            return { data: data || [], error };
        } catch (err) {
            console.error('Get meals by date range failed:', err);
            return { data: [], error: err };
        }
    }

    async addMeal(mealData: {
        user_id: string;
        meal_type: string;
        meal_name: string;
        date: string;
        time: string;
        foods: any;
        total_calories: number;
        total_protein_g: number;
        total_carbs_g: number;
        total_fat_g: number;
        total_fiber_g?: number;
        total_sugar_g?: number;
        total_sodium_mg?: number;
        notes?: string;
    }): Promise<{ data?: any; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('meals')
                .insert([mealData])
                .select()
                .single();

            return { data, error };
        } catch (err) {
            console.error('Add meal failed:', err);
            return { data: null, error: err };
        }
    }

    async updateMeal(mealId: string, updates: {
        meal_type?: string;
        meal_name?: string;
        date?: string;
        time?: string;
        foods?: any;
        total_calories?: number;
        total_protein_g?: number;
        total_carbs_g?: number;
        total_fat_g?: number;
        total_fiber_g?: number;
        total_sugar_g?: number;
        total_sodium_mg?: number;
        notes?: string;
    }): Promise<{ data?: any; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('meals')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', mealId)
                .select()
                .single();

            return { data, error };
        } catch (err) {
            console.error('Update meal failed:', err);
            return { data: null, error: err };
        }
    }

    async deleteMeal(mealId: string): Promise<{ error?: any }> {
        try {
            const { error } = await this.client
                .from('meals')
                .delete()
                .eq('id', mealId);

            return { error };
        } catch (err) {
            console.error('Delete meal failed:', err);
            return { error: err };
        }
    }

    // ===== CUSTOM MEALS MANAGEMENT ===== //
    async checkCustomMealExists(userId: string, mealName: string, calories: number, protein: number, carbs: number, fat: number): Promise<{ exists: boolean; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('custom_meals')
                .select('id')
                .eq('submitted_by', userId)
                .eq('name', mealName)
                .eq('calories_per_100g', calories)
                .eq('protein_g', protein)
                .eq('carbohydrates_g', carbs)
                .eq('fats_g', fat)
                .maybeSingle();

            return { exists: !!data, error };
        } catch (err) {
            console.error('Check custom meal exists failed:', err);
            return { exists: false, error: err };
        }
    }

    async addCustomMeal(customMealData: {
        name: string;
        calories_per_100g: number;
        protein_g: number;
        carbohydrates_g: number;
        fats_g: number;
        fiber_g?: number;
        free_sugar_g?: number;
        sodium_mg?: number;
        submitted_by: string;
        status: 'pending' | 'approved' | 'rejected';
    }): Promise<{ data?: any; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('custom_meals')
                .insert([customMealData])
                .select()
                .single();

            return { data, error };
        } catch (err) {
            console.error('Add custom meal failed:', err);
            return { data: null, error: err };
        }
    }

    // ===== FOOD SEARCH FUNCTIONALITY ===== //
    async searchFoods(query: string, limit: number = 5): Promise<{ data: any[]; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('foods')
                .select('id, name, calories_per_100g, protein_g, carbohydrates_g, fats_g, fiber_g, free_sugar_g, sodium_mg')
                .ilike('name', `%${query}%`)
                .limit(limit)
                .order('name', { ascending: true });

            return { data: data || [], error };
        } catch (err) {
            console.error('Search foods failed:', err);
            return { data: [], error: err };
        }
    }

    async searchCustomMeals(userId: string, query: string, limit: number = 5): Promise<{ data: any[]; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('custom_meals')
                .select('id, name, calories_per_100g, protein_g, carbohydrates_g, fats_g, fiber_g, free_sugar_g, sodium_mg')
                .eq('submitted_by', userId)
                .or('status.eq.approved,status.eq.pending')
                .ilike('name', `%${query}%`)
                .limit(limit)
                .order('name', { ascending: true });

            return { data: data || [], error };
        } catch (err) {
            console.error('Search custom meals failed:', err);
            return { data: [], error: err };
        }
    }

    async searchFoodsAndCustomMeals(userId: string, query: string, limit: number = 5): Promise<{ data: any[]; error?: any }> {
        try {
            // Search both tables concurrently
            const [foodsResult, customMealsResult] = await Promise.all([
                this.searchFoods(query, Math.ceil(limit / 2)),
                this.searchCustomMeals(userId, query, Math.ceil(limit / 2))
            ]);

            if (foodsResult.error && customMealsResult.error) {
                return { data: [], error: foodsResult.error };
            }

            // Combine results, marking source for UI purposes
            const combinedResults = [
                ...(foodsResult.data || []).map(food => ({ ...food, source: 'foods' })),
                ...(customMealsResult.data || []).map(meal => ({ ...meal, source: 'custom_meals' }))
            ];

            // Sort by name and limit to requested number
            const sortedResults = combinedResults
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, limit);

            return { data: sortedResults, error: null };
        } catch (err) {
            console.error('Search foods and custom meals failed:', err);
            return { data: [], error: err };
        }
    }

    // ===== QUICK FOODS BASED ON USER HISTORY ===== //
    async getUserMostUsedMeals(userId: string, limit: number = 5): Promise<{ data: any[]; error?: any }> {
        try {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            const ninetyDaysAgoString = ninetyDaysAgo.toISOString().split('T')[0];

            const { data, error } = await this.client
                .from('meals')
                .select('meal_name, total_calories, total_protein_g, total_carbs_g, total_fat_g')
                .eq('user_id', userId)
                .gte('date', ninetyDaysAgoString)
                .order('created_at', { ascending: false });

            if (error) {
                return { data: [], error };
            }

            if (!data || data.length === 0) {
                return { data: [], error: null };
            }

            // Count frequency of each meal name and aggregate nutrition
            const mealFrequency = new Map();
            
            data.forEach(meal => {
                const mealName = meal.meal_name.toLowerCase();
                if (mealFrequency.has(mealName)) {
                    const existing = mealFrequency.get(mealName);
                    existing.count += 1;
                    // Keep track of latest nutrition values
                    existing.calories = meal.total_calories;
                    existing.protein = meal.total_protein_g;
                    existing.carbs = meal.total_carbs_g;
                    existing.fat = meal.total_fat_g;
                } else {
                    mealFrequency.set(mealName, {
                        name: meal.meal_name,
                        count: 1,
                        calories: meal.total_calories,
                        protein: meal.total_protein_g,
                        carbs: meal.total_carbs_g,
                        fat: meal.total_fat_g
                    });
                }
            });

            // Sort by frequency and get top meals
            const sortedMeals = Array.from(mealFrequency.values())
                .sort((a, b) => b.count - a.count)
                .slice(0, limit)
                .map(meal => ({
                    name: meal.name,
                    calories: Math.round(meal.calories || 0),
                    protein: Math.round((meal.protein || 0) * 10) / 10,
                    carbs: Math.round((meal.carbs || 0) * 10) / 10,
                    fat: Math.round((meal.fat || 0) * 10) / 10
                }));

            return { data: sortedMeals, error: null };
        } catch (err) {
            console.error('Get user most used meals failed:', err);
            return { data: [], error: err };
        }
    }

    async getRandomFoods(limit: number = 5): Promise<{ data: any[]; error?: any }> {
        try {
            const { data, error } = await this.client
                .from('foods')
                .select('name, calories_per_100g, protein_g, carbohydrates_g, fats_g')
                .limit(50);

            if (error) {
                return { data: [], error };
            }

            if (!data || data.length === 0) {
                // Fallback static foods if database has no foods
                const fallbackFoods = [
                    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
                    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
                    { name: 'Brown Rice', calories: 123, protein: 2.6, carbs: 23, fat: 0.9 },
                    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
                    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50 }
                ];
                return { data: fallbackFoods.slice(0, limit), error: null };
            }

            // Randomly select foods from the database
            const shuffled = data.sort(() => 0.5 - Math.random());
            const randomFoods = shuffled.slice(0, limit).map(food => ({
                name: food.name,
                calories: Math.round(food.calories_per_100g || 0),
                protein: Math.round((food.protein_g || 0) * 10) / 10,
                carbs: Math.round((food.carbohydrates_g || 0) * 10) / 10,
                fat: Math.round((food.fats_g || 0) * 10) / 10
            }));

            return { data: randomFoods, error: null };
        } catch (err) {
            console.error('Get random foods failed:', err);
            return { data: [], error: err };
        }
    }

    async getQuickFoods(userId: string, limit: number = 5): Promise<{ data: any[]; error?: any }> {
        try {
            // First try to get user's most used meals
            const { data: userMeals, error: userError } = await this.getUserMostUsedMeals(userId, limit);
            
            if (!userError && userMeals && userMeals.length >= limit) {
                return { data: userMeals, error: null };
            }

            // If user doesn't have enough history, supplement with random foods
            const remainingCount = limit - (userMeals?.length || 0);
            const { data: randomFoods, error: randomError } = await this.getRandomFoods(remainingCount);

            if (randomError) {
                // If both fail, return user meals if any, otherwise empty
                return { data: userMeals || [], error: randomError };
            }

            // Combine user meals and random foods
            const combinedFoods = [...(userMeals || []), ...(randomFoods || [])];
            return { data: combinedFoods.slice(0, limit), error: null };
        } catch (err) {
            console.error('Get quick foods failed:', err);
            return { data: [], error: err };
        }
    }

    // ===== OAUTH CALLBACK HANDLER ===== //
    async handleOAuthCallback(): Promise<{ success: boolean; error?: string }> {
        try {
            const { data, error } = await this.client.auth.getSession();

            if (error) {
                console.error('OAuth callback error:', error);
                return { success: false, error: error.message };
            }

            if (data.session) {
                console.log('OAuth callback successful, user signed in:', data.session.user.email);
                
                // If this is in a popup, send message to parent
                if (window.opener && window.opener !== window) {
                    window.opener.postMessage({
                        type: 'SUPABASE_AUTH_SUCCESS',
                        session: data.session
                    }, window.location.origin);
                    window.close();
                }
                
                return { success: true };
            } else {
                // If this is in a popup, send error message to parent
                if (window.opener && window.opener !== window) {
                    window.opener.postMessage({
                        type: 'SUPABASE_AUTH_ERROR',
                        error: { message: 'No session found after OAuth callback' }
                    }, window.location.origin);
                    window.close();
                }
                
                return { success: false, error: 'No session found after OAuth callback' };
            }
        } catch (err) {
            console.error('OAuth callback handling failed:', err);
            
            // If this is in a popup, send error message to parent
            if (window.opener && window.opener !== window) {
                window.opener.postMessage({
                    type: 'SUPABASE_AUTH_ERROR',
                    error: { message: 'Failed to handle OAuth callback' }
                }, window.location.origin);
                window.close();
            }
            
            return { success: false, error: 'Failed to handle OAuth callback' };
        }
    }
}

export default new SupabaseService();