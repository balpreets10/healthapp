import React from 'react';
import './CircularProgress.css';

interface CircularProgressProps {
    value: number;
    max: number;
    size?: 'small' | 'medium' | 'large';
    color: string;
    label?: string;
    className?: string;
    children?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    max,
    size = 'small',
    color,
    label,
    className = '',
    children
}) => {
    const percentage = Math.min((value / max) * 100, 100);
    const radius = size === 'large' ? 90 : size === 'medium' ? 60 : 45;
    const strokeWidth = size === 'large' ? 12 : size === 'medium' ? 10 : 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`circular-progress circular-progress--${size} ${className}`}>
            <svg
                height={radius * 2}
                width={radius * 2}
                className="circular-progress__svg"
            >
                {/* Background circle */}
                <circle
                    stroke="#2a2a2a"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="circular-progress__background"
                />
                {/* Progress circle */}
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="circular-progress__progress"
                    style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                    }}
                />
            </svg>
            <div className="circular-progress__content">
                {children || (
                    <>
                        <div className="circular-progress__value">{Math.round(value)}</div>
                        {label && (
                            <div className="circular-progress__label">{label}</div>
                        )}
                        <div className="circular-progress__max">{Math.round(max)}</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CircularProgress;