/**
 * Navigation Types - TypeScript interfaces for navigation system
 * Updated with requiresAuth property for protected routes
 */

// Navigation Item Definition - Updated with auth support
export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon?: string;
    position: number; // 0-7 for radial positioning
    disabled?: boolean;
    external?: boolean;
    ariaLabel?: string;
    requiresAuth?: boolean; // NEW: Indicates if item requires authentication
}

// Navigation State
export interface NavigationState {
    isOpen: boolean;
    activeItem: string | null;
    hoveredItem: string | null;
    focusedItem: string | null;
    keyboardMode: boolean;
    isAnimating: boolean;
}

// Navigation Configuration
export interface NavigationConfig {
    items: NavigationItem[];
    animationDuration: number;
    radius: number;
    centerSize: number;
    itemSize: number;
    autoClose: boolean;
    closeDelay: number;
    enableKeyboard: boolean;
    enableTouch: boolean;
    centerIcon: string;
    centerLabel: string;
}

// Position Coordinates
export interface Position {
    x: number;
    y: number;
}

// Navigation Manager Interface - Updated with auth method
export interface INavigationManager {
    // Core methods
    open(): void;
    close(): void;
    toggle(): void;

    // Item management
    setHoveredItem(itemId: string | null): void;
    navigate(itemId: string): void;
    getItemPosition(position: number): Position;

    // State management
    getState(): NavigationState;
    getConfig(): NavigationConfig;
    updateConfig(newConfig: Partial<NavigationConfig>): void;
    updateAuthState(isAuthenticated: boolean): void; // NEW: Auth state management

    // Event handling
    subscribe(callback: (state: NavigationState) => void): () => void;
    setElement(element: HTMLElement): void;

    // Lifecycle
    destroy(): void;
}

// Hook Options
export interface UseNavigationOptions {
    autoInit?: boolean;
    customConfig?: Partial<NavigationConfig>;
    onStateChange?: (state: NavigationState) => void;
}

// Hook Return Type - Simplified without external config updates
export interface UseNavigationReturn {
    state: NavigationState;
    actions: {
        open: () => void;
        close: () => void;
        toggle: () => void;
        navigate: (itemId: string) => void;
        setHovered: (itemId: string | null) => void;
        updateAuthState: (isAuthenticated: boolean) => void; // NEW: Auth update method
    };
    config: NavigationConfig;
}

// Event Types - Updated with blocked navigation
export interface NavigationEvent {
    type: 'open' | 'close' | 'navigate' | 'navigate-blocked' | 'hover' | 'focus' | 'config-updated';
    item?: NavigationItem;
    state: NavigationState;
    timestamp: number;
}

// Analytics Event
export interface NavigationAnalyticsEvent {
    action: 'menu_open' | 'menu_close' | 'item_click' | 'item_hover' | 'keyboard_navigation' | 'auth_blocked';
    item_id?: string;
    item_label?: string;
    interaction_type: 'mouse' | 'keyboard' | 'touch';
    duration?: number;
    source_position?: Position;
    requires_auth?: boolean; // NEW: Track auth-protected interactions
}

// Accessibility Options
export interface NavigationA11yOptions {
    enableScreenReader: boolean;
    enableKeyboardNavigation: boolean;
    enableFocusManagement: boolean;
    announceStateChanges: boolean;
    customAriaLabels?: {
        menuButton?: string;
        openMenu?: string;
        closeMenu?: string;
        navigationMenu?: string;
        navigationItem?: (item: NavigationItem) => string;
        protectedItem?: (item: NavigationItem) => string; // NEW: Protected item labeling
    };
}

// Animation Options
export interface NavigationAnimationOptions {
    duration: number;
    easing: string;
    stagger: number;
    enableScaleAnimation: boolean;
    enableOpacityAnimation: boolean;
    enableTransformAnimation: boolean;
    reducedMotionFallback: boolean;
}

// Responsive Options
export interface NavigationResponsiveOptions {
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
    mobileConfig: Partial<NavigationConfig>;
    tabletConfig: Partial<NavigationConfig>;
    desktopConfig: Partial<NavigationConfig>;
}

// Theme Options
export interface NavigationThemeOptions {
    colors: {
        centerBackground: string;
        centerBackgroundHover: string;
        centerText: string;
        itemBackground: string;
        itemBackgroundHover: string;
        itemBackgroundActive: string;
        itemText: string;
        itemTextHover: string;
        focusOutline: string;
        shadow: string;
        protectedItemBackground?: string; // NEW: Protected item styling
        protectedItemText?: string; // NEW: Protected item text color
    };
    spacing: {
        radius: number;
        centerSize: number;
        itemSize: number;
        gap: number;
    };
    typography: {
        centerFontSize: string;
        centerFontWeight: string;
        itemFontSize: string;
        itemFontWeight: string;
        fontFamily: string;
    };
}

// Performance Options
export interface NavigationPerformanceOptions {
    enableVirtualization: boolean;
    enableLazyRendering: boolean;
    enableGPUAcceleration: boolean;
    enableWillChange: boolean;
    debounceDelay: number;
    throttleDelay: number;
}

// Default Configurations - Updated
export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
    items: [
        {
            id: 'home',
            label: 'Home',
            href: '#home',
            position: 0,
            requiresAuth: false
        },
        {
            id: 'add-meals',
            label: 'Add Meals',
            href: '#add-meals',
            position: 1,
            requiresAuth: true
        },
        {
            id: 'journal',
            label: 'Journal',
            href: '#journal',
            position: 2,
            requiresAuth: true
        }
    ],
    animationDuration: 300,
    radius: 120,
    centerSize: 60,
    itemSize: 48,
    autoClose: true,
    closeDelay: 2000,
    enableKeyboard: true,
    enableTouch: true,
    centerIcon: '☰',
    centerLabel: 'Menu'
};

export const DEFAULT_A11Y_OPTIONS: NavigationA11yOptions = {
    enableScreenReader: true,
    enableKeyboardNavigation: true,
    enableFocusManagement: true,
    announceStateChanges: true
};

// Type Guards - Updated
export const isNavigationItem = (item: any): item is NavigationItem => {
    return (
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.label === 'string' &&
        typeof item.href === 'string' &&
        typeof item.position === 'number'
    );
};

export const isNavigationState = (state: any): state is NavigationState => {
    return (
        typeof state === 'object' &&
        typeof state.isOpen === 'boolean' &&
        typeof state.keyboardMode === 'boolean'
    );
};

// Utility Types
export type NavigationItemId = NavigationItem['id'];
export type NavigationDirection = 'up' | 'down' | 'left' | 'right';
export type NavigationTrigger = 'hover' | 'click' | 'keyboard' | 'touch';
export type NavigationTheme = 'light' | 'dark' | 'auto';

// Error Types
export class NavigationError extends Error {
    constructor(
        message: string,
        public code: string,
        public context?: any
    ) {
        super(message);
        this.name = 'NavigationError';
    }
}

export class NavigationItemNotFoundError extends NavigationError {
    constructor(itemId: string) {
        super(`Navigation item with id "${itemId}" not found`, 'ITEM_NOT_FOUND', { itemId });
    }
}

export class NavigationConfigError extends NavigationError {
    constructor(message: string, config?: any) {
        super(`Navigation configuration error: ${message}`, 'CONFIG_ERROR', { config });
    }
}

export class NavigationAuthError extends NavigationError {
    constructor(itemId: string) {
        super(`Access to "${itemId}" requires authentication`, 'AUTH_REQUIRED', { itemId });
    }
}