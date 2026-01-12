import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isAdmin } from './adminService';

describe('adminService', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    describe('isAdmin', () => {
        it('returns true in development environment regardless of user role', () => {
            vi.stubEnv('NODE_ENV', 'development');

            expect(isAdmin()).toBe(true);
            expect(isAdmin({ isAdmin: false })).toBe(true);
            expect(isAdmin({ isAdmin: undefined })).toBe(true);
        });

        it('returns true in test environment regardless of user role', () => {
            vi.stubEnv('NODE_ENV', 'test');

            expect(isAdmin()).toBe(true);
            expect(isAdmin({ isAdmin: false })).toBe(true);
        });

        it('returns true in production when user has admin role', () => {
            vi.stubEnv('NODE_ENV', 'production');

            expect(isAdmin({ isAdmin: true })).toBe(true);
        });

        it('returns false in production when user does not have admin role', () => {
            vi.stubEnv('NODE_ENV', 'production');

            expect(isAdmin({ isAdmin: false })).toBe(false);
            expect(isAdmin({ isAdmin: undefined })).toBe(false);
            expect(isAdmin()).toBe(false);
        });
    });
});
