import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({
    redirect: mockRedirect,
}));

describe('Home Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should redirect to /login when accessing root path', async () => {
        // Import dynamically to ensure mocks are in place
        const { default: Home } = await import('./page');

        // Call the component
        Home();

        // Verify redirect to /login is called
        expect(mockRedirect).toHaveBeenCalledWith('/login');
    });
});
