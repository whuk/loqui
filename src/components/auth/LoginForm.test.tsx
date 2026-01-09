import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
    it('renders email and password fields', () => {
        render(<LoginForm onSubmit={vi.fn()} />);

        expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    });

    it('shows error when email is empty on submit', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: /로그인/i }));

        await waitFor(() => {
            expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
        });
    });

    it('shows error when email format is invalid', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={vi.fn()} />);

        // Use a text input value that fails zod email() but may pass HTML5 validation
        const emailInput = screen.getByLabelText(/이메일/i);
        await user.type(emailInput, 'invalid-email');
        await user.type(screen.getByLabelText(/비밀번호/i), 'password123');
        await user.click(screen.getByRole('button', { name: /로그인/i }));

        await waitFor(() => {
            expect(screen.getByText(/올바른 이메일 형식이 아닙니다/i)).toBeInTheDocument();
        });
    });

    it('shows error when password is empty on submit', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={vi.fn()} />);

        await user.type(screen.getByLabelText(/이메일/i), 'test@example.com');
        await user.click(screen.getByRole('button', { name: /로그인/i }));

        await waitFor(() => {
            expect(screen.getByText(/비밀번호를 입력해주세요/i)).toBeInTheDocument();
        });
    });

    it('calls onSubmit with form data when validation passes', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<LoginForm onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText(/이메일/i), 'test@example.com');
        await user.type(screen.getByLabelText(/비밀번호/i), 'password123');
        await user.click(screen.getByRole('button', { name: /로그인/i }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
            const calledData = onSubmit.mock.calls[0][0];
            expect(calledData).toEqual({
                email: 'test@example.com',
                password: 'password123',
                rememberMe: false,
            });
        });
    });
});
