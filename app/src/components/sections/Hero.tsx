import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useContentManager } from '../../hooks/useContentManager';
import { useAuth } from '../../hooks/useAuth';
import { useCalorieTracker } from '../../hooks/useCalorieTracker';
import CalorieCalculatorService from '../../services/CalorieCalculatorService';
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
    const { calorieData, todaysMeals, profile } = useCalorieTracker();

    // Calculate nutrition summary from real data
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
        
        // Get macro ratios based on user's orientation
        const macroRatios = CalorieCalculatorService.getMacroRatios(profile?.orientation);
        
        return {
            ...totals,
            goalCalories: calorieData.targetCalories,
            goalProtein: Math.round(calorieData.targetCalories * macroRatios.protein / 4), // protein has 4 calories per gram
            goalCarbs: Math.round(calorieData.targetCalories * macroRatios.carbs / 4), // carbs has 4 calories per gram
            goalFat: Math.round(calorieData.targetCalories * macroRatios.fat / 9) // fat has 9 calories per gram
        };
    }, [todaysMeals, calorieData.targetCalories, profile?.orientation]);

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

                            <div className="hero__nutrition-dashboard">
                                {/* Main Calorie Progress Section */}
                                <div className="hero__calorie-progress-section">
                                    <div className="hero__calorie-status">
                                        <div className="hero__calorie-current">
                                            <span className="hero__calorie-number">{nutritionSummary.calories}</span>
                                            <span className="hero__calorie-unit">cal</span>
                                        </div>
                                        <div className="hero__calorie-divider">of</div>
                                        <div className="hero__calorie-target">
                                            <span className="hero__calorie-number">{nutritionSummary.goalCalories}</span>
                                            <span className="hero__calorie-unit">cal</span>
                                        </div>
                                    </div>
                                    
                                    {/* Enhanced Progress Bar */}
                                    <div className="hero__progress-container">
                                        <div className="hero__progress-bar">
                                            <div 
                                                className={`hero__progress-fill ${
                                                    nutritionSummary.calories > nutritionSummary.goalCalories ? 'hero__progress-fill--over' : ''
                                                }`}
                                                style={{ 
                                                    width: `${Math.min((nutritionSummary.calories / nutritionSummary.goalCalories) * 100, 100)}%` 
                                                }}
                                            ></div>
                                            {nutritionSummary.calories > nutritionSummary.goalCalories && (
                                                <div 
                                                    className="hero__progress-overflow"
                                                    style={{ 
                                                        width: `${Math.min(((nutritionSummary.calories - nutritionSummary.goalCalories) / nutritionSummary.goalCalories) * 100, 50)}%` 
                                                    }}
                                                ></div>
                                            )}
                                        </div>
                                        <div className="hero__progress-labels">
                                            <span className="hero__progress-label hero__progress-label--start">0</span>
                                            <span className="hero__progress-label hero__progress-label--target">Target</span>
                                            {nutritionSummary.calories > nutritionSummary.goalCalories && (
                                                <span className="hero__progress-label hero__progress-label--over">+{nutritionSummary.calories - nutritionSummary.goalCalories}</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Calorie Status Message */}
                                    <div className={`hero__calorie-status-message ${
                                        nutritionSummary.calories < nutritionSummary.goalCalories * 0.8 ? 'hero__calorie-status--low' :
                                        nutritionSummary.calories > nutritionSummary.goalCalories * 1.1 ? 'hero__calorie-status--high' :
                                        'hero__calorie-status--good'
                                    }`}>
                                        {nutritionSummary.calories < nutritionSummary.goalCalories * 0.8 && (
                                            <>
                                                <span className="hero__status-icon">🟡</span>
                                                <span>Need {nutritionSummary.goalCalories - nutritionSummary.calories} more calories</span>
                                            </>
                                        )}
                                        {nutritionSummary.calories > nutritionSummary.goalCalories * 1.1 && (
                                            <>
                                                <span className="hero__status-icon">🔴</span>
                                                <span>{nutritionSummary.calories - nutritionSummary.goalCalories} calories over target</span>
                                            </>
                                        )}
                                        {nutritionSummary.calories >= nutritionSummary.goalCalories * 0.8 && 
                                         nutritionSummary.calories <= nutritionSummary.goalCalories * 1.1 && (
                                            <>
                                                <span className="hero__status-icon">🟢</span>
                                                <span>On track with your calorie goals!</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Smart Macro Cards */}
                                <div className="hero__macro-cards">
                                    <div className="hero__macro-card hero__macro-card--protein">
                                        <div className="hero__macro-header">
                                            <span className="hero__macro-icon">💪</span>
                                            <span className="hero__macro-name">Protein</span>
                                        </div>
                                        <div className="hero__macro-values">
                                            <span className="hero__macro-current">{nutritionSummary.protein}g</span>
                                            <span className="hero__macro-target">/ {nutritionSummary.goalProtein}g</span>
                                        </div>
                                        <div className="hero__macro-progress">
                                            <div 
                                                className="hero__macro-progress-bar hero__macro-progress-bar--protein"
                                                style={{ width: `${Math.min((nutritionSummary.protein / nutritionSummary.goalProtein) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="hero__macro-percentage">
                                            {Math.round((nutritionSummary.protein / nutritionSummary.goalProtein) * 100)}%
                                        </div>
                                    </div>
                                    
                                    <div className="hero__macro-card hero__macro-card--carbs">
                                        <div className="hero__macro-header">
                                            <span className="hero__macro-icon">🍞</span>
                                            <span className="hero__macro-name">Carbs</span>
                                        </div>
                                        <div className="hero__macro-values">
                                            <span className="hero__macro-current">{nutritionSummary.carbs}g</span>
                                            <span className="hero__macro-target">/ {nutritionSummary.goalCarbs}g</span>
                                        </div>
                                        <div className="hero__macro-progress">
                                            <div 
                                                className="hero__macro-progress-bar hero__macro-progress-bar--carbs"
                                                style={{ width: `${Math.min((nutritionSummary.carbs / nutritionSummary.goalCarbs) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="hero__macro-percentage">
                                            {Math.round((nutritionSummary.carbs / nutritionSummary.goalCarbs) * 100)}%
                                        </div>
                                    </div>
                                    
                                    <div className="hero__macro-card hero__macro-card--fat">
                                        <div className="hero__macro-header">
                                            <span className="hero__macro-icon">🥑</span>
                                            <span className="hero__macro-name">Fat</span>
                                        </div>
                                        <div className="hero__macro-values">
                                            <span className="hero__macro-current">{nutritionSummary.fat}g</span>
                                            <span className="hero__macro-target">/ {nutritionSummary.goalFat}g</span>
                                        </div>
                                        <div className="hero__macro-progress">
                                            <div 
                                                className="hero__macro-progress-bar hero__macro-progress-bar--fat"
                                                style={{ width: `${Math.min((nutritionSummary.fat / nutritionSummary.goalFat) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="hero__macro-percentage">
                                            {Math.round((nutritionSummary.fat / nutritionSummary.goalFat) * 100)}%
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Goal Recommendation */}
                                {calorieData.recommendation && (
                                    <div className={`hero__goal-recommendation hero__goal-recommendation--${calorieData.recommendation.type}`}>
                                        <span className="hero__recommendation-icon">
                                            {calorieData.recommendation.type === 'loss' && '📉'}
                                            {calorieData.recommendation.type === 'gain' && '📈'}
                                            {calorieData.recommendation.type === 'maintain' && '⚖️'}
                                        </span>
                                        <span className="hero__recommendation-text">
                                            {calorieData.recommendation.message}
                                        </span>
                                    </div>
                                )}

                                {/* Today's Meals List */}
                                <div className="hero__meals-list">
                                    <h3 className="hero__meals-title">Today's Meals</h3>
                                    {todaysMeals.length > 0 ? (
                                        <div className="hero__meals-grid">
                                            {todaysMeals.map((meal, index) => (
                                                <div key={meal.id} className="hero__meal-card hero__meal-card--compact">
                                                    <div className="hero__meal-header">
                                                        <span className="hero__meal-type">
                                                            {meal.mealType === 'breakfast' && '🌅'}
                                                            {meal.mealType === 'lunch' && '☀️'}
                                                            {meal.mealType === 'dinner' && '🌙'}
                                                            {meal.mealType === 'snack' && '🍿'}
                                                            {meal.mealType}
                                                        </span>
                                                        <span className="hero__meal-calories">{meal.calories} cal</span>
                                                    </div>
                                                    <div className="hero__meal-name">{meal.name}</div>
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

                            {calorieData.hasProfile ? (
                                <div className="hero__calorie-tracking">
                                    {/* Innovative Metabolic Dashboard */}
                                    <div className="hero__metabolic-dashboard">
                                        <div className="hero__metabolic-header">
                                            <h4 className="hero__metabolic-title">📊 Your Metabolic Profile</h4>
                                            <p className="hero__metabolic-subtitle">Understanding your body's energy needs</p>
                                        </div>
                                        
                                        <div className="hero__metabolic-visual">
                                            {/* Interactive Energy Flow */}
                                            <div className="hero__energy-flow">
                                                <div className="hero__energy-node hero__energy-node--bmr">
                                                    <div className="hero__energy-pulse"></div>
                                                    <div className="hero__energy-icon">🔥</div>
                                                    <div className="hero__energy-label">BMR</div>
                                                    <div className="hero__energy-value">{Math.round(calorieData.calculation?.bmr || 0)}</div>
                                                </div>
                                                
                                                <div className="hero__energy-arrow">
                                                    <div className="hero__energy-line"></div>
                                                    <div className="hero__energy-tip"></div>
                                                    <span className="hero__energy-multiplier">x {(calorieData.calculation?.tdee && calorieData.calculation?.bmr ? (calorieData.calculation.tdee / calorieData.calculation.bmr).toFixed(2) : '1.0')}</span>
                                                </div>
                                                
                                                <div className="hero__energy-node hero__energy-node--tdee">
                                                    <div className="hero__energy-pulse hero__energy-pulse--delayed"></div>
                                                    <div className="hero__energy-icon">⚡</div>
                                                    <div className="hero__energy-label">TDEE</div>
                                                    <div className="hero__energy-value">{Math.round(calorieData.calculation?.tdee || 0)}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Metabolic Insights */}
                                            <div className="hero__metabolic-insights">
                                                <div className="hero__insight-item">
                                                    <span className="hero__insight-icon">🛌</span>
                                                    <span className="hero__insight-text">At rest: {Math.round(calorieData.calculation?.bmr || 0)} cal/day</span>
                                                </div>
                                                <div className="hero__insight-item">
                                                    <span className="hero__insight-icon">🏃‍♂️</span>
                                                    <span className="hero__insight-text">Active: +{Math.round((calorieData.calculation?.tdee || 0) - (calorieData.calculation?.bmr || 0))} cal/day</span>
                                                </div>
                                                <div className="hero__insight-item">
                                                    <span className="hero__insight-icon">🎯</span>
                                                    <span className="hero__insight-text">Target: {calorieData.targetCalories} cal/day</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hero__calorie-overview">
                                        <div className="hero__calorie-card hero__calorie-card--target">
                                            <div className="hero__calorie-label">Target Calories</div>
                                            <div className="hero__calorie-value">{calorieData.targetCalories.toLocaleString()}</div>
                                            <div className="hero__calorie-subtext">
                                                {calorieData.recommendation?.weeklyGoal}
                                            </div>
                                        </div>
                                        
                                        <div className="hero__calorie-card hero__calorie-card--current">
                                            <div className="hero__calorie-label">Current Intake</div>
                                            <div className="hero__calorie-value">{calorieData.currentCalories.toLocaleString()}</div>
                                            <div className="hero__calorie-subtext">
                                                {calorieData.remainingCalories > 0 
                                                    ? `${calorieData.remainingCalories} remaining`
                                                    : `${Math.abs(calorieData.remainingCalories)} over`
                                                }
                                            </div>
                                        </div>
                                        
                                        <div className="hero__calorie-card hero__calorie-card--progress">
                                            <div className="hero__calorie-label">Progress</div>
                                            <div className="hero__calorie-value">{calorieData.percentageConsumed}%</div>
                                            <div className="hero__calorie-progress-bar">
                                                <div 
                                                    className="hero__calorie-progress-fill"
                                                    style={{ width: `${Math.min(calorieData.percentageConsumed, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="hero__setup-profile">
                                    <div className="hero__setup-icon">⚙️</div>
                                    <p className="hero__setup-message">
                                        Complete your profile to see personalized calorie targets
                                    </p>
                                    <button
                                        className="hero__setup-btn"
                                        onClick={() => window.location.href = '/profile'}
                                    >
                                        Setup Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;