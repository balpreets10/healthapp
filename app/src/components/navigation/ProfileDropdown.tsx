import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './ProfileDropdown.css';

interface ProfileDropdownProps {
    className?: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { user, isAdmin, isAuthenticated, signOut, signInWithGoogle } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleSignOut = useCallback(async () => {
        setIsOpen(false);
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }, [signOut]);

    // Updated login handler to use Google auth directly
    const handleLoginClick = useCallback(async () => {
        if (authLoading) return;

        setAuthLoading(true);
        setIsOpen(false);

        try {
            console.log('Starting Google sign in from navigation...');
            const result = await signInWithGoogle();

            if (!result.success) {
                console.error('Google sign in failed:', result.error);
            }
        } catch (error) {
            console.error('Google sign in error:', error);
        } finally {
            setAuthLoading(false);
        }
    }, [signInWithGoogle, authLoading]);


    const handleProfileClick = useCallback(() => {
        setIsOpen(false);
        // TODO: Navigate to profile page
        console.log('Navigate to profile');
    }, []);

    const handleDashboardClick = useCallback(() => {
        setIsOpen(false);
        // TODO: Navigate to dashboard/admin
        console.log('Navigate to dashboard');
    }, []);

    // Get user initials
    const getUserInitials = useCallback(() => {
        if (!user?.email) return 'U';

        const email = user.email;
        const name = user.user_metadata?.full_name || user.user_metadata?.name;

        if (name) {
            const nameParts = name.trim().split(' ');
            if (nameParts.length >= 2) {
                return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
            }
            return name[0].toUpperCase();
        }

        return email[0].toUpperCase();
    }, [user]);

    // Get display name
    const getDisplayName = useCallback(() => {
        if (!user) return '';
        return user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User';
    }, [user]);

    const profileClasses = [
        'profile-dropdown',
        className,
        isOpen && 'profile-dropdown--open'
    ].filter(Boolean).join(' ');

    if (!isAuthenticated) {
        // Not signed in state - styled as nav item
        return (
            <button
                ref={buttonRef}
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

    // Signed in state - styled as nav item
    return (
        <div className={profileClasses}>
            <button
                ref={buttonRef}
                className="modern-nav__link"
                onClick={toggleDropdown}
                aria-label={`Profile menu for ${getDisplayName()}`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                type="button"
            >
                <span className="modern-nav__icon">
                    👤
                </span>
                <span className="modern-nav__label">Profile</span>
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="profile-dropdown__menu"
                    role="menu"
                    aria-labelledby="profile-menu-button"
                >
                    {/* User info section */}
                    <div className="profile-dropdown__header">
                        <div className="profile-dropdown__user-avatar">
                            <span className="profile-dropdown__user-initials">
                                {getUserInitials()}
                            </span>
                        </div>
                        <div className="profile-dropdown__user-info">
                            <div className="profile-dropdown__user-name">
                                {getDisplayName()}
                            </div>
                            <div className="profile-dropdown__user-email">
                                {user?.email}
                            </div>
                            {isAdmin && (
                                <div className="profile-dropdown__user-role">
                                    Admin
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-dropdown__divider" />

                    {/* Menu items */}
                    <div className="profile-dropdown__items">
                        <button
                            className="profile-dropdown__item"
                            onClick={handleProfileClick}
                            role="menuitem"
                            type="button"
                        >
                            <span className="profile-dropdown__item-icon">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path
                                        d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>
                            <span className="profile-dropdown__item-text">Profile</span>
                        </button>

                        {isAdmin && (
                            <button
                                className="profile-dropdown__item"
                                onClick={handleDashboardClick}
                                role="menuitem"
                                type="button"
                            >
                                <span className="profile-dropdown__item-icon">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M1 2C1 1.44772 1.44772 1 2 1H6C6.55228 1 7 1.44772 7 2V6C7 6.55228 6.55228 7 6 7H2C1.44772 7 1 6.55228 1 6V2Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M9 2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V2Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M1 10C1 9.44772 1.44772 9 2 9H6C6.55228 9 7 9.44772 7 10V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V10Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V10Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </span>
                                <span className="profile-dropdown__item-text">Dashboard</span>
                            </button>
                        )}

                        <div className="profile-dropdown__divider" />

                        <button
                            className="profile-dropdown__item profile-dropdown__item--danger"
                            onClick={handleSignOut}
                            role="menuitem"
                            type="button"
                        >
                            <span className="profile-dropdown__item-icon">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path
                                        d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M11 11L14 8L11 5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M14 8H6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                            <span className="profile-dropdown__item-text">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;