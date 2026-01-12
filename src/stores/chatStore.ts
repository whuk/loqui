import { create } from 'zustand';

export interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatState {
    conversations: Conversation[];
    currentConversationId: string | null;
    messages: Record<string, Message[]>;
    isLoading: boolean;
    setConversations: (conversations: Conversation[]) => void;
    addConversation: (conversation: Conversation) => void;
    removeConversation: (id: string) => void;
    updateConversationTitle: (id: string, title: string) => void;
    setCurrentConversation: (id: string | null) => void;
    setMessages: (conversationId: string, messages: Message[]) => void;
    addMessage: (conversationId: string, message: Message) => void;
    setLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    conversations: [],
    currentConversationId: null,
    messages: {},
    isLoading: false,

    setConversations: (conversations) => set({ conversations }),

    addConversation: (conversation) =>
        set((state) => ({
            conversations: [conversation, ...state.conversations],
        })),

    removeConversation: (id) =>
        set((state) => ({
            conversations: state.conversations.filter((c) => c.id !== id),
        })),

    updateConversationTitle: (id, title) =>
        set((state) => ({
            conversations: state.conversations.map((c) =>
                c.id === id ? { ...c, title } : c
            ),
        })),

    setCurrentConversation: (id) => set({ currentConversationId: id }),

    setMessages: (conversationId, messages) =>
        set((state) => ({
            messages: { ...state.messages, [conversationId]: messages },
        })),

    addMessage: (conversationId, message) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [conversationId]: [...(state.messages[conversationId] || []), message],
            },
        })),

    setLoading: (isLoading) => set({ isLoading }),
}));
