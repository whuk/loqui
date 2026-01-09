import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './ChatMessage';

describe('ChatMessage', () => {
    it('renders user message with correct content', () => {
        render(<ChatMessage role="user" content="Hello, world!" />);

        expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });

    it('renders assistant message with correct content', () => {
        render(<ChatMessage role="assistant" content="Hi there!" />);

        expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    it('displays "You" label for user messages', () => {
        render(<ChatMessage role="user" content="Test" />);

        expect(screen.getByText('You')).toBeInTheDocument();
    });

    it('displays "Loqui" label for assistant messages', () => {
        render(<ChatMessage role="assistant" content="Test" />);

        expect(screen.getByText('Loqui')).toBeInTheDocument();
    });

    it('applies different background for assistant messages', () => {
        const { container } = render(<ChatMessage role="assistant" content="Test" />);

        const messageDiv = container.firstChild as HTMLElement;
        expect(messageDiv.className).toContain('bg-message-assistant');
    });

    it('has transparent background for user messages', () => {
        const { container } = render(<ChatMessage role="user" content="Test" />);

        const messageDiv = container.firstChild as HTMLElement;
        expect(messageDiv.className).toContain('bg-transparent');
    });
});
