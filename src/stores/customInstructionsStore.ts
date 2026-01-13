import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomInstructionsState {
    aboutMe: string;
    responseStyle: string;
    setAboutMe: (value: string) => void;
    setResponseStyle: (value: string) => void;
    getSystemPrompt: () => string;
    clearInstructions: () => void;
}

export const useCustomInstructionsStore = create<CustomInstructionsState>()(
    persist(
        (set, get) => ({
            aboutMe: '',
            responseStyle: '',

            setAboutMe: (value) => set({ aboutMe: value }),

            setResponseStyle: (value) => set({ responseStyle: value }),

            getSystemPrompt: () => {
                const { aboutMe, responseStyle } = get();

                if (!aboutMe && !responseStyle) {
                    return '';
                }

                const parts: string[] = [];

                if (aboutMe) {
                    parts.push(`사용자 정보: ${aboutMe}`);
                }

                if (responseStyle) {
                    parts.push(`응답 스타일: ${responseStyle}`);
                }

                return parts.join('\n\n');
            },

            clearInstructions: () => set({ aboutMe: '', responseStyle: '' }),
        }),
        {
            name: 'custom-instructions-storage',
            partialize: (state) => ({
                aboutMe: state.aboutMe,
                responseStyle: state.responseStyle,
            }),
        }
    )
);
