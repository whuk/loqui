import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChatStore } from '@/stores/chatStore';
import { useCustomInstructionsStore } from '@/stores/customInstructionsStore';
import { sendMessage } from './messageService';
import { api } from './api';

vi.mock('./api', () => ({
    api: {
        post: vi.fn(),
    },
}));

describe('messageService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useChatStore.setState({
            conversations: [],
            currentConversationId: null,
            messages: {},
            isLoading: false,
        });
        useCustomInstructionsStore.setState({
            aboutMe: '',
            responseStyle: '',
        });
    });

    describe('sendMessage', () => {
        it('adds user message to store immediately (optimistic update)', async () => {
            const conversationId = 'conv-1';
            const content = 'Hello, world!';

            vi.mocked(api.post).mockResolvedValue({
                data: { id: 'msg-server-1', role: 'user', content },
            });

            // Start sending but don't await yet
            const promise = sendMessage(conversationId, content);

            // Message should appear immediately (optimistic update)
            const messages = useChatStore.getState().messages[conversationId];
            expect(messages).toBeDefined();
            expect(messages.length).toBe(1);
            expect(messages[0].role).toBe('user');
            expect(messages[0].content).toBe(content);

            await promise;
        });

        it('generates a temporary id for the optimistic message', async () => {
            const conversationId = 'conv-1';
            const content = 'Test message';

            vi.mocked(api.post).mockResolvedValue({
                data: { id: 'msg-server-1', role: 'user', content },
            });

            sendMessage(conversationId, content);

            const messages = useChatStore.getState().messages[conversationId];
            expect(messages[0].id).toMatch(/^temp-/);
        });

        it('sends message to API with correct payload', async () => {
            const conversationId = 'conv-1';
            const content = 'Hello API';

            vi.mocked(api.post).mockResolvedValue({
                data: { id: 'msg-1', role: 'user', content },
            });

            await sendMessage(conversationId, content);

            expect(api.post).toHaveBeenCalledWith(
                `/conversations/${conversationId}/messages`,
                { content }
            );
        });

        it('replaces temporary id with server id after successful response', async () => {
            const conversationId = 'conv-1';
            const content = 'Hello';
            const serverId = 'msg-server-123';

            vi.mocked(api.post).mockResolvedValue({
                data: { id: serverId, role: 'user', content },
            });

            await sendMessage(conversationId, content);

            const messages = useChatStore.getState().messages[conversationId];
            expect(messages[0].id).toBe(serverId);
        });

        it('sets loading state while sending', async () => {
            const conversationId = 'conv-1';
            const content = 'Test';

            let resolvePromise: (value: unknown) => void;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            vi.mocked(api.post).mockReturnValue(pendingPromise as Promise<unknown>);

            const sendPromise = sendMessage(conversationId, content);

            expect(useChatStore.getState().isLoading).toBe(true);

            resolvePromise!({ data: { id: 'msg-1', role: 'user', content } });
            await sendPromise;

            expect(useChatStore.getState().isLoading).toBe(false);
        });

        it('removes optimistic message and throws on API error', async () => {
            const conversationId = 'conv-1';
            const content = 'Test';

            vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

            await expect(sendMessage(conversationId, content)).rejects.toThrow('Network error');

            const messages = useChatStore.getState().messages[conversationId];
            expect(messages).toEqual([]);
            expect(useChatStore.getState().isLoading).toBe(false);
        });

        it('includes custom instructions as system prompt when set', async () => {
            const conversationId = 'conv-1';
            const content = 'Hello';

            useCustomInstructionsStore.setState({
                aboutMe: 'I am a developer',
                responseStyle: 'Be concise',
            });

            vi.mocked(api.post).mockResolvedValue({
                data: { id: 'msg-1', role: 'user', content },
            });

            await sendMessage(conversationId, content);

            expect(api.post).toHaveBeenCalledWith(
                `/conversations/${conversationId}/messages`,
                {
                    content,
                    systemPrompt: expect.stringContaining('I am a developer'),
                }
            );
            expect(api.post).toHaveBeenCalledWith(
                `/conversations/${conversationId}/messages`,
                {
                    content,
                    systemPrompt: expect.stringContaining('Be concise'),
                }
            );
        });

        it('does not include system prompt when custom instructions are empty', async () => {
            const conversationId = 'conv-1';
            const content = 'Hello';

            vi.mocked(api.post).mockResolvedValue({
                data: { id: 'msg-1', role: 'user', content },
            });

            await sendMessage(conversationId, content);

            expect(api.post).toHaveBeenCalledWith(
                `/conversations/${conversationId}/messages`,
                { content }
            );
        });
    });
});
