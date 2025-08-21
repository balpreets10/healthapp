import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import NavigationManager from '../../managers/NavigationManager';
import { useAuth } from '../../hooks/useAuth';
import { prefersReducedMotion } from '../../utils/helpers';
import './ModernNavigation.css';

interface ModernNavigationProps {
    className?: string;
    position?: 'top' | 'bottom' | 'fixed-top' | 'fixed-bottom';
    onNavigate?: (itemId: string) => void;
    brand?: string;
    brandHref?: string;
}

interface NavigationState {
    isOpen: boolean;
    activeItem: string | null;
    hoveredItem: string | null;
    focusedItem: string | null;
    keyboardMode: boolean;
}

const ModernNavigation: React.FC<ModernNavigationProps> = ({
    className = '',
    position = 'fixed-top',
    onNavigate,
    brand = 'Health Tracker',
    brandHref = '#home'
}) => {
    const navRef = useRef<HTMLDivElement>(null);
    const onNavigateRef = useRef(onNavigate);
    const managerRef = useRef<NavigationManager>();

    // Get auth state
    const { isAuthenticated, loading: authLoading } = useAuth();

    onNavigateRef.current = onNavigate;

    if (!managerRef.current) {
        managerRef.current = NavigationManager.getInstance();
    }

    const [config, setConfig] = useState(() => managerRef.current?.getConfig() ?? { items: [] });
    const [navState, setNavState] = useState<NavigationState>(() => ({
        isOpen: false,
        activeItem: 'home',
        hoveredItem: null,
        focusedItem: null,
        keyboardMode: false
    }));

    const [isScrolled, setIsScrolled] = useState(false);

    const reducedMotion = useMemo(() => prefersReducedMotion(), []);

    // Handle scroll effect for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initialize navigation manager
    useEffect(() => {
        const manager = managerRef.current!;

        if (navRef.current) {
            manager.setElement(navRef.current);
        }

        const unsubscribe = manager.subscribe(setNavState);
        setConfig(manager.getConfig());

        // Update auth state
        if (!authLoading) {
            manager.updateAuthState(isAuthenticated);
        }

        return () => {
            unsubscribe();
        };
    }, [isAuthenticated, authLoading]);



    // Updated: All items are always clickable now
    const handleItemClick = useCallback((itemId: string) => {
        onNavigateRef.current?.(itemId);
        managerRef.current!.navigate(itemId);
    }, []);

    const handleItemKeyDown = useCallback((e: React.KeyboardEvent, itemId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick(itemId);
        }
    }, [handleItemClick]);

    const handleItemMouseEnter = useCallback((itemId: string) => {
        managerRef.current!.setHoveredItem(itemId);
    }, []);

    const handleItemMouseLeave = useCallback(() => {
        managerRef.current!.setHoveredItem(null);
    }, []);


    const handleBrandClick = useCallback(() => {
        if (brandHref.startsWith('#')) {
            const homeItem = config.items.find(item => item.href === brandHref);
            if (homeItem) {
                handleItemClick(homeItem.id);
            }
        } else {
            window.location.href = brandHref;
        }
    }, [brandHref, config.items, handleItemClick]);

    const getItemIcon = useCallback((itemId: string) => {
        const iconMap: { [key: string]: string } = {
            'home': '🏠',
            'add-meals': '🍽️',
            'journal': '📔'
        };
        return iconMap[itemId] || '📄';
    }, []);


    const navClasses = useMemo(() => [
        'modern-nav',
        `modern-nav--${position}`,
        className,
        navState.keyboardMode && 'modern-nav--keyboard',
        reducedMotion && 'modern-nav--reduced-motion',
        isScrolled && 'modern-nav--scrolled'
    ].filter(Boolean).join(' '), [
        position,
        className,
        navState.keyboardMode,
        reducedMotion,
        isScrolled
    ]);

    return (
        <nav
            ref={navRef}
            className={navClasses}
            aria-label="Main navigation"
            role="navigation"
        >
            <div className="modern-nav__container">
                {/* Brand/Logo */}
                <button
                    className="modern-nav__brand"
                    onClick={handleBrandClick}
                    aria-label={`Go to ${brand} home page`}
                    type="button"
                >
                    {brand}
                </button>

                {/* Desktop Navigation - Centered */}
                <ul className="modern-nav__list" role="menubar">
                    {config.items.map((item) => {
                        const isActive = navState.activeItem === item.id;
                        const isHovered = navState.hoveredItem === item.id;
                        const isFocused = navState.focusedItem === item.id;

                        // All items are now always enabled
                        const itemClasses = [
                            'modern-nav__item',
                            isActive && 'modern-nav__item--active',
                            isHovered && 'modern-nav__item--hovered',
                            isFocused && 'modern-nav__item--focused'
                        ].filter(Boolean).join(' ');

                        return (
                            <li key={item.id} className={itemClasses}>
                                <button
                                    className="modern-nav__link"
                                    data-nav-item={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    onKeyDown={(e) => handleItemKeyDown(e, item.id)}
                                    onMouseEnter={() => handleItemMouseEnter(item.id)}
                                    onMouseLeave={handleItemMouseLeave}
                                    role="menuitem"
                                    aria-current={isActive ? 'page' : undefined}
                                    aria-label={item.ariaLabel || `Navigate to ${item.label}`}
                                    type="button"
                                >
                                    <span className="modern-nav__icon">
                                        {getItemIcon(item.id)}
                                    </span>
                                    <span className="modern-nav__label">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}

                    {/* Profile as a nav item
                    <li className={`modern-nav__item modern-nav__item--profile ${navState.activeItem === 'profile' ? 'modern-nav__item--active' : ''}`}>
                        <ProfileDropdown />
                    </li> */}
                </ul>

                {/* Right side - empty for balance */}
                <div className="modern-nav__right">
                </div>
            </div>

        </nav>
    );
};

export default ModernNavigation;