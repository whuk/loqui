import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCustomInstructionsStore } from './customInstructionsStore';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('customInstructionsStore', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
        useCustomInstructionsStore.setState({
            aboutMe: '',
            responseStyle: '',
        });
    });

    describe('initial state', () => {
        it('has empty aboutMe by default', () => {
            const state = useCustomInstructionsStore.getState();
            expect(state.aboutMe).toBe('');
        });

        it('has empty responseStyle by default', () => {
            const state = useCustomInstructionsStore.getState();
            expect(state.responseStyle).toBe('');
        });
    });

    describe('setAboutMe', () => {
        it('sets aboutMe value', () => {
            useCustomInstructionsStore.getState().setAboutMe('I am a software developer');
            expect(useCustomInstructionsStore.getState().aboutMe).toBe('I am a software developer');
        });

        it('updates aboutMe value', () => {
            useCustomInstructionsStore.getState().setAboutMe('First value');
            useCustomInstructionsStore.getState().setAboutMe('Updated value');
            expect(useCustomInstructionsStore.getState().aboutMe).toBe('Updated value');
        });
    });

    describe('setResponseStyle', () => {
        it('sets responseStyle value', () => {
            useCustomInstructionsStore.getState().setResponseStyle('Be concise and professional');
            expect(useCustomInstructionsStore.getState().responseStyle).toBe('Be concise and professional');
        });

        it('updates responseStyle value', () => {
            useCustomInstructionsStore.getState().setResponseStyle('First style');
            useCustomInstructionsStore.getState().setResponseStyle('Updated style');
            expect(useCustomInstructionsStore.getState().responseStyle).toBe('Updated style');
        });
    });

    describe('getSystemPrompt', () => {
        it('returns empty string when both fields are empty', () => {
            const prompt = useCustomInstructionsStore.getState().getSystemPrompt();
            expect(prompt).toBe('');
        });

        it('returns formatted prompt with aboutMe only', () => {
            useCustomInstructionsStore.getState().setAboutMe('I am a developer');
            const prompt = useCustomInstructionsStore.getState().getSystemPrompt();
            expect(prompt).toContain('I am a developer');
        });

        it('returns formatted prompt with responseStyle only', () => {
            useCustomInstructionsStore.getState().setResponseStyle('Be brief');
            const prompt = useCustomInstructionsStore.getState().getSystemPrompt();
            expect(prompt).toContain('Be brief');
        });

        it('returns formatted prompt with both fields', () => {
            useCustomInstructionsStore.getState().setAboutMe('I am a developer');
            useCustomInstructionsStore.getState().setResponseStyle('Be brief');
            const prompt = useCustomInstructionsStore.getState().getSystemPrompt();
            expect(prompt).toContain('I am a developer');
            expect(prompt).toContain('Be brief');
        });
    });

    describe('clearInstructions', () => {
        it('clears both aboutMe and responseStyle', () => {
            useCustomInstructionsStore.getState().setAboutMe('Some about me');
            useCustomInstructionsStore.getState().setResponseStyle('Some style');
            useCustomInstructionsStore.getState().clearInstructions();

            const state = useCustomInstructionsStore.getState();
            expect(state.aboutMe).toBe('');
            expect(state.responseStyle).toBe('');
        });
    });
});
