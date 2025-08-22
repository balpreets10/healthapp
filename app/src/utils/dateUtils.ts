/**
 * Utility functions for date handling in the application
 */

/**
 * Get the current local date in YYYY-MM-DD format
 * This ensures consistent date handling across the app
 */
export const getLocalDateString = (date: Date = new Date()): string => {
    return date.getFullYear() + '-' + 
        String(date.getMonth() + 1).padStart(2, '0') + '-' + 
        String(date.getDate()).padStart(2, '0');
};

/**
 * Get the current local time in HH:MM format
 */
export const getLocalTimeString = (date: Date = new Date()): string => {
    return date.toTimeString().split(' ')[0].substring(0, 5);
};

/**
 * Check if two dates are the same day (local time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return getLocalDateString(date1) === getLocalDateString(date2);
};

/**
 * Get today's date string in local time
 */
export const getTodayDateString = (): string => {
    return getLocalDateString();
};