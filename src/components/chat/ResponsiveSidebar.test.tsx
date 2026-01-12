import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveSidebar } from './ResponsiveSidebar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/chat'),
}));

describe('ResponsiveSidebar', () => {
    it('renders sidebar content', () => {
        render(<ResponsiveSidebar />);

        expect(screen.getByRole('link', { name: /새 대화/i })).toBeInTheDocument();
    });

    it('sidebar is hidden on mobile by default', () => {
        render(<ResponsiveSidebar />);

        const sidebar = screen.getByTestId('sidebar-container');
        expect(sidebar).toHaveClass('hidden');
        expect(sidebar).toHaveClass('md:flex');
    });

    it('renders mobile menu button', () => {
        render(<ResponsiveSidebar />);

        const menuButton = screen.getByRole('button', { name: /메뉴/i });
        expect(menuButton).toBeInTheDocument();
    });

    it('mobile menu button is visible only on mobile', () => {
        render(<ResponsiveSidebar />);

        const menuButton = screen.getByRole('button', { name: /메뉴/i });
        expect(menuButton).toHaveClass('md:hidden');
    });

    it('opens sidebar overlay when menu button is clicked', () => {
        render(<ResponsiveSidebar />);

        const menuButton = screen.getByRole('button', { name: /메뉴/i });
        fireEvent.click(menuButton);

        const overlay = screen.getByTestId('sidebar-overlay');
        expect(overlay).toBeInTheDocument();
    });

    it('closes sidebar overlay when close button is clicked', () => {
        render(<ResponsiveSidebar />);

        const menuButton = screen.getByRole('button', { name: /메뉴/i });
        fireEvent.click(menuButton);

        const closeButton = screen.getByRole('button', { name: /닫기/i });
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();
    });

    it('closes sidebar overlay when backdrop is clicked', () => {
        render(<ResponsiveSidebar />);

        const menuButton = screen.getByRole('button', { name: /메뉴/i });
        fireEvent.click(menuButton);

        const backdrop = screen.getByTestId('sidebar-backdrop');
        fireEvent.click(backdrop);

        expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();
    });
});
