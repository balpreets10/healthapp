/**
 * Application Configuration Manager
 * Simplified for development environment only
 */

export interface AppConfig {
    // Environment
    env: 'development' | 'production';
    isDevelopment: boolean;
    isProduction: boolean;

    // App Info
    name: string;
    version: string;
    description: string;

    // API Configuration
    api: {
        baseUrl: string;
        timeout: number;
    };

    // Supabase Configuration
    supabase: {
        url: string;
        anonKey: string;
    };

    // Development Features
    debug: {
        enabled: boolean;
        showPanel: boolean;
        enableLogging: boolean;
        enablePerformanceMonitoring: boolean;
    };

    // Feature Flags
    features: {
        experimentalFeatures: boolean;
    };
}

/**
 * Get configuration value with type safety
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = import.meta.env[key];
    if (value === undefined && defaultValue === undefined) {
        console.warn(`Environment variable ${key} is not defined`);
        return '';
    }
    return value || defaultValue || '';
};

/**
 * Get boolean environment variable
 */
const getBooleanEnvVar = (key: string, defaultValue = false): boolean => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1' || value === 'yes';
};

/**
 * Get numeric environment variable
 */
const getNumericEnvVar = (key: string, defaultValue = 0): number => {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    const num = parseInt(value, 10);
    return isNaN(num) ? defaultValue : num;
};

/**
 * Get current environment from build-time variables
 */
const getCurrentEnv = (): 'development' | 'production' => {
    // Check NODE_ENV first (more reliable for Vite builds)
    const nodeEnv = import.meta.env.NODE_ENV;
    if (nodeEnv === 'production') return 'production';
    if (nodeEnv === 'development') return 'development';
    
    // Fallback to Vite's mode
    const viteMode = import.meta.env.MODE;
    if (viteMode === 'production') return 'production';
    
    // Default fallback to development
    return 'development';
};

/**
 * Application configuration instance
 * Environment-aware configuration
 */
export const appConfig: AppConfig = (() => {
    const env = getCurrentEnv();
    const isDev = env === 'development';
    const isProd = env === 'production';
    
    return {
    // Environment - dynamic based on build mode
    env,
    isDevelopment: isDev,
    isProduction: isProd,

    // App Info
    name: getEnvVar('VITE_APP_NAME', 'Health Tracker Prototype'),
    version: getEnvVar('VITE_APP_VERSION', isProd ? '1.0.0' : '1.0.0-dev'),
    description: getEnvVar('VITE_APP_DESCRIPTION', 'Health and nutrition tracking prototype'),

    // API Configuration
    api: {
        baseUrl: getEnvVar('VITE_API_BASE_URL', isProd ? '/api' : 'http://localhost:3001/api'),
        timeout: getNumericEnvVar('VITE_API_TIMEOUT', 10000),
    },

    // Supabase Configuration
    supabase: {
        url: getEnvVar('VITE_SUPABASE_URL'),
        anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
    },

    // Development Features - environment dependent
    debug: {
        enabled: getBooleanEnvVar('VITE_DEBUG_MODE', isDev),
        showPanel: getBooleanEnvVar('VITE_ENABLE_DEBUG_PANEL', isDev),
        enableLogging: getBooleanEnvVar('VITE_ENABLE_LOGGING', isDev),
        enablePerformanceMonitoring: getBooleanEnvVar('VITE_ENABLE_PERFORMANCE_MONITORING', isDev),
    },

    // Feature Flags - experimental features enabled in development only
    features: {
        experimentalFeatures: getBooleanEnvVar('VITE_ENABLE_EXPERIMENTAL_FEATURES', isDev),
    },
    };
})();

/**
 * Validate required configuration
 */
export const validateConfig = (): void => {
    const requiredFields = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
    ];

    // In production builds, environment variables are processed at build time and embedded
    // So we check the actual values in appConfig instead of the environment variables
    const missingFields: string[] = [];
    
    if (!appConfig.supabase.url) {
        missingFields.push('VITE_SUPABASE_URL');
    }
    
    if (!appConfig.supabase.anonKey) {
        missingFields.push('VITE_SUPABASE_ANON_KEY');
    }

    if (missingFields.length > 0) {
        console.error('Missing required environment variables:', missingFields);
        throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`);
    }

    console.log('✅ Configuration validated successfully');
    console.log('📊 App Config:', {
        name: appConfig.name,
        version: appConfig.version,
        env: appConfig.env,
        debug: appConfig.debug.enabled,
    });
};

/**
 * Development helper functions
 */
export const devHelpers = {
    /**
     * Log configuration in development
     */
    logConfig: () => {
        if (appConfig.debug.enableLogging) {
            console.group('🔧 App Configuration');
            console.log('Environment:', appConfig.env);
            console.log('Version:', appConfig.version);
            console.log('Debug Mode:', appConfig.debug.enabled);
            console.log('Experimental Features:', appConfig.features.experimentalFeatures);
            console.groupEnd();
        }
    },

    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled: (feature: keyof AppConfig['features']): boolean => {
        return appConfig.features[feature];
    },

    /**
     * Development mode checks
     */
    isDev: () => appConfig.isDevelopment,
    debugEnabled: () => appConfig.debug.enabled,
    loggingEnabled: () => appConfig.debug.enableLogging,
};

// Validate configuration on import
if (typeof window !== 'undefined') {
    validateConfig();
    devHelpers.logConfig();
}

export default appConfig;