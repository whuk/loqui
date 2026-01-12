import { api } from './api';
import { useChatStore, Conversation } from '@/stores/chatStore';

interface ConversationsResponse {
    data: Conversation[];
}

interface ConversationResponse {
    data: Conversation;
}

export async function fetchConversations(): Promise<Conversation[]> {
    const { setLoading, setConversations } = useChatStore.getState();

    setLoading(true);

    try {
        const response = await api.get<ConversationsResponse>('/conversations');
        setConversations(response.data);
        return response.data;
    } finally {
        setLoading(false);
    }
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<void> {
    const { setLoading, updateConversationTitle: updateTitle } = useChatStore.getState();

    setLoading(true);

    try {
        await api.put<ConversationResponse>(`/conversations/${conversationId}`, { title });
        updateTitle(conversationId, title);
    } finally {
        setLoading(false);
    }
}

export async function deleteConversation(conversationId: string): Promise<void> {
    const { setLoading, removeConversation, setCurrentConversation, currentConversationId } = useChatStore.getState();

    setLoading(true);

    try {
        await api.delete(`/conversations/${conversationId}`);
        removeConversation(conversationId);

        if (currentConversationId === conversationId) {
            setCurrentConversation(null);
        }
    } finally {
        setLoading(false);
    }
}
