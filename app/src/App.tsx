import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ModernNavigation from './components/navigation/ModernNavigation';
import Preloader from './components/ui/Preloader';
import Hero from './pages/Hero';
import AddMeals from './pages/AddMeals';
import Profile from './pages/Profile';
import Journal from './pages/Journal';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthNavigation, useNavigationEvents } from './hooks/useNavigation';
import { useAuth } from './hooks/useAuth';
import ScrollManager from './managers/ScrollManager';
import PerformanceManager from './managers/PerformanceManager';
import { appConfig, devHelpers } from './config/AppConfig';
import './App.css';

// Layout component to wrap pages with header and footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const navigation = useAuthNavigation(auth.isAuthenticated, auth.loading);
  const { isAuthenticated } = auth;
  const { actions: navActions } = navigation;
  const location = useLocation();

  const handleNavigate = (sectionId: string) => {
    navActions.navigate(sectionId);
  };

  // Only show footer on home page
  const showFooter = location.pathname === '/';

  return (
    <div className="app">
      {/* Fixed Navigation - appears on all pages */}
      <ModernNavigation
        position="fixed-top"
        onNavigate={handleNavigate}
        brand="Health Tracker"
        brandHref="/"
      />

      {/* Main content - changes based on route */}
      <main className="app__main">
        {children}
      </main>

      {/* Compact Footer - only on home page */}
      {showFooter && (
        <footer className="app__footer">
          <div className="app__footer-content">
            <div className="app__footer-main">
              <div className="app__footer-brand">
                <strong>{appConfig.name}</strong>
                <span>Your health journey starts here</span>
              </div>
            </div>
            <div className="app__footer-bottom">
              <span>&copy; 2025 {appConfig.name}</span>
              {appConfig.debug.enabled && (
                <span className="app__footer-version">
                  v{appConfig.version}
                </span>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

// Home Page Component
const HomePage: React.FC = () => {
  const auth = useAuth();
  const navigation = useAuthNavigation(auth.isAuthenticated, auth.loading);
  const { isAuthenticated, authLoading } = auth;
  const { actions: navActions } = navigation;

  const handleNavigate = (sectionId: string) => {
    navActions.navigate(sectionId);
  };

  const handleSignIn = async () => {
    // Use the auth hook's Google sign in method
    await auth.signInWithGoogle();
  };

  // Show loading state during authentication
  const primaryCtaText = authLoading
    ? "Signing in..."
    : isAuthenticated
      ? "Go to Add Meals"
      : "Sign In with Google";

  return (
    <section id="home" className="app__section">
      <Hero
        title={`Welcome to ${appConfig.name}`}
        subtitle="Track your health and nutrition journey with ease"
        primaryCtaText={primaryCtaText}
        onPrimaryCtaClick={() => {
          if (authLoading) return; // Prevent clicks during loading
          return isAuthenticated ? handleNavigate('add-meals') : handleSignIn();
        }}
      />
    </section>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Always call hooks in the same order
  const auth = useAuth();
  const navigation = useAuthNavigation(auth.isAuthenticated, auth.loading);

  // Extract values after hooks are called  
  const { isAuthenticated, loading, authLoading } = auth;
  const { state: navState } = navigation;

  // Initialize managers once
  useEffect(() => {
    const scrollManager = ScrollManager.getInstance();
    const performanceManager = PerformanceManager.getInstance();

    // Start performance tracking if enabled
    if (appConfig.debug.enablePerformanceMonitoring) {
      performanceManager.startMark('app-init');
    }

    // Log app initialization in development
    if (appConfig.debug.enableLogging) {
      console.log('🚀 Health Tracker App initializing...');
      console.log('📱 Version:', appConfig.version);
      console.log('🔧 Environment:', appConfig.env);
      console.log('🧭 Navigation items configured: Home, Add Meals, Journal');
      console.log('🌐 Router-based navigation enabled');
    }

    // Cleanup function
    return () => {
      scrollManager.destroy();
      performanceManager.destroy();

      if (appConfig.debug.enableLogging) {
        console.log('🧹 App cleanup completed');
      }
    };
  }, []);

  // Enhanced analytics tracking with auth-blocked events
  useNavigationEvents('all', (event) => {
    if (appConfig.debug.enableLogging) {
      console.log('🧭 Navigation event:', event);
    }

    // Track auth-blocked navigation attempts
    if (event.type === 'navigate-blocked') {
      console.log('🔒 Navigation blocked - authentication required for:', event.item?.label);
    }

    // Development-specific tracking
    if (devHelpers.isFeatureEnabled('experimentalFeatures')) {
      console.log('📊 Experimental tracking enabled for:', event);
    }
  }, []);

  // Listen for Google sign-in requests from NavigationManager
  useEffect(() => {
    const handleGoogleSigninRequest = async (event: CustomEvent) => {
      const item = event.detail?.item;
      if (appConfig.debug.enableLogging) {
        console.log('🔐 Google sign-in requested for:', item?.label);
      }

      try {
        const result = await auth.signInWithGoogle();
        if (result.success && item) {
          // Navigate to the requested page after successful authentication
          setTimeout(() => {
            navigation.actions.navigate(item.id);
          }, 1000); // Small delay to allow auth state to update
        }
      } catch (error) {
        console.error('🔐 Google sign-in failed:', error);
      }
    };

    document.addEventListener('navigation:google-signin-requested', handleGoogleSigninRequest as EventListener);

    return () => {
      document.removeEventListener('navigation:google-signin-requested', handleGoogleSigninRequest as EventListener);
    };
  }, [auth, navigation.actions]);

  const handlePreloaderComplete = () => {
    setIsLoading(false);

    // Trigger any post-load animations or effects here
    document.body.classList.add('app-loaded');

    // Log successful app load
    if (appConfig.debug.enableLogging) {
      console.log('✅ App loaded successfully');
      console.log('🔐 Authentication state:', isAuthenticated ? 'authenticated' : 'not authenticated');

      if (appConfig.debug.enablePerformanceMonitoring) {
        const performanceManager = PerformanceManager.getInstance();
        performanceManager.endMark('app-init');
        console.log('⏱️ App initialization complete');
      }
    }
  };

  // Early return after all hooks are called
  // Don't show preloader if user is in the middle of authentication
  if (isLoading && !authLoading) {
    return (
      <Preloader
        onComplete={handlePreloaderComplete}
        duration={1200}
        minDisplayTime={800}
      />
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />

          {/* Auth Callback Route - for OAuth popup handling */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Add Meals Route */}
          <Route
            path="/add-meals"
            element={
              <ProtectedRoute>
                <AddMeals />
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Journal Route */}
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </Layout>
    </Router>
  );
}

export default App;