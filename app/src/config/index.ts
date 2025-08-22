// config/index.ts - Updated configuration for new Supabase project
export const config = {
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || 'https://syxygcrxrldnhlcnpbyr.supabase.co',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5eHlnY3J4cmxkbmhsY25wYnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODU3NDMsImV4cCI6MjA3MTE2MTc0M30.21zINCjjS_O5bSdR5EMRhmUHum6yStGwCe_haGUgYeo',
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            redirectTo: import.meta.env.VITE_OAUTH_REDIRECT_URL || `${window.location.origin}/auth/callback`
        }
    },

    app: {
        name: import.meta.env.VITE_APP_NAME || 'Health Tracker',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        baseUrl: import.meta.env.VITE_APP_URL || window.location.origin,
        domain: import.meta.env.VITE_APP_DOMAIN || window.location.host
    },

    api: {
        timeout: 10000,
        retries: 3
    },

    // Feature flags
    features: {
        enableGoogleAuth: true,
        enableEmailAuth: true,
        enableProfilePictures: true,
        enableNotifications: true
    },

    // UI Configuration
    ui: {
        theme: 'light',
        language: 'en',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h'
    }
};

// Validation
const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
];

export const validateConfig = () => {
    const missing = requiredEnvVars.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        console.warn(`⚠️ Missing environment variables (using fallbacks): ${missing.join(', ')}`);
        console.log('Using fallback values for production deployment');
    } else {
        console.log('✅ Configuration validated - all environment variables loaded');
    }
    
    // Log current config for debugging
    console.log('🔧 Current Supabase config:', {
        url: config.supabase.url ? '✅ Set' : '❌ Missing',
        anonKey: config.supabase.anonKey ? '✅ Set' : '❌ Missing'
    });
};

export default config;