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

export interface ChatState {
    messages: ChatMessage[];
    isConnected: boolean;
    connectedUsers: number;
    systemMessage: string | null;
    currentUser: User;
}

export function useChat(streamId: string) {
    // State
    const messages = ref<ChatMessage[]>([]);
    const isConnected = ref(false);
    const connectedUsers = ref(0);
    const systemMessage = ref<string | null>(null);
    const socket = ref<WebSocket | null>(null);
    const reconnectAttempts = ref(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_INTERVAL = 3000;

    // Generate a random user for demo purposes
    // In a real app, this would come from authentication
    const currentUser = ref<User>({
        id: Math.random().toString(36).substr(2, 9),
        username: `User${Math.floor(Math.random() * 1000)}`,
    });

    // Connect to WebSocket
    function connect() {
        if (socket.value?.readyState === WebSocket.OPEN) return;

        const wsUrl = `${import.meta.env.VITE_WS_URL}/chat/${streamId}`;
        socket.value = new WebSocket(wsUrl);

        socket.value.onopen = handleConnect;
        socket.value.onmessage = handleMessage;
        socket.value.onclose = handleDisconnect;
        socket.value.onerror = handleError;
    }

    // Handle WebSocket connection
    function handleConnect() {
        isConnected.value = true;
        systemMessage.value = 'Connected to chat';
        reconnectAttempts.value = 0;

        // Announce user joining
        sendSystemMessage('joined the chat');
    }

    // Handle incoming messages
    function handleMessage(event: MessageEvent) {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'chat':
                case 'system':
                    messages.value.push({
                        ...data,
                        timestamp: new Date(data.timestamp),
                    });
                    break;

                case 'userCount':
                    connectedUsers.value = data.count;
                    break;

                default:
                    console.warn('Unknown message type:', data.type);
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    }

    // Handle WebSocket disconnection
    function handleDisconnect() {
        isConnected.value = false;
        systemMessage.value = 'Disconnected from chat';

        // Attempt to reconnect if not at max attempts
        if (reconnectAttempts.value < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts.value++;
            setTimeout(connect, RECONNECT_INTERVAL);
            systemMessage.value = `Reconnecting... (Attempt ${reconnectAttempts.value})`;
        } else {
            systemMessage.value = 'Failed to reconnect. Please refresh the page.';
        }
    }

    // Handle WebSocket errors
    function handleError(error: Event) {
        console.error('WebSocket error:', error);
        systemMessage.value = 'Connection error occurred';
    }

    // Send a chat message
    function sendMessage(content: string) {
        if (!isConnected.value || !content.trim()) return false;

        const message = {
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
            console.error('Error sending message:', err);
            return false;
        }
    }

    // Send a system message
    function sendSystemMessage(content: string) {
        if (!isConnected.value) return false;

        const message = {
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
            console.error('Error sending system message:', err);
            return false;
        }
    }

    // Clean up function
    function cleanup() {
        if (socket.value) {
            // Send leave message before disconnecting
            sendSystemMessage('left the chat');

            // Close socket
            socket.value.close();
            socket.value = null;
        }

        // Reset state
        messages.value = [];
        isConnected.value = false;
        connectedUsers.value = 0;
        systemMessage.value = null;
        reconnectAttempts.value = 0;
    }

    // Initialize on mount
    onMounted(() => {
        connect();
    });

    // Cleanup on unmount
    onBeforeUnmount(() => {
        cleanup();
    });

    // Format timestamp helper
    function formatTimestamp(date: Date): string {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    // Return composable state and methods
    return {
        // State
        messages,
        isConnected,
        connectedUsers,
        systemMessage,
        currentUser,

        // Methods
        sendMessage,
        sendSystemMessage,
        formatTimestamp,
        cleanup,

        // Advanced methods for custom implementations
        connect,
        disconnect: cleanup,
    };
}
