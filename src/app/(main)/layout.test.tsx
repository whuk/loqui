import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/navigation
const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({
    redirect: mockRedirect,
    usePathname: () => '/chat',
}));

// Mock authStore
const mockAuthStore = {
    isAuthenticated: false,
};

vi.mock('@/stores/authStore', () => ({
    useAuthStore: vi.fn((selector) => {
        if (typeof selector === 'function') {
            return selector(mockAuthStore);
        }
        return mockAuthStore;
    }),
}));

// Mock Sidebar to avoid complex rendering
vi.mock('@/components/chat/Sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe('MainLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAuthStore.isAuthenticated = false;
    });

    it('should redirect to /login when user is not authenticated', async () => {
        mockAuthStore.isAuthenticated = false;

        const { default: MainLayout } = await import('./layout');

        render(
            <MainLayout>
                <div>Test Content</div>
            </MainLayout>
        );

        expect(mockRedirect).toHaveBeenCalledWith('/login');
    });

    it('should render children when user is authenticated', async () => {
        mockAuthStore.isAuthenticated = true;

        // Reset module to pick up new mock state
        vi.resetModules();

        // Re-setup mocks after reset
        vi.doMock('next/navigation', () => ({
            redirect: mockRedirect,
            usePathname: () => '/chat',
        }));

        vi.doMock('@/stores/authStore', () => ({
            useAuthStore: vi.fn((selector) => {
                if (typeof selector === 'function') {
                    return selector({ isAuthenticated: true });
                }
                return { isAuthenticated: true };
            }),
        }));

        vi.doMock('@/components/chat/Sidebar', () => ({
            Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
        }));

        const { default: MainLayout } = await import('./layout');

        render(
            <MainLayout>
                <div data-testid="test-content">Test Content</div>
            </MainLayout>
        );

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
});
