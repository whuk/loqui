import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processSSEStream, StreamingMessage } from './streamingService';
import { useChatStore } from '@/stores/chatStore';

describe('streamingService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useChatStore.setState({
            conversations: [],
            currentConversationId: null,
            messages: {},
            isLoading: false,
        });
    });

    describe('processSSEStream', () => {
        it('adds initial message to store when stream starts', async () => {
            const conversationId = 'conv-1';
            const messageId = 'msg-1';

            // Create a mock readable stream
            const mockStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"content":"Hello"}\n\n'));
                    controller.close();
                },
            });

            await processSSEStream(conversationId, messageId, mockStream);

            const messages = useChatStore.getState().messages[conversationId];
            expect(messages).toBeDefined();
            expect(messages.length).toBeGreaterThan(0);
        });

        it('accumulates content from multiple chunks', async () => {
            const conversationId = 'conv-1';
            const messageId = 'msg-1';

            const mockStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"content":"Hello"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"content":" World"}\n\n'));
                    controller.close();
                },
            });

            await processSSEStream(conversationId, messageId, mockStream);

            const messages = useChatStore.getState().messages[conversationId];
            const assistantMessage = messages?.find(m => m.id === messageId);
            expect(assistantMessage?.content).toBe('Hello World');
        });

        it('creates assistant message with correct role', async () => {
            const conversationId = 'conv-1';
            const messageId = 'msg-1';

            const mockStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"content":"Test"}\n\n'));
                    controller.close();
                },
            });

            await processSSEStream(conversationId, messageId, mockStream);

            const messages = useChatStore.getState().messages[conversationId];
            const assistantMessage = messages?.find(m => m.id === messageId);
            expect(assistantMessage?.role).toBe('assistant');
        });

        it('handles [DONE] signal correctly', async () => {
            const conversationId = 'conv-1';
            const messageId = 'msg-1';

            const mockStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"content":"Complete"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                    controller.close();
                },
            });

            await processSSEStream(conversationId, messageId, mockStream);

            const messages = useChatStore.getState().messages[conversationId];
            expect(messages?.find(m => m.id === messageId)?.content).toBe('Complete');
        });

        it('calls onChunk callback for each chunk', async () => {
            const conversationId = 'conv-1';
            const messageId = 'msg-1';
            const onChunk = vi.fn();

            const mockStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"content":"A"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"content":"B"}\n\n'));
                    controller.close();
                },
            });

            await processSSEStream(conversationId, messageId, mockStream, { onChunk });

            expect(onChunk).toHaveBeenCalledTimes(2);
            expect(onChunk).toHaveBeenCalledWith('A');
            expect(onChunk).toHaveBeenCalledWith('B');
        });

        it('calls onComplete callback when stream ends', async () => {
            const conversationId = 'conv-1';
            const messageId = 'msg-1';
            const onComplete = vi.fn();

            const mockStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"content":"Done"}\n\n'));
                    controller.close();
                },
            });

            await processSSEStream(conversationId, messageId, mockStream, { onComplete });

            expect(onComplete).toHaveBeenCalledWith('Done');
        });
    });
});
