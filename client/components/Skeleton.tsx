import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={`animate-pulse bg-slate-800 rounded ${className}`}
        />
    );
};

export const ReviewSkeleton = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Skeleton className="h-10 w-3/4 mb-8" />
            <div className="flex gap-4 mb-8">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
};

export const TimelineSkeleton = () => {
    return (
        <div className="relative border-l-2 border-slate-800 ml-4 md:ml-8 space-y-8 py-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="relative pl-8 md:pl-12">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-dark-900 bg-slate-800"></div>
                    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton = () => {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </div>
    );
};
