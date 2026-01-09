import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './authService';

describe('authService', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        vi.restoreAllMocks();
    });

    describe('development environment bypass', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'development';
        });

        it('returns mock user data in development environment', async () => {
            const result = await authService.login('any@email.com', 'anypassword');

            expect(result.user).toEqual({
                id: 'dev-user',
                email: 'dev@local',
                name: 'Developer',
            });
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });

        it('accepts any credentials in development', async () => {
            const result1 = await authService.login('test@test.com', '123');
            const result2 = await authService.login('', '');

            expect(result1.user.id).toBe('dev-user');
            expect(result2.user.id).toBe('dev-user');
        });
    });

    describe('production environment', () => {
        beforeEach(() => {
            process.env.NODE_ENV = 'production';
        });

        it('calls real API in production environment', async () => {
            const mockFetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    accessToken: 'real-token',
                    refreshToken: 'real-refresh',
                    user: { id: '1', email: 'real@user.com', name: 'Real User' },
                }),
            });
            global.fetch = mockFetch;

            const result = await authService.login('real@user.com', 'password');

            expect(mockFetch).toHaveBeenCalled();
            expect(result.user.email).toBe('real@user.com');
        });
    });
});
