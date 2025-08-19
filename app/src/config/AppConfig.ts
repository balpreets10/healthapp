/**
 * Application Configuration Manager
 * Simplified for development environment only
 */

export interface AppConfig {
    // Environment
    env: 'development';
    isDevelopment: true;
    isProduction: false;

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
 * Application configuration instance
 * Always configured for development environment
 */
export const appConfig: AppConfig = {
    // Environment - always development
    env: 'development',
    isDevelopment: true,
    isProduction: false,

    // App Info
    name: getEnvVar('VITE_APP_NAME', 'Health Tracker Prototype'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0-dev'),
    description: getEnvVar('VITE_APP_DESCRIPTION', 'Health and nutrition tracking prototype'),

    // API Configuration
    api: {
        baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3001/api'),
        timeout: getNumericEnvVar('VITE_API_TIMEOUT', 10000),
    },

    // Supabase Configuration
    supabase: {
        url: getEnvVar('VITE_SUPABASE_URL'),
        anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
    },

    // Development Features - all enabled
    debug: {
        enabled: getBooleanEnvVar('VITE_DEBUG_MODE', true),
        showPanel: getBooleanEnvVar('VITE_ENABLE_DEBUG_PANEL', true),
        enableLogging: getBooleanEnvVar('VITE_ENABLE_LOGGING', true),
        enablePerformanceMonitoring: getBooleanEnvVar('VITE_ENABLE_PERFORMANCE_MONITORING', true),
    },

    // Feature Flags - experimental features enabled in development
    features: {
        experimentalFeatures: getBooleanEnvVar('VITE_ENABLE_EXPERIMENTAL_FEATURES', true),
    },
};

/**
 * Validate required configuration
 */
export const validateConfig = (): void => {
    const requiredFields = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
    ];

    const missingFields = requiredFields.filter(field => !getEnvVar(field));

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