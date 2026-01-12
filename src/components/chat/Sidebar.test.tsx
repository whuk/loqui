import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/chat'),
    useRouter: vi.fn(() => ({
        push: mockPush,
    })),
}));

// Mock authStore
const mockLogout = vi.fn();
vi.mock('@/stores/authStore', () => ({
    useAuthStore: vi.fn((selector) => {
        const state = { logout: mockLogout };
        if (typeof selector === 'function') {
            return selector(state);
        }
        return state;
    }),
}));

describe('Sidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders new chat button', () => {
        render(<Sidebar />);

        expect(screen.getByRole('link', { name: /새 대화/i })).toBeInTheDocument();
    });

    it('renders conversation list', () => {
        render(<Sidebar />);

        // Check for dummy conversation items
        expect(screen.getByText('React 컴포넌트 설계')).toBeInTheDocument();
        expect(screen.getByText('TypeScript 타입 질문')).toBeInTheDocument();
        expect(screen.getByText('Next.js 라우팅')).toBeInTheDocument();
    });

    it('renders settings link', () => {
        render(<Sidebar />);

        expect(screen.getByRole('link', { name: /설정/i })).toBeInTheDocument();
    });

    it('renders logout button', () => {
        render(<Sidebar />);

        expect(screen.getByRole('button', { name: /로그아웃/i })).toBeInTheDocument();
    });

    it('new chat link points to /chat', () => {
        render(<Sidebar />);

        const newChatLink = screen.getByRole('link', { name: /새 대화/i });
        expect(newChatLink).toHaveAttribute('href', '/chat');
    });

    it('settings link points to /settings', () => {
        render(<Sidebar />);

        const settingsLink = screen.getByRole('link', { name: /설정/i });
        expect(settingsLink).toHaveAttribute('href', '/settings');
    });

    it('conversation links point to correct chat routes', () => {
        render(<Sidebar />);

        const conv1Link = screen.getByRole('link', { name: /React 컴포넌트 설계/i });
        expect(conv1Link).toHaveAttribute('href', '/chat/1');

        const conv2Link = screen.getByRole('link', { name: /TypeScript 타입 질문/i });
        expect(conv2Link).toHaveAttribute('href', '/chat/2');
    });

    it('shows confirmation popup when logout button is clicked', () => {
        render(<Sidebar />);

        const logoutButton = screen.getByRole('button', { name: /로그아웃/i });
        fireEvent.click(logoutButton);

        // Confirmation popup should appear
        expect(screen.getByText('로그아웃 하시겠습니까?')).toBeInTheDocument();
    });

    it('logs out and redirects to /login when confirm button is clicked', () => {
        render(<Sidebar />);

        // Click logout button to show popup
        const logoutButton = screen.getByRole('button', { name: /로그아웃/i });
        fireEvent.click(logoutButton);

        // Click confirm button
        const confirmButton = screen.getByRole('button', { name: /확인/i });
        fireEvent.click(confirmButton);

        // Verify logout was called and redirect happened
        expect(mockLogout).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/login');
    });
});
