import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordForm } from './PasswordForm';

describe('PasswordForm', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders password change form', () => {
        render(<PasswordForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/현재 비밀번호/)).toBeInTheDocument();
        expect(screen.getByLabelText(/새 비밀번호/)).toBeInTheDocument();
        expect(screen.getByLabelText(/비밀번호 확인/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /변경/ })).toBeInTheDocument();
    });

    it('validates current password is required', async () => {
        const user = userEvent.setup();
        render(<PasswordForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/새 비밀번호/), 'newpassword123');
        await user.type(screen.getByLabelText(/비밀번호 확인/), 'newpassword123');
        await user.click(screen.getByRole('button', { name: /변경/ }));

        expect(await screen.findByText(/현재 비밀번호를 입력해주세요/)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates new password is required', async () => {
        const user = userEvent.setup();
        render(<PasswordForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/현재 비밀번호/), 'currentpassword');
        await user.click(screen.getByRole('button', { name: /변경/ }));

        expect(await screen.findByText(/새 비밀번호를 입력해주세요/)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates password confirmation matches', async () => {
        const user = userEvent.setup();
        render(<PasswordForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/현재 비밀번호/), 'currentpassword');
        await user.type(screen.getByLabelText(/새 비밀번호/), 'newpassword123');
        await user.type(screen.getByLabelText(/비밀번호 확인/), 'differentpassword');
        await user.click(screen.getByRole('button', { name: /변경/ }));

        expect(await screen.findByText(/비밀번호가 일치하지 않습니다/)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates new password minimum length', async () => {
        const user = userEvent.setup();
        render(<PasswordForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/현재 비밀번호/), 'currentpassword');
        await user.type(screen.getByLabelText(/새 비밀번호/), 'short');
        await user.type(screen.getByLabelText(/비밀번호 확인/), 'short');
        await user.click(screen.getByRole('button', { name: /변경/ }));

        expect(await screen.findByText(/비밀번호는 최소 8자 이상이어야 합니다/)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with valid data', async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockResolvedValue(undefined);
        render(<PasswordForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/현재 비밀번호/), 'currentpassword');
        await user.type(screen.getByLabelText(/새 비밀번호/), 'newpassword123');
        await user.type(screen.getByLabelText(/비밀번호 확인/), 'newpassword123');
        await user.click(screen.getByRole('button', { name: /변경/ }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                currentPassword: 'currentpassword',
                newPassword: 'newpassword123',
            });
        });
    });

    it('clears form after successful submission', async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockResolvedValue(undefined);
        render(<PasswordForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/현재 비밀번호/), 'currentpassword');
        await user.type(screen.getByLabelText(/새 비밀번호/), 'newpassword123');
        await user.type(screen.getByLabelText(/비밀번호 확인/), 'newpassword123');
        await user.click(screen.getByRole('button', { name: /변경/ }));

        await waitFor(() => {
            expect((screen.getByLabelText(/현재 비밀번호/) as HTMLInputElement).value).toBe('');
            expect((screen.getByLabelText(/새 비밀번호/) as HTMLInputElement).value).toBe('');
            expect((screen.getByLabelText(/비밀번호 확인/) as HTMLInputElement).value).toBe('');
        });
    });

    it('shows loading state while submitting', async () => {
        const user = userEvent.setup();
        let resolveSubmit: () => void;
        const submitPromise = new Promise<void>((resolve) => {
            resolveSubmit = resolve;
        });
        mockOnSubmit.mockReturnValue(submitPromise);

        render(<PasswordForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/현재 비밀번호/), 'currentpassword');
        await user.type(screen.getByLabelText(/새 비밀번호/), 'newpassword123');
        await user.type(screen.getByLabelText(/비밀번호 확인/), 'newpassword123');
        await user.click(screen.getByRole('button', { name: /변경/ }));

        expect(screen.getByRole('button', { name: /변경 중/ })).toBeDisabled();

        resolveSubmit!();
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /변경/ })).not.toBeDisabled();
        });
    });
});
