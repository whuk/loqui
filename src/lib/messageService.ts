import { api } from './api';
import { useChatStore, Message } from '@/stores/chatStore';

interface SendMessageResponse {
    data: Message;
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
    const { addMessage, setMessages, setLoading } = useChatStore.getState();

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
        id: tempId,
        role: 'user',
        content,
    };

    // Optimistic update - add message immediately
    addMessage(conversationId, optimisticMessage);
    setLoading(true);

    try {
        const response = await api.post<SendMessageResponse>(
            `/conversations/${conversationId}/messages`,
            { content }
        );

        // Replace temporary message with server response
        const currentMessages = useChatStore.getState().messages[conversationId] || [];
        const updatedMessages = currentMessages.map((msg) =>
            msg.id === tempId ? response.data : msg
        );
        setMessages(conversationId, updatedMessages);

        return response.data;
    } catch (error) {
        // Remove optimistic message on error
        const currentMessages = useChatStore.getState().messages[conversationId] || [];
        const filteredMessages = currentMessages.filter((msg) => msg.id !== tempId);
        setMessages(conversationId, filteredMessages);
        throw error;
    } finally {
        setLoading(false);
    }
}
