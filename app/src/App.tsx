import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModernNavigation from './components/navigation/ModernNavigation';
import Preloader from './components/ui/Preloader';
import Hero from './components/sections/Hero';
import AddMeals from './pages/AddMeals';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthNavigation, useNavigationEvents } from './hooks/useNavigation';
import { useAuth } from './hooks/useAuth';
import AuthManager from './managers/AuthManager';
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

  const handleNavigate = (sectionId: string) => {
    navActions.navigate(sectionId);
  };

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

      {/* Compact Footer */}
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
    </div>
  );
};

// Home Page Component
const HomePage: React.FC = () => {
  const auth = useAuth();
  const navigation = useAuthNavigation(auth.isAuthenticated, auth.loading);
  const { isAuthenticated } = auth;
  const { actions: navActions } = navigation;

  const handleNavigate = (sectionId: string) => {
    navActions.navigate(sectionId);
  };

  const handleSignIn = () => {
    // Trigger Google sign in
    const authManager = AuthManager.getInstance();
    authManager.signInWithGoogle();
  };

  return (
    <section id="home" className="app__section">
      <Hero
        title={`Welcome to ${appConfig.name}`}
        subtitle="Track your health and nutrition journey with ease"
        primaryCtaText={isAuthenticated ? "Go to Add Meals" : "Sign In with Google"}
        onPrimaryCtaClick={() => isAuthenticated ? handleNavigate('add-meals') : handleSignIn()}
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
  const { isAuthenticated, loading: authLoading } = auth;
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
  if (isLoading) {
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

          {/* Protected Add Meals Route */}
          <Route
            path="/add-meals"
            element={
              <ProtectedRoute>
                <AddMeals />
              </ProtectedRoute>
            }
          />

          {/* Journal Route - Placeholder for future implementation */}
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <section id="journal" className="app__section">
                  <div className="app__container">
                    <div className="section-placeholder">
                      <h2>📝 Health Journal Section</h2>
                      <p>This section will be implemented with health journal functionality.</p>
                    </div>
                  </div>
                </section>
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