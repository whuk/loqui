import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, MessageSkeleton, SidebarSkeleton } from './Skeleton';

describe('Skeleton', () => {
    describe('base Skeleton', () => {
        it('renders with default styles', () => {
            render(<Skeleton data-testid="skeleton" />);

            const skeleton = screen.getByTestId('skeleton');
            expect(skeleton).toBeInTheDocument();
            expect(skeleton).toHaveClass('animate-pulse');
            expect(skeleton).toHaveClass('bg-[var(--bg-tertiary)]');
        });

        it('applies custom className', () => {
            render(<Skeleton className="w-full h-4" data-testid="skeleton" />);

            const skeleton = screen.getByTestId('skeleton');
            expect(skeleton).toHaveClass('w-full');
            expect(skeleton).toHaveClass('h-4');
        });

        it('renders with custom width and height', () => {
            render(<Skeleton width={100} height={20} data-testid="skeleton" />);

            const skeleton = screen.getByTestId('skeleton');
            expect(skeleton).toHaveStyle({ width: '100px', height: '20px' });
        });

        it('renders as rounded by default', () => {
            render(<Skeleton data-testid="skeleton" />);

            const skeleton = screen.getByTestId('skeleton');
            expect(skeleton).toHaveClass('rounded');
        });

        it('renders as circle when variant is circle', () => {
            render(<Skeleton variant="circle" data-testid="skeleton" />);

            const skeleton = screen.getByTestId('skeleton');
            expect(skeleton).toHaveClass('rounded-full');
        });
    });

    describe('MessageSkeleton', () => {
        it('renders a skeleton for a chat message', () => {
            render(<MessageSkeleton data-testid="message-skeleton" />);

            const skeleton = screen.getByTestId('message-skeleton');
            expect(skeleton).toBeInTheDocument();
        });

        it('renders avatar and text lines', () => {
            render(<MessageSkeleton />);

            // Should have multiple skeleton elements for avatar and text
            const skeletons = document.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThan(1);
        });
    });

    describe('SidebarSkeleton', () => {
        it('renders skeleton items for sidebar', () => {
            render(<SidebarSkeleton data-testid="sidebar-skeleton" />);

            const skeleton = screen.getByTestId('sidebar-skeleton');
            expect(skeleton).toBeInTheDocument();
        });

        it('renders multiple skeleton items by default', () => {
            render(<SidebarSkeleton count={5} />);

            // Should have 5 skeleton items
            const skeletons = document.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThanOrEqual(5);
        });
    });
});
