import { useChatStore } from '@/stores/chatStore';

export interface StreamingMessage {
    content: string;
}

interface StreamingOptions {
    onChunk?: (chunk: string) => void;
    onComplete?: (fullContent: string) => void;
}

export async function processSSEStream(
    conversationId: string,
    messageId: string,
    stream: ReadableStream<Uint8Array>,
    options: StreamingOptions = {}
): Promise<void> {
    const { addMessage, setMessages } = useChatStore.getState();
    const { onChunk, onComplete } = options;

    let accumulatedContent = '';

    // Add initial empty assistant message
    const existingMessages = useChatStore.getState().messages[conversationId] || [];
    setMessages(conversationId, [
        ...existingMessages,
        { id: messageId, role: 'assistant', content: '' },
    ]);

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);

                    if (data === '[DONE]') {
                        continue;
                    }

                    try {
                        const parsed: StreamingMessage = JSON.parse(data);
                        accumulatedContent += parsed.content;

                        // Update the message in the store
                        const currentMessages = useChatStore.getState().messages[conversationId] || [];
                        const updatedMessages = currentMessages.map((msg) =>
                            msg.id === messageId
                                ? { ...msg, content: accumulatedContent }
                                : msg
                        );
                        setMessages(conversationId, updatedMessages);

                        onChunk?.(parsed.content);
                    } catch {
                        // Skip malformed JSON
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }

    onComplete?.(accumulatedContent);
}
