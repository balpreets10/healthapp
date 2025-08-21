/**
 * NavigationManager - Updated for React Router navigation
 * Now handles both auth prompts and page navigation
 */

import type { NavigationState, NavigationConfig, NavigationItem, Position, INavigationManager } from '../types/navigation';

class NavigationManager implements INavigationManager {
    private static instance: NavigationManager | null = null;
    private element: HTMLElement | null = null;
    private state: NavigationState;
    private config: NavigationConfig;
    private subscribers: Set<(state: NavigationState) => void> = new Set();
    private keyboardHandler: ((e: KeyboardEvent) => void) | null = null;
    private mouseHandler: ((e: MouseEvent) => void) | null = null;
    private touchHandler: ((e: TouchEvent) => void) | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private isInitialized = false;
    private isAuthenticated = false;

    private constructor() {
        // UPDATED: Navigation items now use router paths
        this.config = {
            items: [
                {
                    id: 'home',
                    label: 'Home',
                    href: '/',
                    position: 0,
                    disabled: false,
                    requiresAuth: false,
                    ariaLabel: 'Navigate to Home'
                },
                {
                    id: 'add-meals',
                    label: 'Add Meals',
                    href: '/add-meals',
                    position: 1,
                    disabled: false,
                    requiresAuth: true,
                    ariaLabel: 'Navigate to Add Meals'
                },
                {
                    id: 'journal',
                    label: 'Journal',
                    href: '/journal',
                    position: 2,
                    disabled: false,
                    requiresAuth: true,
                    ariaLabel: 'Navigate to Health Journal'
                },
                {
                    id: 'profile',
                    label: 'Profile',
                    href: '/profile',
                    position: 3,
                    disabled: false,
                    requiresAuth: true,
                    ariaLabel: 'Navigate to Profile'
                }
            ],
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
        };

        this.state = {
            isOpen: false,
            activeItem: this.getActiveItemFromPath(),
            hoveredItem: null,
            focusedItem: null,
            keyboardMode: false,
            isAnimating: false
        };

        this.init();
    }

    public static getInstance(): NavigationManager {
        if (!NavigationManager.instance) {
            NavigationManager.instance = new NavigationManager();
        }
        return NavigationManager.instance;
    }

    private init(): void {
        if (this.isInitialized) return;

        this.setupEventListeners();
        this.setupRouterListeners();
        this.isInitialized = true;

        console.log('✅ NavigationManager initialized - router-based navigation enabled');
    }

    /**
     * NEW: Listen for route changes to update active item
     */
    private setupRouterListeners(): void {
        // Listen for popstate (back/forward button)
        window.addEventListener('popstate', () => {
            this.updateActiveItemFromPath();
        });

        // Listen for pushstate/replacestate (programmatic navigation)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            setTimeout(() => this.updateActiveItemFromPath(), 0);
        };

        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            setTimeout(() => this.updateActiveItemFromPath(), 0);
        };
    }

    /**
     * NEW: Get active item based on current path
     */
    private getActiveItemFromPath(): string {
        const path = window.location.pathname;
        const item = this.config.items.find(item => item.href === path);
        return item ? item.id : 'home';
    }

    /**
     * NEW: Update active item when route changes
     */
    private updateActiveItemFromPath(): void {
        const activeItem = this.getActiveItemFromPath();
        if (this.state.activeItem !== activeItem) {
            this.setState({ activeItem });
        }
    }

    public updateAuthState(isAuthenticated: boolean): void {
        this.isAuthenticated = isAuthenticated;
        console.log(`🔐 Navigation auth state updated: ${isAuthenticated ? 'authenticated' : 'not authenticated'}`);
        console.log('🔐 All navigation items remain enabled');
    }

    private setupEventListeners(): void {
        // Keyboard navigation
        this.keyboardHandler = (e: KeyboardEvent) => {
            if (!this.config.enableKeyboard) return;

            switch (e.key) {
                case 'Escape':
                    if (this.state.isOpen) {
                        this.close();
                        e.preventDefault();
                    }
                    break;
                case 'Tab':
                    this.setState({ keyboardMode: true });
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    if (this.state.isOpen) {
                        this.handleKeyboardNavigation(e.key);
                        e.preventDefault();
                    }
                    break;
                case 'Enter':
                case ' ':
                    if (this.state.focusedItem && this.state.isOpen) {
                        this.navigate(this.state.focusedItem);
                        e.preventDefault();
                    }
                    break;
            }
        };

        // Mouse events
        this.mouseHandler = (e: MouseEvent) => {
            if (this.state.keyboardMode) {
                this.setState({ keyboardMode: false });
            }
        };

        // Touch events for mobile
        this.touchHandler = (e: TouchEvent) => {
            if (!this.config.enableTouch) return;
        };

        document.addEventListener('keydown', this.keyboardHandler);
        document.addEventListener('mousedown', this.mouseHandler);
        document.addEventListener('touchstart', this.touchHandler, { passive: true });
    }

    private handleKeyboardNavigation(key: string): void {
        const currentIndex = this.config.items.findIndex(item => item.id === this.state.focusedItem);
        let newIndex = currentIndex;

        switch (key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                newIndex = currentIndex > 0 ? currentIndex - 1 : this.config.items.length - 1;
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                newIndex = currentIndex < this.config.items.length - 1 ? currentIndex + 1 : 0;
                break;
        }

        const newItem = this.config.items[newIndex];
        if (newItem) {
            this.setState({ focusedItem: newItem.id });
        }
    }

    public setElement(element: HTMLElement): void {
        this.element = element;

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        this.resizeObserver = new ResizeObserver(() => {
            this.updateLayout();
        });

        this.resizeObserver.observe(element);
    }

    private updateLayout(): void {
        // Handle responsive layout updates if needed
    }

    public open(): void {
        if (this.state.isOpen || this.state.isAnimating) return;

        this.setState({
            isOpen: true,
            isAnimating: true,
            focusedItem: this.config.items[0]?.id || null
        });

        setTimeout(() => {
            this.setState({ isAnimating: false });
        }, this.config.animationDuration);

        this.emitEvent('open', null);
    }

    public close(): void {
        if (!this.state.isOpen || this.state.isAnimating) return;

        this.setState({
            isOpen: false,
            isAnimating: true,
            hoveredItem: null,
            focusedItem: null
        });

        setTimeout(() => {
            this.setState({ isAnimating: false });
        }, this.config.animationDuration);

        this.emitEvent('close', null);
    }

    public toggle(): void {
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * UPDATED: Handle both auth checking and router navigation
     */
    public navigate(itemId: string): void {
        const item = this.config.items.find(i => i.id === itemId);

        if (!item) {
            console.warn(`Navigation item "${itemId}" not found`);
            return;
        }

        // Check if item requires auth and user is not authenticated
        if (item.requiresAuth && !this.isAuthenticated) {
            console.log(`🔒 "${itemId}" requires authentication - showing login prompt`);
            this.emitEvent('auth-required', item);
            this.showAuthPrompt(item);
            return;
        }

        // Handle navigation
        if (item.external) {
            window.open(item.href, '_blank', 'noopener,noreferrer');
        } else {
            // Use React Router navigation for internal routes
            this.navigateToRoute(item.href);
        }

        // Auto-close if enabled
        if (this.config.autoClose) {
            setTimeout(() => {
                this.close();
            }, this.config.closeDelay);
        }

        this.emitEvent('navigate', item);
    }

    /**
     * NEW: Navigate to route using React Router
     */
    private navigateToRoute(path: string): void {
        // Check if we're already on this route
        if (window.location.pathname === path) {
            return;
        }

        // Use pushState for client-side navigation
        window.history.pushState(null, '', path);

        // Dispatch popstate event to trigger router re-render
        window.dispatchEvent(new PopStateEvent('popstate'));

        console.log(`🌐 Navigated to: ${path}`);
    }

    /**
     * Enhanced auth prompt with route information
     */
    private showAuthPrompt(item: NavigationItem): void {
        const existingModal = document.getElementById('auth-prompt-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'auth-prompt-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: var(--gd-surface-raised, white);
            border-radius: var(--gd-radius-2xl, 16px);
            padding: var(--gd-space-8, 2rem);
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: var(--gd-shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
            border: 1px solid var(--gd-border-light, #e5e7eb);
        `;

        modalContent.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: var(--gd-text-primary, #000); font-size: var(--gd-font-size-xl, 1.25rem);">
                Sign in to access ${item.label}
            </h3>
            <p style="margin: 0 0 1.5rem 0; color: var(--gd-text-secondary, #666); font-size: var(--gd-font-size-base, 1rem);">
                Please sign in with Google to continue to ${item.label.toLowerCase()}.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="google-signin-btn" style="
                    background: #4285f4;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--gd-radius-lg, 8px);
                    font-size: var(--gd-font-size-base, 1rem);
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: background 0.2s;
                ">
                    🔐 Sign in with Google
                </button>
                <button id="cancel-btn" style="
                    background: var(--gd-bg-secondary, #f3f4f6);
                    color: var(--gd-text-primary, #000);
                    border: 1px solid var(--gd-border-light, #e5e7eb);
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--gd-radius-lg, 8px);
                    font-size: var(--gd-font-size-base, 1rem);
                    cursor: pointer;
                    transition: background 0.2s;
                ">
                    Cancel
                </button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add event listeners
        const googleBtn = modal.querySelector('#google-signin-btn') as HTMLButtonElement;
        const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement;

        googleBtn?.addEventListener('click', () => {
            this.emitEvent('google-signin-requested', item);
            modal.remove();
        });

        cancelBtn?.addEventListener('click', () => {
            modal.remove();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on Escape key
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Auto-remove listener when modal is removed
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach((node) => {
                        if (node === modal) {
                            document.removeEventListener('keydown', handleEscape);
                            observer.disconnect();
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true });
    }

    public setHoveredItem(itemId: string | null): void {
        if (this.state.hoveredItem !== itemId) {
            this.setState({ hoveredItem: itemId });

            if (itemId) {
                const item = this.config.items.find(i => i.id === itemId);
                this.emitEvent('hover', item || null);
            }
        }
    }

    public getItemPosition(position: number): Position {
        const angle = (position * (360 / this.config.items.length) - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * this.config.radius;
        const y = Math.sin(angle) * this.config.radius;
        return { x, y };
    }

    public getState(): NavigationState {
        return { ...this.state };
    }

    public getConfig(): NavigationConfig {
        return { ...this.config };
    }

    public updateConfig(newConfig: Partial<NavigationConfig>): void {
        const { items, ...safeConfig } = newConfig;

        if (items) {
            console.warn('Navigation items cannot be updated via updateConfig. Use updateAuthState() for auth-related changes.');
        }

        this.config = {
            ...this.config,
            ...safeConfig
        };

        this.emitEvent('config-updated', null);
        this.notifySubscribers();
    }

    public subscribe(callback: (state: NavigationState) => void): () => void {
        this.subscribers.add(callback);

        return () => {
            this.subscribers.delete(callback);
        };
    }

    private setState(newState: Partial<NavigationState>): void {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => {
            try {
                callback(this.state);
            } catch (error) {
                console.error('Error in navigation subscriber:', error);
            }
        });
    }

    private emitEvent(type: string, item: NavigationItem | null): void {
        const event = new CustomEvent(`navigation:${type}`, {
            detail: { item, state: this.state },
            bubbles: true
        });

        document.dispatchEvent(event);
    }

    public destroy(): void {
        // Clean up event listeners
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
        }
        if (this.mouseHandler) {
            document.removeEventListener('mousedown', this.mouseHandler);
        }
        if (this.touchHandler) {
            document.removeEventListener('touchstart', this.touchHandler);
        }

        // Clean up resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        // Remove any existing auth prompts
        const existingModal = document.getElementById('auth-prompt-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Clear subscribers
        this.subscribers.clear();

        // Reset instance
        NavigationManager.instance = null;
        this.isInitialized = false;

        console.log('🧹 NavigationManager destroyed');
    }
}

export default NavigationManager;