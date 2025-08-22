// components/auth/ProtectedRoute.tsx
import { ReactNode, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
    fallback?: ReactNode;
}

const ProtectedRoute = ({ children, requireAdmin = false, fallback = null }: ProtectedRouteProps) => {
    const { loading, isAuthenticated, isAdmin, user, signInWithGoogle, authLoading } = useAuth();

    const handleSignIn = useCallback(async () => {
        if (authLoading) return;
        
        try {
            const result = await signInWithGoogle();
            if (!result.success) {
                console.error('Sign in failed:', result.error);
            }
        } catch (error) {
            console.error('Sign in error:', error);
        }
    }, [signInWithGoogle, authLoading]);

    if (loading) {
        return (
            <div className="protected-route protected-route--loading">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="protected-route protected-route--unauthorized">
                <div className="protected-route__container">
                    <h2 className="protected-route__title">Sign In Required</h2>
                    <p className="protected-route__message">
                        Please sign in to access this page.
                    </p>
                    <button
                        className="protected-route__signin-btn"
                        onClick={handleSignIn}
                        disabled={authLoading}
                        type="button"
                    >
                        {authLoading ? (
                            <>
                                <span className="protected-route__signin-icon">⏳</span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <span className="protected-route__signin-icon">🔐</span>
                                Sign In with Google
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    if (requireAdmin && !isAdmin) {
        return (
            <div className="protected-route protected-route--unauthorized">
                <div className="protected-route__container">
                    <h2 className="protected-route__title">Access Denied</h2>
                    <p className="protected-route__message">
                        You don't have admin privileges to access this area.
                    </p>
                    <p className="protected-route__user-info">
                        Signed in as: {user?.email}
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

interface AdminRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export const AdminRoute = ({ children, fallback = null }: AdminRouteProps) => (
    <ProtectedRoute requireAdmin={true} fallback={fallback}>
        {children}
    </ProtectedRoute>
);

export default ProtectedRoute;