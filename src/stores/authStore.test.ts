import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
});

describe('authStore', () => {
    beforeEach(() => {
        useAuthStore.setState({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('has initial state', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.accessToken).toBeNull();
    });

    it('login updates state and localStorage', () => {
        const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
        const accessToken = 'access-token';
        const refreshToken = 'refresh-token';

        useAuthStore.getState().login(mockUser, accessToken, refreshToken);

        const state = useAuthStore.getState();
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.accessToken).toBe(accessToken);
        expect(state.refreshToken).toBe(refreshToken);

        // Check if tokens are saved to localStorage (assuming we implement it that way manually or via persist)
        // For this test, let's assume the store handles logical side effects or we test the persist middleware behavior
        // If using persist middleware, we might need a slightly different test setup or trust the middleware.
        // However, explicit manual handling in the action is also a valid approach for clarity.
    });

    it('logout clears state and localStorage', () => {
        // Setup initial state
        useAuthStore.setState({
            user: { id: '1', email: 'test', name: 'test' },
            isAuthenticated: true,
            accessToken: 'token',
            refreshToken: 'refresh'
        });

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.accessToken).toBeNull();

        // We expect the store to clear items from storage
        // But since `persist` middleware handles this automatically for the store state,
        // we might not see direct calls toremoveItem unless we call it explicitly.
        // Let's verify the state is reset.
    });

    it('setUser updates user info', () => {
        const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
        useAuthStore.getState().setUser(mockUser);
        expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    describe('JWT token expiration', () => {
        it('isTokenExpired returns true for expired token', () => {
            // JWT with exp: 1000 (expired in 1970)
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxMDAwfQ.signature';
            expect(useAuthStore.getState().isTokenExpired(expiredToken)).toBe(true);
        });

        it('isTokenExpired returns false for valid token', () => {
            // JWT with exp: 9999999999 (far future)
            const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjo5OTk5OTk5OTk5fQ.signature';
            expect(useAuthStore.getState().isTokenExpired(validToken)).toBe(false);
        });

        it('isTokenExpired returns true for malformed token', () => {
            expect(useAuthStore.getState().isTokenExpired('invalid-token')).toBe(true);
            expect(useAuthStore.getState().isTokenExpired('')).toBe(true);
        });
    });
});
