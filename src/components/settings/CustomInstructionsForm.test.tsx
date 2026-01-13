import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomInstructionsForm } from './CustomInstructionsForm';
import { useCustomInstructionsStore } from '@/stores/customInstructionsStore';

describe('CustomInstructionsForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useCustomInstructionsStore.setState({
            aboutMe: '',
            responseStyle: '',
        });
    });

    it('renders aboutMe textarea with label', () => {
        render(<CustomInstructionsForm />);

        expect(screen.getByLabelText(/나에 대해/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/직업, 관심사/)).toBeInTheDocument();
    });

    it('renders responseStyle textarea with label', () => {
        render(<CustomInstructionsForm />);

        expect(screen.getByLabelText(/응답 방식/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/응답 길이, 형식/)).toBeInTheDocument();
    });

    it('displays character count for aboutMe', () => {
        render(<CustomInstructionsForm />);

        const counts = screen.getAllByText(/0 \/ 1500/);
        expect(counts.length).toBeGreaterThanOrEqual(1);
    });

    it('displays character count for responseStyle', () => {
        render(<CustomInstructionsForm />);

        const counts = screen.getAllByText(/0 \/ 1500/);
        expect(counts.length).toBe(2);
    });

    it('updates character count when typing in aboutMe', async () => {
        const user = userEvent.setup();
        render(<CustomInstructionsForm />);

        const aboutMeTextarea = screen.getByLabelText(/나에 대해/);
        await user.type(aboutMeTextarea, 'Hello');

        expect(screen.getByText(/5 \/ 1500/)).toBeInTheDocument();
    });

    it('updates character count when typing in responseStyle', async () => {
        const user = userEvent.setup();
        render(<CustomInstructionsForm />);

        const responseStyleTextarea = screen.getByLabelText(/응답 방식/);
        await user.type(responseStyleTextarea, 'Be concise');

        expect(screen.getByText(/10 \/ 1500/)).toBeInTheDocument();
    });

    it('loads initial values from store', () => {
        useCustomInstructionsStore.setState({
            aboutMe: 'I am a developer',
            responseStyle: 'Be professional',
        });

        render(<CustomInstructionsForm />);

        expect(screen.getByLabelText(/나에 대해/)).toHaveValue('I am a developer');
        expect(screen.getByLabelText(/응답 방식/)).toHaveValue('Be professional');
    });

    it('enforces max character limit of 1500', async () => {
        const user = userEvent.setup();
        render(<CustomInstructionsForm />);

        const aboutMeTextarea = screen.getByLabelText(/나에 대해/) as HTMLTextAreaElement;
        expect(aboutMeTextarea.maxLength).toBe(1500);
    });
});
