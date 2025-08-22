/**
 * Simplified useNavigation Hook - Works with centralized NavigationManager configuration
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import NavigationManager from '../managers/NavigationManager';
import type {
    NavigationState,
    NavigationConfig,
    UseNavigationOptions,
    UseNavigationReturn,
    NavigationEvent
} from '../types/navigation';

const useNavigation = (options: UseNavigationOptions = {}): UseNavigationReturn => {
    const { autoInit = true, onStateChange } = options;

    // Stable refs
    const managerRef = useRef<NavigationManager | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);
    const onStateChangeRef = useRef(onStateChange);

    // Update ref without causing re-render
    onStateChangeRef.current = onStateChange;

    const [state, setState] = useState<NavigationState>(() => {
        const manager = NavigationManager.getInstance();
        return manager.getState();
    });

    const [config, setConfig] = useState<NavigationConfig>(() => ({
        items: [],
        animationDuration: 300,
        radius: 120,
        centerSize: 60,
        itemSize: 50,
        autoClose: true,
        closeDelay: 1000,
        enableKeyboard: true,
        enableTouch: true,
        centerIcon: 'menu',
        centerLabel: 'Menu'
    }));

    // Initialize manager once
    useEffect(() => {
        if (!autoInit) return;

        managerRef.current = NavigationManager.getInstance();

        // Get initial config and state from centralized manager
        setConfig(managerRef.current.getConfig());
        setState(managerRef.current.getState());

        // Subscribe to state changes
        unsubscribeRef.current = managerRef.current.subscribe((newState) => {
            setState(newState);
            onStateChangeRef.current?.(newState);
        });

        // Listen for config updates
        const handleConfigUpdate = () => {
            if (managerRef.current) {
                setConfig(managerRef.current.getConfig());
            }
        };

        document.addEventListener('navigation:config-updated', handleConfigUpdate);

        return () => {
            unsubscribeRef.current?.();
            unsubscribeRef.current = null;
            document.removeEventListener('navigation:config-updated', handleConfigUpdate);
        };
    }, [autoInit]);

    // Memoized actions
    const actions = useMemo(() => ({
        open: () => managerRef.current?.open(),
        close: () => managerRef.current?.close(),
        toggle: () => managerRef.current?.toggle(),
        navigate: (itemId: string) => managerRef.current?.navigate(itemId),
        setHovered: (itemId: string | null) => managerRef.current?.setHoveredItem(itemId),
        updateAuthState: (isAuthenticated: boolean) => managerRef.current?.updateAuthState(isAuthenticated)
    }), []);

    return { state, actions, config };
};

/**
 * Navigation Events Hook - No changes needed
 */
export const useNavigationEvents = (
    eventType: NavigationEvent['type'] | 'all',
    callback: (event: NavigationEvent) => void,
    deps: React.DependencyList = []
) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        const handleEvent = (e: Event) => {
            const customEvent = e as CustomEvent;
            const event: NavigationEvent = {
                type: customEvent.type.replace('navigation:', '') as NavigationEvent['type'],
                item: customEvent.detail?.item,
                state: customEvent.detail?.state || NavigationManager.getInstance().getState(),
                timestamp: Date.now()
            };

            if (eventType === 'all' || event.type === eventType) {
                callbackRef.current(event);
            }
        };

        const events = eventType === 'all'
            ? ['navigation:open', 'navigation:close', 'navigation:navigate', 'navigation:navigate-blocked', 'navigation:hover', 'navigation:focus', 'navigation:config-updated']
            : [`navigation:${eventType}`];

        events.forEach(eventName => {
            document.addEventListener(eventName, handleEvent);
        });

        return () => {
            events.forEach(eventName => {
                document.removeEventListener(eventName, handleEvent);
            });
        };
    }, [eventType, ...deps]);
};

/**
 * Navigation Item Hook - No changes needed
 */
export const useNavigationItem = (itemId: string) => {
    const { state, actions } = useNavigation();

    return useMemo(() => ({
        isActive: state.activeItem === itemId,
        isHovered: state.hoveredItem === itemId,
        isFocused: state.focusedItem === itemId,
        navigate: () => actions.navigate(itemId),
        setHovered: (hovered: boolean) => actions.setHovered(hovered ? itemId : null)
    }), [state.activeItem, state.hoveredItem, state.focusedItem, itemId, actions]);
};

/**
 * Auth-aware Navigation Hook - Simplified to work with centralized manager
 */
export const useAuthNavigation = (isAuthenticated: boolean, authLoading: boolean = false) => {
    const navigation = useNavigation();

    // Update auth state in NavigationManager when auth state changes
    useEffect(() => {
        if (!authLoading && navigation.actions.updateAuthState) {
            navigation.actions.updateAuthState(isAuthenticated);
        }
    }, [isAuthenticated, authLoading, navigation.actions]);

    return navigation;
};

export default useNavigation;