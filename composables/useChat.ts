// composables/useChat.ts
export interface User {
    id: string;
    username: string;
}

export interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
    type: 'chat' | 'system';
}

export function useChat(streamId: string) {
    const messages = ref<ChatMessage[]>([]);
    const isConnected = ref(false);
    const connectedUsers = ref(0);
    const systemMessage = ref<string | null>(null);
    const socket = ref<WebSocket | null>(null);
    const reconnectAttempts = ref(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_INTERVAL = 3000;

    // Generate a random user for demo purposes
    const currentUser = ref<User>({
        id: Math.random().toString(36).substr(2, 9),
        username: `User${Math.floor(Math.random() * 1000)}`,
    });

    function connect() {
        if (socket.value?.readyState === WebSocket.OPEN) return;

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.hostname}:34567/chat/${streamId}`;
        console.log('[Chat] Connecting to:', wsUrl);

        socket.value = new WebSocket(wsUrl);
        socket.value.onopen = handleConnect;
        socket.value.onmessage = handleMessage;
        socket.value.onclose = handleDisconnect;
        socket.value.onerror = handleError;
    }

    function handleConnect() {
        console.log('[Chat] Connected successfully');
        isConnected.value = true;
        systemMessage.value = 'Connected to chat';
        reconnectAttempts.value = 0;

        // Announce user joining
        sendSystemMessage('joined the chat');
    }

    function handleMessage(event: MessageEvent) {
        try {
            const data = JSON.parse(event.data);
            console.log('[Chat] Received message:', data);

            switch (data.type) {
                case 'chat':
                case 'system':
                    messages.value.push({
                        ...data,
                        id: Math.random().toString(36).substr(2, 9),
                        timestamp: new Date(data.timestamp),
                    });
                    break;

                case 'userCount':
                    connectedUsers.value = data.count;
                    break;

                default:
                    console.warn('[Chat] Unknown message type:', data.type);
            }
        } catch (err) {
            console.error('[Chat] Error parsing message:', err);
        }
    }

    function handleDisconnect() {
        console.log('[Chat] Disconnected');
        isConnected.value = false;
        systemMessage.value = 'Disconnected from chat';

        if (reconnectAttempts.value < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts.value++;
            setTimeout(connect, RECONNECT_INTERVAL);
            systemMessage.value = `Reconnecting... (Attempt ${reconnectAttempts.value})`;
        } else {
            systemMessage.value = 'Failed to reconnect. Please refresh the page.';
        }
    }

    function handleError(error: Event) {
        console.error('[Chat] WebSocket error:', error);
        systemMessage.value = 'Connection error occurred';
    }

    function sendMessage(content: string) {
        if (!isConnected.value || !content.trim()) return false;

        const message = {
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUser.value.id,
            username: currentUser.value.username,
            content: content.trim(),
            timestamp: new Date(),
            type: 'chat' as const,
            streamId,
        };

        try {
            socket.value?.send(JSON.stringify(message));
            return true;
        } catch (err) {
            console.error('[Chat] Error sending message:', err);
            return false;
        }
    }

    function sendSystemMessage(content: string) {
        if (!isConnected.value) return false;

        const message = {
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUser.value.id,
            username: currentUser.value.username,
            content,
            timestamp: new Date(),
            type: 'system' as const,
            streamId,
        };

        try {
            socket.value?.send(JSON.stringify(message));
            return true;
        } catch (err) {
            console.error('[Chat] Error sending system message:', err);
            return false;
        }
    }

    function cleanup() {
        if (socket.value) {
            if (socket.value.readyState === WebSocket.OPEN) {
                sendSystemMessage('left the chat');
            }
            socket.value.close();
            socket.value = null;
        }

        messages.value = [];
        isConnected.value = false;
        connectedUsers.value = 0;
        systemMessage.value = null;
        reconnectAttempts.value = 0;
    }

    function formatTimestamp(date: Date): string {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    onMounted(() => {
        connect();
    });

    onBeforeUnmount(() => {
        cleanup();
    });

    return {
        messages,
        isConnected,
        connectedUsers,
        systemMessage,
        currentUser,
        sendMessage,
        sendSystemMessage,
        formatTimestamp,
        cleanup,
        connect,
        disconnect: cleanup,
    };
}
