import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from './page';
import { useThemeStore } from '@/stores/themeStore';

// Mock matchMedia for system theme detection
const matchMediaMock = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });

describe('SettingsPage - Theme Selection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useThemeStore.setState({ theme: 'system' });
        document.documentElement.classList.remove('dark');
    });

    it('applies light theme when light option is selected', () => {
        render(<SettingsPage />);

        const lightRadio = screen.getByLabelText('라이트');
        fireEvent.click(lightRadio);

        expect(useThemeStore.getState().theme).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('applies dark theme when dark option is selected', () => {
        render(<SettingsPage />);

        const darkRadio = screen.getByLabelText('다크');
        fireEvent.click(darkRadio);

        expect(useThemeStore.getState().theme).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('applies system theme when system option is selected', () => {
        // First set to dark, then switch to system
        useThemeStore.getState().setTheme('dark');
        useThemeStore.getState().applyTheme();

        render(<SettingsPage />);

        const systemRadio = screen.getByLabelText('시스템');
        fireEvent.click(systemRadio);

        expect(useThemeStore.getState().theme).toBe('system');
    });

    it('reflects current theme state in radio buttons', () => {
        useThemeStore.setState({ theme: 'dark' });

        render(<SettingsPage />);

        const darkRadio = screen.getByLabelText('다크') as HTMLInputElement;
        expect(darkRadio.checked).toBe(true);
    });
});
