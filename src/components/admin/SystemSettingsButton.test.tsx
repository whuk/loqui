import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SystemSettingsButton } from './SystemSettingsButton';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockWindowOpen, writable: true });

describe('SystemSettingsButton', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        mockWindowOpen.mockClear();
    });

    describe('visibility', () => {
        it('renders button in development environment', () => {
            vi.stubEnv('NODE_ENV', 'development');

            render(<SystemSettingsButton />);

            expect(screen.getByRole('button', { name: '시스템 설정' })).toBeInTheDocument();
        });

        it('renders button in test environment', () => {
            vi.stubEnv('NODE_ENV', 'test');

            render(<SystemSettingsButton />);

            expect(screen.getByRole('button', { name: '시스템 설정' })).toBeInTheDocument();
        });

        it('renders button in production when user is admin', () => {
            vi.stubEnv('NODE_ENV', 'production');

            render(<SystemSettingsButton isAdmin={true} />);

            expect(screen.getByRole('button', { name: '시스템 설정' })).toBeInTheDocument();
        });

        it('does not render button in production when user is not admin', () => {
            vi.stubEnv('NODE_ENV', 'production');

            render(<SystemSettingsButton isAdmin={false} />);

            expect(screen.queryByRole('button', { name: '시스템 설정' })).not.toBeInTheDocument();
        });

        it('does not render button in production when isAdmin is not provided', () => {
            vi.stubEnv('NODE_ENV', 'production');

            render(<SystemSettingsButton />);

            expect(screen.queryByRole('button', { name: '시스템 설정' })).not.toBeInTheDocument();
        });
    });

    describe('click behavior', () => {
        it('opens /admin/settings in a new window when clicked', () => {
            vi.stubEnv('NODE_ENV', 'development');

            render(<SystemSettingsButton />);

            const button = screen.getByRole('button', { name: '시스템 설정' });
            fireEvent.click(button);

            expect(mockWindowOpen).toHaveBeenCalledWith('/admin/settings', '_blank');
        });
    });
});
