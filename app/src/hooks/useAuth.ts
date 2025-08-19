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

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
        isAuthenticated: false,
        isAdmin: false
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
                        setAuthState({
                            user: session.user,
                            session,
                            loading: false,
                            isAuthenticated: true,
                            isAdmin: adminStatus
                        });
                    } else {
                        setAuthState({
                            user: null,
                            session: null,
                            loading: false,
                            isAuthenticated: false,
                            isAdmin: false
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
                        isAdmin: false
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
                            isAdmin: adminStatus
                        });

                        // Show welcome notification for sign in events
                        if (event === 'SIGNED_IN') {
                            const userName = session.user.user_metadata?.full_name ||
                                session.user.user_metadata?.name ||
                                session.user.email?.split('@')[0] ||
                                'User';

                            notificationManagerRef.current.show(
                                `Welcome back, ${userName}!`,
                                'success',
                                3000
                            );
                        }
                    }
                } else {
                    if (mountedRef.current) {
                        setAuthState({
                            user: null,
                            session: null,
                            loading: false,
                            isAuthenticated: false,
                            isAdmin: false
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

    // Google OAuth sign in
    const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
        try {
            console.log('Starting Google OAuth sign in...');

            const { data, error } = await SupabaseService.signInWithGoogle();

            if (error) {
                console.error('Google OAuth error:', error);
                notificationManagerRef.current.show(
                    error.message || 'Google sign in failed',
                    'error',
                    5000
                );
                return { success: false, error };
            }

            // OAuth redirect will handle the rest
            console.log('Google OAuth redirect initiated');
            return { success: true, data };

        } catch (error: any) {
            console.error('Google sign in error:', error);
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