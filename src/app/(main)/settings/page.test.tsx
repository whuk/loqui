import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPage from './page';
import { useThemeStore } from '@/stores/themeStore';
import { useCustomInstructionsStore } from '@/stores/customInstructionsStore';

// Mock next/navigation
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        back: mockBack,
    }),
}));

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

describe('SettingsPage - Layout', () => {
    it('does not render password change section', () => {
        render(<SettingsPage />);

        expect(screen.queryByText('비밀번호 변경')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('현재 비밀번호')).not.toBeInTheDocument();
    });
});

describe('SettingsPage - Navigation', () => {
    beforeEach(() => {
        mockBack.mockClear();
    });

    it('renders back button', () => {
        render(<SettingsPage />);

        const backButton = screen.getByRole('button', { name: '뒤로 가기' });
        expect(backButton).toBeInTheDocument();
    });

    it('calls router.back when back button is clicked', () => {
        render(<SettingsPage />);

        const backButton = screen.getByRole('button', { name: '뒤로 가기' });
        fireEvent.click(backButton);

        expect(mockBack).toHaveBeenCalledTimes(1);
    });
});

describe('SettingsPage - Custom Instructions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useCustomInstructionsStore.setState({
            aboutMe: '',
            responseStyle: '',
        });
    });

    it('renders custom instructions section', () => {
        render(<SettingsPage />);

        expect(screen.getByText('맞춤형 지침')).toBeInTheDocument();
    });

    it('renders custom instructions section after theme and profile', () => {
        render(<SettingsPage />);

        const sections = screen.getAllByRole('heading', { level: 2 });
        const sectionTexts = sections.map((s) => s.textContent);

        expect(sectionTexts).toEqual(['테마', '프로필', '맞춤형 지침']);
    });

    it('renders save button in custom instructions section', () => {
        render(<SettingsPage />);

        expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    });

    it('saves custom instructions to store when save button is clicked', async () => {
        const user = userEvent.setup();
        render(<SettingsPage />);

        const aboutMeTextarea = screen.getByLabelText(/나에 대해/);
        const responseStyleTextarea = screen.getByLabelText(/응답 방식/);

        await user.type(aboutMeTextarea, 'I am a developer');
        await user.type(responseStyleTextarea, 'Be concise');
        await user.click(screen.getByRole('button', { name: '저장' }));

        const state = useCustomInstructionsStore.getState();
        expect(state.aboutMe).toBe('I am a developer');
        expect(state.responseStyle).toBe('Be concise');
    });
});
