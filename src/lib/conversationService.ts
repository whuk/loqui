import { api } from './api';
import { useChatStore, Conversation } from '@/stores/chatStore';

interface ConversationsResponse {
    data: Conversation[];
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
