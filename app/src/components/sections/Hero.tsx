import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useContentManager } from '../../hooks/useContentManager';
import { useAuth } from '../../hooks/useAuth';
import './Hero.css';

interface HeroProps {
    title?: string;
    subtitle?: string;
    description?: string;
    primaryCtaText?: string;
    secondaryCtaText?: string;
    onPrimaryCtaClick?: () => void;
    onSecondaryCtaClick?: () => void;
    showParticles?: boolean;
    showAchievements?: boolean;
    autoScroll?: boolean;
}

interface MealData {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
}

interface Achievement {
    number: string;
    label: string;
    icon: string;
    ariaLabel?: string;
}

interface Technology {
    name: string;
    icon: string;
    ariaLabel?: string;
}

interface MousePosition {
    x: number;
    y: number;
}

interface ParticleData {
    id: number;
    delay: number;
    duration: number;
    x: number;
    y: number;
    size: number;
}

const Hero: React.FC<HeroProps> = ({
    title = "Your Health Journey Starts Here",
    subtitle = "Track nutrition, monitor wellness, achieve your goals",
    description = "Take control of your health with comprehensive meal tracking, nutrition insights, and personalized wellness monitoring.",
    primaryCtaText = "Sign In to Get Started",
    secondaryCtaText = "",
    onPrimaryCtaClick,
    onSecondaryCtaClick,
    showParticles = false,
    showAchievements = false,
    autoScroll = false
}) => {
    // Refs
    const heroRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const particleSystemRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();

    // State
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    // Hooks
    const { setCurrentSection } = useContentManager();
    const { isAuthenticated, user } = useAuth();

    // Sample meal data for visualization when signed in
    const todaysMeals: MealData[] = useMemo(() => [
        {
            id: '1',
            name: 'Oatmeal with Berries',
            calories: 320,
            protein: 12,
            carbs: 58,
            fat: 6,
            mealType: 'breakfast',
            time: '8:00 AM'
        },
        {
            id: '2',
            name: 'Grilled Chicken Salad',
            calories: 450,
            protein: 35,
            carbs: 25,
            fat: 18,
            mealType: 'lunch',
            time: '12:30 PM'
        },
        {
            id: '3',
            name: 'Greek Yogurt',
            calories: 150,
            protein: 15,
            carbs: 12,
            fat: 5,
            mealType: 'snack',
            time: '3:15 PM'
        }
    ], []);

    // Calculate nutrition summary
    const nutritionSummary = useMemo(() => {
        const totals = todaysMeals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fat: acc.fat + meal.fat
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
        return {
            ...totals,
            goalCalories: 2000,
            goalProtein: 150,
            goalCarbs: 250,
            goalFat: 65
        };
    }, [todaysMeals]);

    // Generate particles data
    const particlesData: ParticleData[] = useMemo(() => {
        if (!showParticles) return [];

        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            delay: Math.random() * 4,
            duration: 4 + Math.random() * 3,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 2 + Math.random() * 3
        }));
    }, [showParticles]);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Intersection Observer for visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setCurrentSection('hero');
                    setIsVisible(true);

                    // Add animation classes with reduced motion support
                    if (!reducedMotion) {
                        heroRef.current?.classList.add('hero--animate-in');
                        contentRef.current?.classList.add('hero__content--stagger');
                    }
                }
            },
            {
                threshold: 0.3,
                rootMargin: '0px 0px -10% 0px'
            }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, [setCurrentSection, reducedMotion]);

    // Mouse move handler with throttling for performance
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!heroRef.current || reducedMotion) return;

        const rect = heroRef.current.getBoundingClientRect();
        const newPosition = {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        };

        setMousePosition(newPosition);
    }, [reducedMotion]);

    // Throttled mouse move effect
    useEffect(() => {
        if (!heroRef.current || reducedMotion) return;

        let timeoutId: NodeJS.Timeout;

        const throttledMouseMove = (e: MouseEvent) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => handleMouseMove(e), 16); // ~60fps
        };

        const heroElement = heroRef.current;
        heroElement.addEventListener('mousemove', throttledMouseMove);
        heroElement.addEventListener('mouseenter', () => setIsHovered(true));
        heroElement.addEventListener('mouseleave', () => setIsHovered(false));

        return () => {
            heroElement.removeEventListener('mousemove', throttledMouseMove);
            heroElement.removeEventListener('mouseenter', () => setIsHovered(true));
            heroElement.removeEventListener('mouseleave', () => setIsHovered(false));
            clearTimeout(timeoutId);
        };
    }, [handleMouseMove, reducedMotion]);

    // CTA Click Handlers
    const handlePrimaryCtaClick = useCallback((): void => {
        if (onPrimaryCtaClick) {
            onPrimaryCtaClick();
        } else {
            const contactSection = document.getElementById('contact');
            contactSection?.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    }, [onPrimaryCtaClick, reducedMotion]);

    const handleSecondaryCtaClick = useCallback((): void => {
        if (onSecondaryCtaClick) {
            onSecondaryCtaClick();
        } else {
            const projectsSection = document.getElementById('projects');
            projectsSection?.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    }, [onSecondaryCtaClick, reducedMotion]);

    // Keyboard navigation for accessibility
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();

            if (autoScroll) {
                const aboutSection = document.getElementById('about');
                aboutSection?.scrollIntoView({
                    behavior: reducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        }
    }, [autoScroll, reducedMotion]);

    // Auto-scroll to next section
    const handleScrollIndicatorClick = useCallback(() => {
        const aboutSection = document.getElementById('about');
        aboutSection?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });
    }, [reducedMotion]);


    return (
        <section
            ref={heroRef}
            id="hero"
            className="hero"
            aria-label="Hero section - Health Tracker"
            role="banner"
        >
            <div className="hero__container">
                <div className="hero__content-wrapper" ref={contentRef}>
                    {!isAuthenticated ? (
                        // Not signed in - Show simple sign in interface
                        <div className="hero__auth-content">
                            <div className="hero__auth-visual">
                                <div className="hero__health-icon">🍎</div>
                            </div>

                            <div className="hero__auth-text">
                                <h1 className="hero__title">{title}</h1>
                                <h2 className="hero__subtitle">{subtitle}</h2>
                                <p className="hero__description">{description}</p>

                                <div className="hero__cta-group">
                                    <button
                                        className="hero__cta hero__cta--primary"
                                        onClick={handlePrimaryCtaClick}
                                        aria-label="Sign in to start tracking your health"
                                        type="button"
                                    >
                                        <span className="hero__cta-icon">🔑</span>
                                        <span className="hero__cta-text">{primaryCtaText}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Signed in - Show personalized dashboard with meals visualization
                        <div className="hero__dashboard-content">
                            <div className="hero__welcome">
                                <p className="hero__dashboard-greeting">
                                    Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'}! 👋
                                </p>
                            </div>

                            <div className="hero__meals-visualization">
                                {/* Unified Pie Chart for Macros */}
                                <div className="hero__macro-pie-chart">
                                    <svg className="hero__pie-svg" width="200" height="200" viewBox="0 0 42 42">
                                        {/* Background circle */}
                                        <circle
                                            className="hero__pie-bg"
                                            cx="21"
                                            cy="21"
                                            r="15.91549430918954"
                                            fill="transparent"
                                            stroke="#e2e8f0"
                                            strokeWidth="3"
                                        />

                                        {(() => {
                                            const total = nutritionSummary.protein + nutritionSummary.carbs + nutritionSummary.fat;
                                            if (total === 0) return null;

                                            const proteinPercentage = (nutritionSummary.protein / total) * 100;
                                            const carbsPercentage = (nutritionSummary.carbs / total) * 100;
                                            const fatPercentage = (nutritionSummary.fat / total) * 100;

                                            let cumulativePercentage = 0;

                                            const segments = [];

                                            // Protein segment
                                            if (proteinPercentage > 0) {
                                                segments.push(
                                                    <circle
                                                        key="protein"
                                                        className="hero__pie-segment hero__pie-segment--protein"
                                                        cx="21"
                                                        cy="21"
                                                        r="15.91549430918954"
                                                        fill="transparent"
                                                        stroke="#10b981"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${proteinPercentage} ${100 - proteinPercentage}`}
                                                        strokeDashoffset={25 - cumulativePercentage}
                                                        transform="rotate(-90 21 21)"
                                                    />
                                                );
                                                cumulativePercentage += proteinPercentage;
                                            }

                                            // Carbs segment
                                            if (carbsPercentage > 0) {
                                                segments.push(
                                                    <circle
                                                        key="carbs"
                                                        className="hero__pie-segment hero__pie-segment--carbs"
                                                        cx="21"
                                                        cy="21"
                                                        r="15.91549430918954"
                                                        fill="transparent"
                                                        stroke="#f59e0b"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${carbsPercentage} ${100 - carbsPercentage}`}
                                                        strokeDashoffset={25 - cumulativePercentage}
                                                        transform="rotate(-90 21 21)"
                                                    />
                                                );
                                                cumulativePercentage += carbsPercentage;
                                            }

                                            // Fat segment
                                            if (fatPercentage > 0) {
                                                segments.push(
                                                    <circle
                                                        key="fat"
                                                        className="hero__pie-segment hero__pie-segment--fat"
                                                        cx="21"
                                                        cy="21"
                                                        r="15.91549430918954"
                                                        fill="transparent"
                                                        stroke="#ec4899"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${fatPercentage} ${100 - fatPercentage}`}
                                                        strokeDashoffset={25 - cumulativePercentage}
                                                        transform="rotate(-90 21 21)"
                                                    />
                                                );
                                            }

                                            return segments;
                                        })()}

                                        {/* Center content */}
                                        <text x="21" y="22" textAnchor="middle" className="hero__pie-calories">
                                            {nutritionSummary.calories}
                                        </text>
                                        <text x="21" y="29" textAnchor="middle" className="hero__pie-calories-label">
                                            calories
                                        </text>
                                    </svg>

                                    {/* Legend */}
                                    <div className="hero__macro-legend">
                                        <div className="hero__legend-item hero__legend-item--protein">
                                            <span className="hero__legend-color"></span>
                                            <span className="hero__legend-label">Protein</span>
                                            <span className="hero__legend-value">{nutritionSummary.protein}g</span>
                                        </div>
                                        <div className="hero__legend-item hero__legend-item--carbs">
                                            <span className="hero__legend-color"></span>
                                            <span className="hero__legend-label">Carbs</span>
                                            <span className="hero__legend-value">{nutritionSummary.carbs}g</span>
                                        </div>
                                        <div className="hero__legend-item hero__legend-item--fat">
                                            <span className="hero__legend-color"></span>
                                            <span className="hero__legend-label">Fat</span>
                                            <span className="hero__legend-value">{nutritionSummary.fat}g</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Today's Meals List */}
                                <div className="hero__meals-list">
                                    <h3 className="hero__meals-title">Today's Meals</h3>
                                    {todaysMeals.length > 0 ? (
                                        <div className="hero__meals-grid">
                                            {todaysMeals.map((meal, index) => (
                                                <div key={meal.id} className="hero__meal-card">
                                                    <div className="hero__meal-header">
                                                        <span className="hero__meal-type">
                                                            {meal.mealType === 'breakfast' && '🌅'}
                                                            {meal.mealType === 'lunch' && '☀️'}
                                                            {meal.mealType === 'dinner' && '🌙'}
                                                            {meal.mealType === 'snack' && '🍿'}
                                                            {meal.mealType}
                                                        </span>
                                                        <span className="hero__meal-time">{meal.time}</span>
                                                    </div>
                                                    <div className="hero__meal-name">{meal.name}</div>
                                                    <div className="hero__meal-calories">{meal.calories} cal</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="hero__no-meals">
                                            <p>No meals tracked today yet</p>
                                            <button
                                                className="hero__add-meal-btn"
                                                onClick={() => onPrimaryCtaClick?.()}
                                            >
                                                Add Your First Meal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;