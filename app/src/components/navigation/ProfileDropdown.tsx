import { useState, useCallback, useRef, useEffect } from 'react';
import NavigationManager from '../../managers/NavigationManager';
import { useAuth } from '../../hooks/useAuth';
import './ProfileDropdown.css';

interface ProfileDropdownProps {
    className?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
    className = ''
}) => {
    const [navState, setNavState] = useState(() => ({ activeItem: null }));
    const managerRef = useRef<NavigationManager>();
    const { user, isAdmin, isAuthenticated, signOut, signInWithGoogle, authLoading } = useAuth();

    if (!managerRef.current) {
        managerRef.current = NavigationManager.getInstance();
    }

    // Subscribe to navigation state changes
    useEffect(() => {
        const unsubscribe = managerRef.current!.subscribe(setNavState);
        return unsubscribe;
    }, []);

    const handleProfileClick = useCallback(() => {
        managerRef.current!.navigate('profile');
    }, []);

    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }, [signOut]);

    // Updated login handler to use Google auth directly
    const handleLoginClick = useCallback(async () => {
        if (authLoading) return;

        try {
            console.log('Starting Google sign in from navigation...');
            const result = await signInWithGoogle();

            if (!result.success) {
                console.error('Google sign in failed:', result.error);
            }
        } catch (error) {
            console.error('Google sign in error:', error);
        }
    }, [signInWithGoogle, authLoading]);

    const profileClasses = [
        'profile-dropdown',
        className
    ].filter(Boolean).join(' ');

    if (!isAuthenticated) {
        // Not signed in state - styled as nav item
        return (
            <button
                className="modern-nav__link"
                onClick={handleLoginClick}
                disabled={authLoading}
                aria-label={authLoading ? "Signing in..." : "Sign in with Google"}
                type="button"
            >
                {authLoading ? (
                    <>
                        <span className="modern-nav__icon">⏳</span>
                        <span className="modern-nav__label">Signing in...</span>
                    </>
                ) : (
                    <>
                        <span className="modern-nav__icon">🔐</span>
                        <span className="modern-nav__label">Sign In</span>
                    </>
                )}
            </button>
        );
    }

    // Signed in state - profile button navigates to profile page
    const isActive = navState.activeItem === 'profile';
    
    return (
        <button
            className="modern-nav__link"
            onClick={handleProfileClick}
            aria-label="Go to profile page"
            aria-current={isActive ? 'page' : undefined}
            type="button"
        >
            <span className="modern-nav__icon">👤</span>
            <span className="modern-nav__label">Profile</span>
        </button>
    );
};

export default ProfileDropdown;