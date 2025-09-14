import React from 'react';

interface SkeletonLoaderProps {
    className?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    className = '',
    width = '100%',
    height = '20px',
    borderRadius = '4px'
}) => {
    return (
        <div
            className={`skeleton-loader ${className}`}
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-loading 1.5s infinite',
            }}
        />
    );
};

interface JournalSkeletonProps {
    showMeals?: boolean;
}

const JournalSkeleton: React.FC<JournalSkeletonProps> = ({ showMeals = true }) => {
    return (
        <div className="journal-skeleton">
            {/* Header Skeleton */}
            <div className="journal-skeleton__header">
                <SkeletonLoader height="32px" width="300px" className="journal-skeleton__title" />
                <SkeletonLoader height="20px" width="200px" className="journal-skeleton__date" />
            </div>

            {/* Nutrition Overview Skeleton */}
            <div className="journal-skeleton__nutrition">
                <SkeletonLoader height="24px" width="250px" className="journal-skeleton__section-title" />
                <div className="journal-skeleton__nutrition-grid">
                    {[1, 2, 3, 4].map(index => (
                        <div key={index} className="journal-skeleton__nutrition-card">
                            <div className="journal-skeleton__nutrition-icon">
                                <SkeletonLoader height="24px" width="24px" borderRadius="50%" />
                            </div>
                            <div className="journal-skeleton__nutrition-content">
                                <SkeletonLoader height="20px" width="80px" />
                                <SkeletonLoader height="16px" width="60px" />
                                <SkeletonLoader height="8px" width="100%" borderRadius="4px" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meals Timeline Skeleton */}
            {showMeals && (
                <div className="journal-skeleton__meals">
                    <SkeletonLoader height="24px" width="280px" className="journal-skeleton__section-title" />
                    {[1, 2, 3].map(mealIndex => (
                        <div key={mealIndex} className="journal-skeleton__meal-section">
                            <div className="journal-skeleton__meal-header">
                                <div className="journal-skeleton__meal-type">
                                    <SkeletonLoader height="20px" width="20px" borderRadius="50%" />
                                    <SkeletonLoader height="24px" width="100px" />
                                </div>
                                <div className="journal-skeleton__meal-summary">
                                    <SkeletonLoader height="16px" width="60px" />
                                    <SkeletonLoader height="16px" width="80px" />
                                </div>
                            </div>
                            <div className="journal-skeleton__meal-items">
                                {[1, 2].map(itemIndex => (
                                    <div key={itemIndex} className="journal-skeleton__meal-item">
                                        <SkeletonLoader height="16px" width="60px" />
                                        <div className="journal-skeleton__meal-details">
                                            <SkeletonLoader height="18px" width="180px" />
                                            <div className="journal-skeleton__meal-nutrition">
                                                {[1, 2, 3, 4].map(nutrientIndex => (
                                                    <SkeletonLoader key={nutrientIndex} height="14px" width="70px" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Stats Skeleton */}
            <div className="journal-skeleton__stats">
                <SkeletonLoader height="24px" width="200px" className="journal-skeleton__section-title" />
                <div className="journal-skeleton__stats-grid">
                    {[1, 2, 3, 4].map(index => (
                        <div key={index} className="journal-skeleton__stat-card">
                            <SkeletonLoader height="28px" width="60px" />
                            <SkeletonLoader height="16px" width="120px" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { SkeletonLoader, JournalSkeleton };