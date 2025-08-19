// config/index.ts - Updated configuration for new Supabase project
export const config = {
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            redirectTo: `${window.location.origin}/auth/callback`
        }
    },

    app: {
        name: import.meta.env.VITE_APP_NAME || 'Health Tracker',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        baseUrl: window.location.origin
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
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    console.log('✅ Configuration validated');
};

export default config;