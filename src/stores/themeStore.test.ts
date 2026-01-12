import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore, Theme } from './themeStore';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia for system theme detection
const matchMediaMock = vi.fn((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });

describe('themeStore', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
        useThemeStore.setState({ theme: 'system' });
        document.documentElement.classList.remove('dark');
    });

    describe('initial state', () => {
        it('has system as default theme', () => {
            const state = useThemeStore.getState();
            expect(state.theme).toBe('system');
        });
    });

    describe('setTheme', () => {
        it('sets theme to light', () => {
            useThemeStore.getState().setTheme('light');
            expect(useThemeStore.getState().theme).toBe('light');
        });

        it('sets theme to dark', () => {
            useThemeStore.getState().setTheme('dark');
            expect(useThemeStore.getState().theme).toBe('dark');
        });

        it('sets theme to system', () => {
            useThemeStore.getState().setTheme('light');
            useThemeStore.getState().setTheme('system');
            expect(useThemeStore.getState().theme).toBe('system');
        });

        it('theme state updates correctly', () => {
            useThemeStore.getState().setTheme('dark');
            expect(useThemeStore.getState().theme).toBe('dark');

            useThemeStore.getState().setTheme('light');
            expect(useThemeStore.getState().theme).toBe('light');

            useThemeStore.getState().setTheme('system');
            expect(useThemeStore.getState().theme).toBe('system');
        });
    });

    describe('applyTheme', () => {
        it('adds dark class when theme is dark', () => {
            useThemeStore.getState().setTheme('dark');
            useThemeStore.getState().applyTheme();
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('removes dark class when theme is light', () => {
            document.documentElement.classList.add('dark');
            useThemeStore.getState().setTheme('light');
            useThemeStore.getState().applyTheme();
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });

        it('applies system preference when theme is system (dark)', () => {
            matchMediaMock.mockReturnValue({
                matches: true,
                media: '(prefers-color-scheme: dark)',
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            });

            useThemeStore.getState().setTheme('system');
            useThemeStore.getState().applyTheme();
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('applies system preference when theme is system (light)', () => {
            matchMediaMock.mockReturnValue({
                matches: false,
                media: '(prefers-color-scheme: dark)',
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            });

            document.documentElement.classList.add('dark');
            useThemeStore.getState().setTheme('system');
            useThemeStore.getState().applyTheme();
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });
    });
});
