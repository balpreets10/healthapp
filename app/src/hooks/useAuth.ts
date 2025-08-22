// hooks/useAuth.ts - Fixed Supabase integration with proper types and stable hook order
import { useState, useEffect, useCallback, useRef } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import SupabaseService from '../services/SupabaseService';
import NotificationManager from '../utils/NotificationManager';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    authLoading: boolean;
}

interface AuthResult {
    success: boolean;
    error?: { message: string } | null;
    data?: any;
}

export const useAuth = () => {
    // FIXED: Use refs to prevent hook order changes during rapid updates
    const mountedRef = useRef(true);
    const notificationManagerRef = useRef(NotificationManager.getInstance());

    // Clean up legacy localStorage profile data
    const cleanupLegacyProfileData = (userId: string) => {
        try {
            const legacyKey = `profile_extra_${userId}`;
            localStorage.removeItem(legacyKey);
            console.log('Cleaned up legacy profile data from localStorage');
        } catch (error) {
            console.warn('Failed to clean up legacy profile data:', error);
        }
    };

    // Function to check profile setup and redirect if incomplete
    const checkProfileSetupAndRedirect = async (userId: string) => {
        try {
            const { data: profile } = await SupabaseService.getUserProfile(userId);
            
            // Clean up any legacy localStorage profile data
            cleanupLegacyProfileData(userId);
            
            // Check if essential profile data is missing
            const isSetupIncomplete = !profile || 
                !profile.height_cm || 
                !profile.weight_kg || 
                !profile.activity_level;

            if (isSetupIncomplete) {
                // Only redirect if not already on profile page
                if (window.location.pathname !== '/profile') {
                    setTimeout(() => {
                        window.location.href = '/profile';
                    }, 1000); // Small delay to let the welcome notification show
                }
            }
        } catch (error) {
            console.error('Error checking profile setup:', error);
            // On error, redirect to profile to be safe
            if (window.location.pathname !== '/profile') {
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 1000);
            }
        }
    };

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
        isAuthenticated: false,
        isAdmin: false,
        authLoading: false
    });

    // Initialize auth state
    useEffect(() => {
        mountedRef.current = true;

        const initializeAuth = async () => {
            try {
                const { session, error } = await SupabaseService.getSession();

                if (mountedRef.current) {
                    if (session?.user) {
                        const adminStatus = await SupabaseService.isAdmin(session.user.id);
                        
                        // Clean up any legacy localStorage profile data on initial load
                        cleanupLegacyProfileData(session.user.id);
                        
                        setAuthState({
                            user: session.user,
                            session,
                            loading: false,
                            isAuthenticated: true,
                            isAdmin: adminStatus,
                            authLoading: false
                        });
                    } else {
                        setAuthState({
                            user: null,
                            session: null,
                            loading: false,
                            isAuthenticated: false,
                            isAdmin: false,
                            authLoading: false
                        });
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                if (mountedRef.current) {
                    setAuthState({
                        user: null,
                        session: null,
                        loading: false,
                        isAuthenticated: false,
                        isAdmin: false,
                        authLoading: false
                    });
                }
            }
        };

        initializeAuth();

        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Listen for auth changes - FIXED: Stable listener with proper cleanup
    useEffect(() => {
        const unsubscribe = SupabaseService.onAuthStateChange(
            async (event: AuthChangeEvent, session: Session | null) => {
                // FIXED: Check if component is still mounted before state updates
                if (!mountedRef.current) return;

                console.log('Auth state change:', event);

                if (session?.user) {
                    const adminStatus = await SupabaseService.isAdmin(session.user.id);

                    // FIXED: Double-check mounted state after async operation
                    if (mountedRef.current) {
                        setAuthState({
                            user: session.user,
                            session,
                            loading: false,
                            isAuthenticated: true,
                            isAdmin: adminStatus,
                            authLoading: false // Clear auth loading on successful sign in
                        });

                        // Show welcome notification for sign in events (only if not from a service signup)
                        if (event === 'SIGNED_IN') {
                            const userName = session.user.user_metadata?.full_name ||
                                session.user.user_metadata?.name ||
                                session.user.email?.split('@')[0] ||
                                'User';

                            // Only show notification if this is a Google sign in (to avoid duplicate with service layer)
                            const provider = session.user.app_metadata?.provider;
                            if (provider === 'google') {
                                notificationManagerRef.current.show(
                                    `Welcome back, ${userName}!`,
                                    'success',
                                    3000
                                );
                            }

                            // Check if profile setup is complete and redirect if needed
                            checkProfileSetupAndRedirect(session.user.id);
                        }
                    }
                } else {
                    if (mountedRef.current) {
                        setAuthState({
                            user: null,
                            session: null,
                            loading: false,
                            isAuthenticated: false,
                            isAdmin: false,
                            authLoading: false
                        });

                        // Show sign out notification
                        if (event === 'SIGNED_OUT') {
                            notificationManagerRef.current.show(
                                'You have been signed out',
                                'info',
                                2000
                            );
                        }
                    }
                }
            }
        );

        // FIXED: Return the unsubscribe function directly
        return unsubscribe;
    }, []); // FIXED: Empty dependency array for stable effect

    // Google OAuth sign in with popup
    const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
        try {
            console.log('Starting Google OAuth popup sign in...');
            
            // Set loading state
            if (mountedRef.current) {
                setAuthState(prevState => ({
                    ...prevState,
                    authLoading: true
                }));
            }

            const { data, error } = await SupabaseService.signInWithGooglePopup();

            if (error) {
                console.error('Google OAuth popup error:', error);
                
                // Clear loading state only on error
                if (mountedRef.current) {
                    setAuthState(prevState => ({
                        ...prevState,
                        authLoading: false
                    }));
                }
                
                notificationManagerRef.current.show(
                    error.message || 'Google sign in failed',
                    'error',
                    5000
                );
                return { success: false, error };
            }

            if (data) {
                console.log('Google OAuth popup initiated successfully');
                // Don't clear loading here - let auth state change handle it
                // The loading will be cleared when SIGNED_IN event fires
                return { success: true, data };
            }

            // Clear loading state if no data and no error (cancelled)
            if (mountedRef.current) {
                setAuthState(prevState => ({
                    ...prevState,
                    authLoading: false
                }));
            }
            return { success: false, error: { message: 'Authentication was cancelled' } };

        } catch (error: any) {
            console.error('Google popup sign in error:', error);
            
            // Clear loading state on exception
            if (mountedRef.current) {
                setAuthState(prevState => ({
                    ...prevState,
                    authLoading: false
                }));
            }
            
            const errorMessage = error?.message || 'Google sign in failed';
            notificationManagerRef.current.show(errorMessage, 'error', 5000);
            return { success: false, error: { message: errorMessage } };
        }
    }, []);

    // Email/password sign in
    const signInWithEmail = useCallback(async (
        email: string,
        password: string,
        rememberMe: boolean = false
    ): Promise<AuthResult> => {
        try {
            const { data, error } = await SupabaseService.signInWithEmail(email, password, rememberMe);

            if (error) {
                notificationManagerRef.current.show(
                    error.message || 'Sign in failed',
                    'error',
                    5000
                );
                return { success: false, error };
            }

            return { success: true, data };

        } catch (error: any) {
            console.error('Email sign in error:', error);
            const errorMessage = error?.message || 'Sign in failed';
            notificationManagerRef.current.show(errorMessage, 'error', 5000);
            return { success: false, error: { message: errorMessage } };
        }
    }, []);

    // Email/password sign up
    const signUpWithEmail = useCallback(async (
        email: string,
        password: string
    ): Promise<AuthResult> => {
        try {
            const { data, error } = await SupabaseService.signUpWithEmail(email, password);

            if (error) {
                notificationManagerRef.current.show(
                    error.message || 'Sign up failed',
                    'error',
                    5000
                );
                return { success: false, error };
            }

            notificationManagerRef.current.show(
                'Account created! Please check your email to verify.',
                'success',
                7000
            );

            return { success: true, data };

        } catch (error: any) {
            console.error('Email sign up error:', error);
            const errorMessage = error?.message || 'Sign up failed';
            notificationManagerRef.current.show(errorMessage, 'error', 5000);
            return { success: false, error: { message: errorMessage } };
        }
    }, []);

    // Sign out
    const signOut = useCallback(async (): Promise<AuthResult> => {
        try {
            const { error } = await SupabaseService.signOut();

            if (error) {
                notificationManagerRef.current.show(
                    error.message || 'Sign out failed',
                    'error',
                    5000
                );
                return { success: false, error };
            }

            return { success: true };

        } catch (error: any) {
            console.error('Sign out error:', error);
            const errorMessage = error?.message || 'Sign out failed';
            notificationManagerRef.current.show(errorMessage, 'error', 5000);
            return { success: false, error: { message: errorMessage } };
        }
    }, []);

    // Handle OAuth callback
    const handleOAuthCallback = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log('Handling OAuth callback...');
            const result = await SupabaseService.handleOAuthCallback();

            if (result.success) {
                notificationManagerRef.current.show(
                    'Successfully signed in with Google!',
                    'success',
                    3000
                );
            } else {
                notificationManagerRef.current.show(
                    result.error || 'OAuth authentication failed',
                    'error',
                    5000
                );
            }

            return result;

        } catch (error: any) {
            console.error('OAuth callback error:', error);
            const errorMessage = error?.message || 'OAuth callback failed';
            notificationManagerRef.current.show(errorMessage, 'error', 5000);
            return { success: false, error: errorMessage };
        }
    }, []);

    return {
        ...authState,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        handleOAuthCallback
    };
};