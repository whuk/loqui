import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    width?: number;
    height?: number;
    variant?: 'default' | 'circle';
}

export function Skeleton({
    width,
    height,
    variant = 'default',
    className = '',
    style,
    ...props
}: SkeletonProps) {
    const baseClasses = 'animate-pulse bg-[var(--bg-tertiary)]';
    const variantClasses = variant === 'circle' ? 'rounded-full' : 'rounded';

    return (
        <div
            className={`${baseClasses} ${variantClasses} ${className}`}
            style={{
                width: width ? `${width}px` : undefined,
                height: height ? `${height}px` : undefined,
                ...style,
            }}
            {...props}
        />
    );
}

interface MessageSkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function MessageSkeleton({ ...props }: MessageSkeletonProps) {
    return (
        <div className="flex gap-3 p-4" {...props}>
            <Skeleton variant="circle" className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

interface SidebarSkeletonProps extends HTMLAttributes<HTMLDivElement> {
    count?: number;
}

export function SidebarSkeleton({ count = 5, ...props }: SidebarSkeletonProps) {
    return (
        <div className="space-y-2 p-2" {...props}>
            {Array.from({ length: count }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
            ))}
        </div>
    );
}
