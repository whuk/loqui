import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/chat'),
}));

describe('Sidebar', () => {
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
});
