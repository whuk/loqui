import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchConversations } from './conversationService';
import { api } from './api';
import { useChatStore } from '@/stores/chatStore';

// Mock the api module
vi.mock('./api', () => ({
    api: {
        get: vi.fn(),
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
});
