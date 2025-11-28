import React from 'react';

/**
 * Base Skeleton component with shimmer animation
 */
const Skeleton = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    circle = false,
    animation = 'shimmer'
}) => {
    const baseClasses = 'bg-gray-200 relative overflow-hidden';

    const variantClasses = {
        text: 'h-4 rounded',
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
        rounded: 'rounded-xl'
    };

    const animationClass = animation === 'shimmer'
        ? 'after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent'
        : animation === 'pulse'
            ? 'animate-pulse'
            : '';

    const style = {
        width: width || '100%',
        height: height || undefined
    };

    return (
        <div
            className={`
                ${baseClasses}
                ${circle ? variantClasses.circular : variantClasses[variant]}
                ${animationClass}
                ${className}
            `}
            style={style}
        />
    );
};

/**
 * Skeleton for text lines
 */
export const SkeletonText = ({ lines = 3, className = '' }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    variant="text"
                    width={index === lines - 1 ? '80%' : '100%'}
                />
            ))}
        </div>
    );
};

/**
 * Skeleton for images
 */
export const SkeletonImage = ({ aspectRatio = '16/9', className = '' }) => {
    return (
        <Skeleton
            className={`w-full ${className}`}
            style={{ aspectRatio }}
            variant="rectangular"
        />
    );
};

/**
 * Skeleton for circle avatars
 */
export const SkeletonAvatar = ({ size = 48, className = '' }) => {
    return (
        <Skeleton
            circle
            width={size}
            height={size}
            className={className}
        />
    );
};

export default Skeleton;
