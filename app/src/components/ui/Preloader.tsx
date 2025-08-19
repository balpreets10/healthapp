import { useEffect, useState, useMemo } from 'react';
import './Preloader.css';

interface PreloaderProps {
    onComplete?: () => void;
    duration?: number;
    minDisplayTime?: number;
    className?: string;
}

const Preloader: React.FC<PreloaderProps> = ({
    onComplete,
    duration = 800,
    minDisplayTime = 600,
    className = ''
}) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<'loading' | 'complete' | 'exiting'>('loading');

    // Health tracker themed loading messages
    const loadingMessages = useMemo(() => [
        'Initializing Health Hub...',
        'Loading Wellness Modules...',
        'Syncing Health Data...',
        'Preparing Your Dashboard...',
        'Ready to Track Your Journey!'
    ], []);

    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const startTime = Date.now();
        let animationFrame: number;
        let messageIndex = 0;

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(newProgress);

            // Update loading message based on progress
            const expectedMessageIndex = Math.floor((newProgress / 100) * (loadingMessages.length - 1));
            if (expectedMessageIndex !== messageIndex && expectedMessageIndex < loadingMessages.length) {
                messageIndex = expectedMessageIndex;
                setCurrentMessage(loadingMessages[messageIndex]);
            }

            if (newProgress < 100) {
                animationFrame = requestAnimationFrame(updateProgress);
            } else {
                setCurrentPhase('complete');
                setCurrentMessage('Welcome to Your Health Journey!');

                // Ensure minimum display time without hardcoded delays
                const totalElapsed = Date.now() - startTime;
                const remainingTime = Math.max(0, minDisplayTime - totalElapsed);

                setTimeout(() => {
                    setCurrentPhase('exiting');
                    setIsExiting(true);
                    setTimeout(() => {
                        setIsVisible(false);
                        onComplete?.();
                    }, 300);
                }, remainingTime);
            }
        };

        animationFrame = requestAnimationFrame(updateProgress);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [duration, minDisplayTime, onComplete, loadingMessages]);

    const progressClasses = useMemo(() => [
        'preloader',
        `preloader--${currentPhase}`,
        isExiting && 'preloader--exiting',
        className
    ].filter(Boolean).join(' '), [currentPhase, isExiting, className]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={progressClasses}>
            {/* Modern Geometric Background */}
            <div className="preloader__bg">
                <div className="preloader__grid"></div>
                <div className="preloader__orbs">
                    <div className="preloader__orb preloader__orb--1"></div>
                    <div className="preloader__orb preloader__orb--2"></div>
                    <div className="preloader__orb preloader__orb--3"></div>
                </div>
            </div>

            <div className="preloader__content">
                {/* Health Tracker Brand Logo */}
                <div className="preloader__brand">
                    <div className="preloader__logo">
                        <div className="preloader__logo-icon">
                            <div className="preloader__health-icon">
                                <div className="preloader__heart">
                                    <div className="preloader__heart-beat"></div>
                                </div>
                                <div className="preloader__pulse-rings">
                                    <div className="preloader__pulse-ring preloader__pulse-ring--1"></div>
                                    <div className="preloader__pulse-ring preloader__pulse-ring--2"></div>
                                    <div className="preloader__pulse-ring preloader__pulse-ring--3"></div>
                                </div>
                            </div>
                        </div>
                        <div className="preloader__brand-text">
                            Health<span className="preloader__brand-accent">Tracker</span>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="preloader__status">
                    <div className="preloader__message">{currentMessage}</div>
                </div>

                {/* Modern Progress Indicator */}
                <div className="preloader__progress-section">
                    <div className="preloader__progress-ring">
                        <svg className="preloader__ring-svg" viewBox="0 0 120 120">
                            <circle
                                className="preloader__ring-bg"
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                strokeWidth="4"
                            />
                            <circle
                                className="preloader__ring-progress"
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                strokeWidth="4"
                                style={{
                                    strokeDasharray: 314,
                                    strokeDashoffset: 314 - (progress * 314) / 100
                                }}
                            />
                        </svg>
                        <div className="preloader__percentage">
                            {Math.round(progress)}%
                        </div>
                    </div>

                    {/* Pulse Bars */}
                    <div className="preloader__pulse-bars">
                        <div className="preloader__bar"></div>
                        <div className="preloader__bar"></div>
                        <div className="preloader__bar"></div>
                        <div className="preloader__bar"></div>
                        <div className="preloader__bar"></div>
                    </div>
                </div>
            </div>

            {/* Success Animation */}
            {currentPhase === 'complete' && (
                <div className="preloader__success">
                    <div className="preloader__success-ring">
                        <svg viewBox="0 0 52 52" className="preloader__success-svg">
                            <circle
                                className="preloader__success-circle"
                                cx="26"
                                cy="26"
                                r="20"
                                fill="none"
                            />
                            <path
                                className="preloader__success-check"
                                fill="none"
                                d="M14,27 L22,35 L38,19"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Preloader;