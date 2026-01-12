import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
    it('renders textarea with placeholder', () => {
        render(<ChatInput />);

        expect(screen.getByPlaceholderText('메시지를 입력하세요...')).toBeInTheDocument();
    });

    it('renders send button', () => {
        render(<ChatInput />);

        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('updates textarea value when typing', async () => {
        const user = userEvent.setup();
        render(<ChatInput />);

        const textarea = screen.getByPlaceholderText('메시지를 입력하세요...');
        await user.type(textarea, 'Hello');

        expect(textarea).toHaveValue('Hello');
    });

    it('disables send button when input is empty', () => {
        render(<ChatInput />);

        const button = screen.getByRole('button', { name: /send/i });
        expect(button).toBeDisabled();
    });

    it('enables send button when input has text', async () => {
        const user = userEvent.setup();
        render(<ChatInput />);

        const textarea = screen.getByPlaceholderText('메시지를 입력하세요...');
        await user.type(textarea, 'Hello');

        const button = screen.getByRole('button', { name: /send/i });
        expect(button).toBeEnabled();
    });

    it('calls onSend with message when send button is clicked', async () => {
        const user = userEvent.setup();
        const onSend = vi.fn();
        render(<ChatInput onSend={onSend} />);

        const textarea = screen.getByPlaceholderText('메시지를 입력하세요...');
        await user.type(textarea, 'Hello');

        const button = screen.getByRole('button', { name: /send/i });
        await user.click(button);

        expect(onSend).toHaveBeenCalledWith('Hello');
    });

    it('clears textarea after sending message', async () => {
        const user = userEvent.setup();
        const onSend = vi.fn();
        render(<ChatInput onSend={onSend} />);

        const textarea = screen.getByPlaceholderText('메시지를 입력하세요...');
        await user.type(textarea, 'Hello');

        const button = screen.getByRole('button', { name: /send/i });
        await user.click(button);

        expect(textarea).toHaveValue('');
    });

    it('sends message when Enter key is pressed', async () => {
        const user = userEvent.setup();
        const onSend = vi.fn();
        render(<ChatInput onSend={onSend} />);

        const textarea = screen.getByPlaceholderText('메시지를 입력하세요...');
        await user.type(textarea, 'Hello');
        await user.keyboard('{Enter}');

        expect(onSend).toHaveBeenCalledWith('Hello');
    });

    it('does not send message when Shift+Enter is pressed', async () => {
        const user = userEvent.setup();
        const onSend = vi.fn();
        render(<ChatInput onSend={onSend} />);

        const textarea = screen.getByPlaceholderText('메시지를 입력하세요...');
        await user.type(textarea, 'Hello');
        await user.keyboard('{Shift>}{Enter}{/Shift}');

        expect(onSend).not.toHaveBeenCalled();
    });

    it('does not send empty or whitespace-only messages', async () => {
        const user = userEvent.setup();
        const onSend = vi.fn();
        render(<ChatInput onSend={onSend} />);

        const textarea = screen.getByPlaceholderText('메시지를 입력하세요...');
        await user.type(textarea, '   ');
        await user.keyboard('{Enter}');

        expect(onSend).not.toHaveBeenCalled();
    });
});
