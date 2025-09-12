# Authentication System Documentation

## Overview
This application uses **Supabase** as the backend authentication provider with support for both Google OAuth and email/password authentication. The system features a robust architecture with session management, role-based access control, lockout protection, and automatic user registration.

## Core Dependencies

### Primary Packages
```json
{
  "@supabase/supabase-js": "^2.55.0",  // Main Supabase client library
  "react-router-dom": "^7.8.1",        // For protected routing
  "zustand": "^4.4.1"                  // State management (if needed)
}
```

### Configuration
- Environment variables managed via Vite
- Multi-environment support (development, staging, production)
- PKCE flow for enhanced security

## Architecture Overview

### File Structure
```
src/
├── components/auth/
│   ├── AuthCallback.tsx          # OAuth callback handler
│   ├── ProtectedRoute.tsx        # Route protection component
│   └── ProtectedRoute.css        # Styling for auth components
├── hooks/
│   └── useAuth.ts               # Main authentication hook
├── managers/
│   └── AuthManager.ts           # Singleton auth state manager
├── services/
│   └── SupabaseService.ts       # Supabase client wrapper
├── types/
│   └── auth.ts                  # TypeScript interfaces
├── config/
│   ├── index.ts                 # Main config aggregator
│   └── environments/            # Environment-specific configs
│       ├── development.ts
│       ├── staging.ts
│       └── production.ts
└── pages/
    └── AuthCallback.tsx         # OAuth callback page
```

## Authentication Flow

### 1. Google OAuth Flow
```typescript
// Initiate Google sign-in
const { success, data, error } = await signInWithGoogle();

// Flow steps:
1. User clicks "Sign In with Google"
2. signInWithGoogle() called from useAuth hook
3. SupabaseService.signInWithGooglePopup() initiated
4. OAuth redirect to Google
5. Google redirects to /auth/callback
6. AuthCallback.tsx handles the callback
7. SupabaseService.handleOAuthCallback() processes session
8. useAuth hook detects SIGNED_IN event
9. User profile created/updated in database
10. User redirected to intended page
```

### 2. Email/Password Flow
```typescript
// Sign up
const result = await signUpWithEmail(email, password);

// Sign in
const result = await signInWithEmail(email, password, rememberMe);

// Flow steps:
1. User submits email/password form
2. SupabaseService.signUpWithEmail() or signInWithEmail()
3. Supabase handles authentication
4. Session created and stored
5. useAuth hook updates state
6. User profile verified/created
```

### 3. Session Management
```typescript
// Session initialization on app load
useEffect(() => {
  const initializeAuth = async () => {
    const { session, error } = await SupabaseService.getSession();
    // Handle session state...
  };
  initializeAuth();
}, []);

// Auth state listener
SupabaseService.onAuthStateChange((event, session) => {
  switch (event) {
    case 'SIGNED_IN':
      // Handle successful sign in
      break;
    case 'SIGNED_OUT':
      // Handle sign out
      break;
    case 'TOKEN_REFRESHED':
      // Handle token refresh
      break;
  }
});
```

## Key Components

### 1. useAuth Hook (`src/hooks/useAuth.ts`)
**Purpose**: Main authentication interface for React components

**Key Features**:
- Session state management
- Google OAuth integration
- Email/password authentication
- Profile setup validation
- Automatic redirects for incomplete profiles

**Usage Example**:
```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    loading, 
    signInWithGoogle, 
    signOut 
  } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <SignInForm />;
  
  return <AuthenticatedContent />;
};
```

### 2. AuthManager (`src/managers/AuthManager.ts`)
**Purpose**: Singleton authentication state manager

**Key Features**:
- Centralized auth state
- Failed attempt tracking (10 attempts max)
- Account lockout protection (15 minutes)
- Session persistence
- Notification integration
- Admin role checking

**Key Methods**:
```typescript
// Singleton instance
const authManager = AuthManager.getInstance();

// Authentication methods
await authManager.signInWithGoogle();
await authManager.signInWithEmail(email, password, rememberMe);
await authManager.signUpWithEmail(email, password);
await authManager.signOut();

// State access
const isAuthenticated = authManager.isAuthenticated();
const isAdmin = authManager.isAdminUser();
const currentUser = authManager.getCurrentUser();

// Lockout management
const isLocked = authManager.isAccountLocked();
const remainingTime = authManager.getRemainingLockoutTime();
```

### 3. SupabaseService (`src/services/SupabaseService.ts`)
**Purpose**: Supabase client wrapper and data operations

**Key Features**:
- Google OAuth with popup/redirect support
- Email/password authentication
- Session management
- User profile operations
- Role management
- Password reset functionality
- Database operations (meals, custom foods, etc.)

**Core Methods**:
```typescript
// Authentication
await SupabaseService.signInWithGooglePopup();
await SupabaseService.signInWithEmail(email, password, rememberMe);
await SupabaseService.signUpWithEmail(email, password);
await SupabaseService.signOut();

// Session management
const { session, error } = await SupabaseService.getSession();
const { user, error } = await SupabaseService.getUser();

// User management
await SupabaseService.registerUser(user);
const isAdmin = await SupabaseService.isAdmin(userId);
await SupabaseService.updateUserProfile(userId, updates);

// OAuth callback
const result = await SupabaseService.handleOAuthCallback();
```

### 4. ProtectedRoute (`src/components/auth/ProtectedRoute.tsx`)
**Purpose**: Route protection and access control

**Features**:
- Authentication requirement
- Admin role requirement
- Loading states
- Sign-in prompts
- Access denied messages

**Usage Example**:
```typescript
import ProtectedRoute, { AdminRoute } from '../components/auth/ProtectedRoute';

// Require authentication
<ProtectedRoute>
  <UserDashboard />
</ProtectedRoute>

// Require admin role
<AdminRoute>
  <AdminPanel />
</AdminRoute>
```

### 5. AuthCallback (`src/pages/AuthCallback.tsx`)
**Purpose**: Handle OAuth redirect callbacks

**Features**:
- Popup and redirect flow support
- Success/error handling
- Automatic redirects
- Loading states

## Database Schema

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL,
  target_weight_kg DECIMAL,
  activity_level TEXT,
  health_goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User Roles Table
```sql
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Features

### 1. Account Lockout Protection
- **Max Attempts**: 10 failed login attempts
- **Lockout Duration**: 15 minutes
- **Storage**: LocalStorage with expiry timestamps
- **Automatic Reset**: On successful authentication

### 2. Session Security
- **PKCE Flow**: Enhanced OAuth security
- **Auto-refresh**: Automatic token refresh
- **Secure Storage**: HttpOnly cookies when possible
- **Session Validation**: Expiry checking

### 3. Role-Based Access Control
- **User Roles**: 'admin' and 'user' roles
- **Database Enforcement**: Row-level security policies
- **Component Protection**: AdminRoute component
- **API Security**: Server-side role verification

## Environment Configuration

### Development Environment
```typescript
// src/config/environments/development.ts
export const developmentConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL!,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    auth: {
      redirectTo: 'http://localhost:5173/auth/callback',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
  // ... other config
};
```

### Production Environment
```typescript
// src/config/environments/production.ts
export const productionConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL!,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    auth: {
      redirectTo: 'https://yourdomain.com/auth/callback',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
  // ... other config
};
```

### Required Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_APP_VERSION=1.0.0
```

## Implementation Guide

### 1. Setting Up Supabase
```typescript
// 1. Install Supabase client
npm install @supabase/supabase-js

// 2. Create Supabase client
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, anonKey, options);

// 3. Configure Google OAuth in Supabase dashboard
// - Enable Google provider
// - Set redirect URLs
// - Configure OAuth scopes
```

### 2. Setting Up Authentication Hook
```typescript
// Create useAuth hook for React components
export const useAuth = () => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false
  });

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
    const unsubscribe = SupabaseService.onAuthStateChange(handleAuthChange);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
};
```

### 3. Setting Up Protected Routes
```typescript
// Wrap protected content with ProtectedRoute
import ProtectedRoute from './components/auth/ProtectedRoute';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin" element={
      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    } />
  </Routes>
);
```

### 4. Implementing User Registration
```typescript
// Automatic user registration on first Google sign-in
const handleGoogleSignIn = async (user: User) => {
  // Check if user profile exists
  const { data: profile } = await SupabaseService.getUserProfile(user.id);
  
  if (!profile) {
    // Create user profile
    await SupabaseService.registerUser(user);
    
    // Create default user role
    await SupabaseService.client
      .from('user_roles')
      .insert({ user_id: user.id, role: 'user' });
  }
};
```

## Best Practices

### 1. Error Handling
```typescript
// Always handle auth errors gracefully
const signIn = async () => {
  try {
    const result = await signInWithGoogle();
    if (!result.success) {
      showNotification(result.error?.message || 'Sign in failed', 'error');
    }
  } catch (error) {
    showNotification('Unexpected error during sign in', 'error');
    console.error('Auth error:', error);
  }
};
```

### 2. Loading States
```typescript
// Show loading states during authentication
const [authLoading, setAuthLoading] = useState(false);

const handleSignIn = async () => {
  setAuthLoading(true);
  try {
    await signInWithGoogle();
  } finally {
    setAuthLoading(false);
  }
};
```

### 3. Session Validation
```typescript
// Validate sessions before sensitive operations
const performAction = async () => {
  const { session } = await SupabaseService.getSession();
  if (!session || !SupabaseService.isSessionValid(session)) {
    await signOut();
    return;
  }
  
  // Proceed with authenticated action
};
```

### 4. Secure Data Access
```typescript
// Always include user ID in data operations
const getUserData = async (userId: string) => {
  const { data, error } = await SupabaseService.client
    .from('user_data')
    .select('*')
    .eq('user_id', userId); // Ensure user can only access their data
    
  return { data, error };
};
```

## Troubleshooting

### Common Issues

1. **OAuth Callback Not Working**
   - Check redirect URL configuration in Supabase dashboard
   - Ensure callback route is properly set up
   - Verify environment variables are correct

2. **Session Not Persisting**
   - Check `persistSession: true` in Supabase config
   - Verify local storage is enabled
   - Check for third-party cookie blocking

3. **Admin Access Not Working**
   - Verify user_roles table has correct entries
   - Check RLS policies allow role reading
   - Ensure isAdmin() function is working correctly

4. **Account Lockout Issues**
   - Check localStorage for lockout data
   - Verify lockout timing logic
   - Clear lockout manually if needed

### Debug Tools
```typescript
// Enable debug logging
console.log('Auth state:', authManager.getState());
console.log('Session info:', await SupabaseService.getSession());
console.log('Lockout status:', authManager.isAccountLocked());
```

## Migration Guide

To implement this authentication system in a new project:

1. **Install Dependencies**: Add Supabase client and React Router
2. **Set Up Supabase**: Create project, configure Google OAuth, set up database tables
3. **Copy Core Files**: AuthManager, SupabaseService, useAuth hook
4. **Configure Environment**: Set up environment variables and configs
5. **Add Components**: ProtectedRoute, AuthCallback components
6. **Set Up Routing**: Configure protected routes and OAuth callback
7. **Style Components**: Add CSS for authentication UI
8. **Test Flow**: Verify Google OAuth and email/password authentication

This authentication system provides a robust, secure, and user-friendly foundation for any React application requiring user authentication and authorization.