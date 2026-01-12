import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastContainer, useToast, ToastProvider } from './Toast';

describe('Toast', () => {
    describe('Toast component', () => {
        it('renders toast message', () => {
            render(<Toast message="Test message" type="info" onClose={() => {}} />);

            expect(screen.getByText('Test message')).toBeInTheDocument();
        });

        it('renders with error style', () => {
            render(<Toast message="Error occurred" type="error" onClose={() => {}} data-testid="toast" />);

            const toast = screen.getByTestId('toast');
            expect(toast).toHaveClass('bg-red-500');
        });

        it('renders with success style', () => {
            render(<Toast message="Success!" type="success" onClose={() => {}} data-testid="toast" />);

            const toast = screen.getByTestId('toast');
            expect(toast).toHaveClass('bg-green-500');
        });

        it('renders with info style', () => {
            render(<Toast message="Info" type="info" onClose={() => {}} data-testid="toast" />);

            const toast = screen.getByTestId('toast');
            expect(toast).toHaveClass('bg-blue-500');
        });

        it('calls onClose when close button is clicked', async () => {
            const user = userEvent.setup();
            const onClose = vi.fn();

            render(<Toast message="Test" type="info" onClose={onClose} />);

            await user.click(screen.getByRole('button', { name: /닫기/ }));
            expect(onClose).toHaveBeenCalled();
        });
    });

    describe('useToast hook', () => {
        function TestComponent() {
            const { showToast, toasts } = useToast();

            return (
                <div>
                    <button onClick={() => showToast('Test toast', 'error')}>Show Toast</button>
                    <div data-testid="toast-count">{toasts.length}</div>
                </div>
            );
        }

        it('adds toast when showToast is called', async () => {
            const user = userEvent.setup();

            render(
                <ToastProvider>
                    <TestComponent />
                </ToastProvider>
            );

            expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

            await user.click(screen.getByText('Show Toast'));

            expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
        });
    });

    describe('ToastContainer', () => {
        it('renders multiple toasts', () => {
            const toasts = [
                { id: '1', message: 'Toast 1', type: 'info' as const },
                { id: '2', message: 'Toast 2', type: 'error' as const },
            ];

            render(
                <ToastProvider>
                    <ToastContainer toasts={toasts} onRemove={() => {}} />
                </ToastProvider>
            );

            expect(screen.getByText('Toast 1')).toBeInTheDocument();
            expect(screen.getByText('Toast 2')).toBeInTheDocument();
        });

        it('removes toast when close is clicked', async () => {
            const user = userEvent.setup();
            const onRemove = vi.fn();
            const toasts = [{ id: '1', message: 'Toast 1', type: 'info' as const }];

            render(
                <ToastProvider>
                    <ToastContainer toasts={toasts} onRemove={onRemove} />
                </ToastProvider>
            );

            await user.click(screen.getByRole('button', { name: /닫기/ }));
            expect(onRemove).toHaveBeenCalledWith('1');
        });
    });
});
