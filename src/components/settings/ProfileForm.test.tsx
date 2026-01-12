import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from './ProfileForm';
import { useAuthStore } from '@/stores/authStore';

describe('ProfileForm', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({
            user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
            isAuthenticated: true,
            accessToken: 'token',
            refreshToken: 'refresh',
        });
    });

    it('renders profile form with user data', () => {
        render(<ProfileForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
        expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /저장/ })).toBeInTheDocument();
    });

    it('displays current user name in input', () => {
        render(<ProfileForm onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByLabelText(/이름/) as HTMLInputElement;
        expect(nameInput.value).toBe('Test User');
    });

    it('displays email as disabled input', () => {
        render(<ProfileForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/이메일/) as HTMLInputElement;
        expect(emailInput.value).toBe('test@example.com');
        expect(emailInput).toBeDisabled();
    });

    it('validates name is required', async () => {
        const user = userEvent.setup();
        render(<ProfileForm onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByLabelText(/이름/);
        await user.clear(nameInput);
        await user.click(screen.getByRole('button', { name: /저장/ }));

        expect(await screen.findByText(/이름을 입력해주세요/)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with updated name on valid submission', async () => {
        const user = userEvent.setup();
        mockOnSubmit.mockResolvedValue(undefined);
        render(<ProfileForm onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByLabelText(/이름/);
        await user.clear(nameInput);
        await user.type(nameInput, 'New Name');
        await user.click(screen.getByRole('button', { name: /저장/ }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'New Name' });
        });
    });

    it('shows loading state while submitting', async () => {
        const user = userEvent.setup();
        let resolveSubmit: () => void;
        const submitPromise = new Promise<void>((resolve) => {
            resolveSubmit = resolve;
        });
        mockOnSubmit.mockReturnValue(submitPromise);

        render(<ProfileForm onSubmit={mockOnSubmit} />);

        await user.click(screen.getByRole('button', { name: /저장/ }));

        expect(screen.getByRole('button', { name: /저장 중/ })).toBeDisabled();

        resolveSubmit!();
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /저장/ })).not.toBeDisabled();
        });
    });
});
