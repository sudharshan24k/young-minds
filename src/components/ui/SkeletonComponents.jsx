import React from 'react';
import Skeleton, { SkeletonImage, SkeletonText, SkeletonAvatar } from './Skeleton';

/**
 * Skeleton for event/content cards
 */
export const SkeletonCard = ({ showImage = true, showAvatar = false }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {showImage && (
                <SkeletonImage aspectRatio="16/9" />
            )}
            <div className="p-6">
                {showAvatar && (
                    <div className="flex items-center gap-3 mb-4">
                        <SkeletonAvatar size={40} />
                        <Skeleton width="120px" height="16px" variant="text" />
                    </div>
                )}
                <Skeleton width="70%" height="24px" className="mb-3" />
                <SkeletonText lines={3} />
                <div className="flex gap-2 mt-4">
                    <Skeleton width="80px" height="32px" variant="rounded" />
                    <Skeleton width="100px" height="32px" variant="rounded" />
                </div>
            </div>
        </div>
    );
};

/**
 * Skeleton for event list items
 */
export const SkeletonEventCard = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
                <Skeleton circle width={64} height={64} />
                <div className="flex-1">
                    <Skeleton width="60%" height="20px" className="mb-2" />
                    <Skeleton width="40%" height="16px" />
                </div>
                <Skeleton width="100px" height="36px" variant="rounded" />
            </div>
        </div>
    );
};

/**
 * Skeleton for gallery grid items
 */
export const SkeletonGalleryItem = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <SkeletonImage aspectRatio="1" />
            <div className="p-4">
                <Skeleton width="80%" height="18px" className="mb-2" />
                <Skeleton width="60%" height="14px" />
            </div>
        </div>
    );
};

/**
 * Skeleton for profile section
 */
export const SkeletonProfile = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-6 mb-6">
                <SkeletonAvatar size={96} />
                <div className="flex-1">
                    <Skeleton width="200px" height="32px" className="mb-2" />
                    <Skeleton width="150px" height="20px" />
                </div>
            </div>
            <SkeletonText lines={4} />
        </div>
    );
};

/**
 * Skeleton for submission list
 */
export const SkeletonSubmission = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex gap-4">
                <SkeletonImage aspectRatio="16/9" className="w-32" />
                <div className="flex-1">
                    <Skeleton width="70%" height="20px" className="mb-2" />
                    <Skeleton width="40%" height="16px" className="mb-3" />
                    <div className="flex gap-2">
                        <Skeleton width="60px" height="24px" variant="rounded" />
                        <Skeleton width="80px" height="24px" variant="rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Grid of skeleton cards
 */
export const SkeletonCardGrid = ({ count = 6, showImage = true }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} showImage={showImage} />
            ))}
        </div>
    );
};

/**
 * List of skeleton event cards
 */
export const SkeletonEventList = ({ count = 4 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonEventCard key={index} />
            ))}
        </div>
    );
};
