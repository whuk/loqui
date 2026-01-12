import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from './chatStore';

describe('chatStore', () => {
    beforeEach(() => {
        useChatStore.setState({
            conversations: [],
            currentConversationId: null,
            messages: {},
            isLoading: false,
        });
    });

    describe('conversation management', () => {
        it('has initial state with empty conversations', () => {
            const state = useChatStore.getState();
            expect(state.conversations).toEqual([]);
            expect(state.currentConversationId).toBeNull();
            expect(state.isLoading).toBe(false);
        });

        it('setConversations updates conversation list', () => {
            const conversations = [
                { id: '1', title: 'First chat', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
                { id: '2', title: 'Second chat', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
            ];

            useChatStore.getState().setConversations(conversations);

            expect(useChatStore.getState().conversations).toEqual(conversations);
        });

        it('addConversation adds new conversation to the beginning', () => {
            const existingConversation = { id: '1', title: 'Existing', createdAt: '2024-01-01', updatedAt: '2024-01-01' };
            useChatStore.setState({ conversations: [existingConversation] });

            const newConversation = { id: '2', title: 'New chat', createdAt: '2024-01-02', updatedAt: '2024-01-02' };
            useChatStore.getState().addConversation(newConversation);

            const conversations = useChatStore.getState().conversations;
            expect(conversations).toHaveLength(2);
            expect(conversations[0]).toEqual(newConversation);
        });

        it('removeConversation removes conversation by id', () => {
            const conversations = [
                { id: '1', title: 'First', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
                { id: '2', title: 'Second', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
            ];
            useChatStore.setState({ conversations });

            useChatStore.getState().removeConversation('1');

            expect(useChatStore.getState().conversations).toHaveLength(1);
            expect(useChatStore.getState().conversations[0].id).toBe('2');
        });

        it('updateConversationTitle updates title by id', () => {
            const conversations = [
                { id: '1', title: 'Old title', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
            ];
            useChatStore.setState({ conversations });

            useChatStore.getState().updateConversationTitle('1', 'New title');

            expect(useChatStore.getState().conversations[0].title).toBe('New title');
        });

        it('setCurrentConversation updates current conversation id', () => {
            useChatStore.getState().setCurrentConversation('conv-123');

            expect(useChatStore.getState().currentConversationId).toBe('conv-123');
        });
    });

    describe('message management', () => {
        it('messages start empty for a conversation', () => {
            const state = useChatStore.getState();
            expect(state.messages).toEqual({});
        });

        it('setMessages sets messages for a conversation', () => {
            const messages = [
                { id: 'm1', role: 'user' as const, content: 'Hello' },
                { id: 'm2', role: 'assistant' as const, content: 'Hi there!' },
            ];

            useChatStore.getState().setMessages('conv-1', messages);

            expect(useChatStore.getState().messages['conv-1']).toEqual(messages);
        });

        it('addMessage appends message to conversation', () => {
            const existingMessages = [
                { id: 'm1', role: 'user' as const, content: 'Hello' },
            ];
            useChatStore.setState({ messages: { 'conv-1': existingMessages } });

            const newMessage = { id: 'm2', role: 'assistant' as const, content: 'Hi!' };
            useChatStore.getState().addMessage('conv-1', newMessage);

            const messages = useChatStore.getState().messages['conv-1'];
            expect(messages).toHaveLength(2);
            expect(messages[1]).toEqual(newMessage);
        });

        it('addMessage creates new conversation messages array if not exists', () => {
            const newMessage = { id: 'm1', role: 'user' as const, content: 'Hello' };
            useChatStore.getState().addMessage('new-conv', newMessage);

            expect(useChatStore.getState().messages['new-conv']).toEqual([newMessage]);
        });
    });

    describe('loading state', () => {
        it('setLoading updates loading state', () => {
            useChatStore.getState().setLoading(true);
            expect(useChatStore.getState().isLoading).toBe(true);

            useChatStore.getState().setLoading(false);
            expect(useChatStore.getState().isLoading).toBe(false);
        });
    });
});
