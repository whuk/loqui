import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchConversations, updateConversationTitle, deleteConversation } from './conversationService';
import { api } from './api';
import { useChatStore } from '@/stores/chatStore';

// Mock the api module
vi.mock('./api', () => ({
    api: {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('conversationService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useChatStore.setState({
            conversations: [],
            currentConversationId: null,
            messages: {},
            isLoading: false,
        });
    });

    describe('fetchConversations', () => {
        it('fetches conversations from API and updates store', async () => {
            const mockConversations = [
                { id: '1', title: 'First chat', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
                { id: '2', title: 'Second chat', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
            ];

            vi.mocked(api.get).mockResolvedValueOnce({ data: mockConversations });

            await fetchConversations();

            expect(api.get).toHaveBeenCalledWith('/conversations');
            expect(useChatStore.getState().conversations).toEqual(mockConversations);
        });

        it('sets loading state while fetching', async () => {
            const mockConversations = [{ id: '1', title: 'Chat', createdAt: '2024-01-01', updatedAt: '2024-01-01' }];

            let resolvePromise: (value: any) => void;
            const promise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            vi.mocked(api.get).mockReturnValueOnce(promise as any);

            const fetchPromise = fetchConversations();

            // Loading should be true while fetching
            expect(useChatStore.getState().isLoading).toBe(true);

            // Resolve the API call
            resolvePromise!({ data: mockConversations });
            await fetchPromise;

            // Loading should be false after fetching
            expect(useChatStore.getState().isLoading).toBe(false);
        });

        it('sets loading to false on error', async () => {
            vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

            await expect(fetchConversations()).rejects.toThrow('Network error');

            expect(useChatStore.getState().isLoading).toBe(false);
        });

        it('returns the fetched conversations', async () => {
            const mockConversations = [
                { id: '1', title: 'Chat 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
            ];

            vi.mocked(api.get).mockResolvedValueOnce({ data: mockConversations });

            const result = await fetchConversations();

            expect(result).toEqual(mockConversations);
        });
    });

    describe('updateConversationTitle', () => {
        it('calls API with correct endpoint and payload', async () => {
            const conversationId = 'conv-1';
            const newTitle = 'Updated Title';

            vi.mocked(api.put).mockResolvedValueOnce({ data: { id: conversationId, title: newTitle } });

            await updateConversationTitle(conversationId, newTitle);

            expect(api.put).toHaveBeenCalledWith(`/conversations/${conversationId}`, { title: newTitle });
        });

        it('updates conversation title in store', async () => {
            const conversationId = 'conv-1';
            const newTitle = 'Updated Title';
            const existingConversation = { id: conversationId, title: 'Old Title', createdAt: '2024-01-01', updatedAt: '2024-01-01' };

            useChatStore.setState({ conversations: [existingConversation] });

            vi.mocked(api.put).mockResolvedValueOnce({ data: { id: conversationId, title: newTitle } });

            await updateConversationTitle(conversationId, newTitle);

            expect(useChatStore.getState().conversations[0].title).toBe(newTitle);
        });

        it('sets loading state while updating', async () => {
            const conversationId = 'conv-1';

            let resolvePromise: (value: unknown) => void;
            const promise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            vi.mocked(api.put).mockReturnValueOnce(promise as Promise<unknown>);

            const updatePromise = updateConversationTitle(conversationId, 'New Title');

            expect(useChatStore.getState().isLoading).toBe(true);

            resolvePromise!({ data: { id: conversationId, title: 'New Title' } });
            await updatePromise;

            expect(useChatStore.getState().isLoading).toBe(false);
        });

        it('sets loading to false on error', async () => {
            vi.mocked(api.put).mockRejectedValueOnce(new Error('Update failed'));

            await expect(updateConversationTitle('conv-1', 'Title')).rejects.toThrow('Update failed');

            expect(useChatStore.getState().isLoading).toBe(false);
        });
    });

    describe('deleteConversation', () => {
        it('calls API with correct endpoint', async () => {
            const conversationId = 'conv-1';

            vi.mocked(api.delete).mockResolvedValueOnce({});

            await deleteConversation(conversationId);

            expect(api.delete).toHaveBeenCalledWith(`/conversations/${conversationId}`);
        });

        it('removes conversation from store', async () => {
            const conversationId = 'conv-1';
            const conversations = [
                { id: conversationId, title: 'To Delete', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
                { id: 'conv-2', title: 'Keep', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
            ];

            useChatStore.setState({ conversations });

            vi.mocked(api.delete).mockResolvedValueOnce({});

            await deleteConversation(conversationId);

            expect(useChatStore.getState().conversations).toHaveLength(1);
            expect(useChatStore.getState().conversations[0].id).toBe('conv-2');
        });

        it('clears currentConversationId if deleted conversation was selected', async () => {
            const conversationId = 'conv-1';
            const conversations = [
                { id: conversationId, title: 'Current', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
            ];

            useChatStore.setState({ conversations, currentConversationId: conversationId });

            vi.mocked(api.delete).mockResolvedValueOnce({});

            await deleteConversation(conversationId);

            expect(useChatStore.getState().currentConversationId).toBeNull();
        });

        it('sets loading state while deleting', async () => {
            const conversationId = 'conv-1';
            useChatStore.setState({
                conversations: [{ id: conversationId, title: 'Test', createdAt: '2024-01-01', updatedAt: '2024-01-01' }],
            });

            let resolvePromise: (value: unknown) => void;
            const promise = new Promise((resolve) => {
                resolvePromise = resolve;
            });

            vi.mocked(api.delete).mockReturnValueOnce(promise as Promise<unknown>);

            const deletePromise = deleteConversation(conversationId);

            expect(useChatStore.getState().isLoading).toBe(true);

            resolvePromise!({});
            await deletePromise;

            expect(useChatStore.getState().isLoading).toBe(false);
        });

        it('sets loading to false on error', async () => {
            vi.mocked(api.delete).mockRejectedValueOnce(new Error('Delete failed'));

            await expect(deleteConversation('conv-1')).rejects.toThrow('Delete failed');

            expect(useChatStore.getState().isLoading).toBe(false);
        });
    });
});
