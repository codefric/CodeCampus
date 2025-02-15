<script lang="ts" setup>
interface User {
    id: string;
    username: string;
}

interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
}

// State
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const isConnected = ref(false);
const connectedUsers = ref(0);
const systemMessage = ref<string | null>(null);
const messagesContainerRef = ref<HTMLElement | null>(null);

// Generate a random user for demo purposes
// In a real app, this would come from authentication
const currentUser = ref<User>({
    id: Math.random().toString(36).substr(2, 9),
    username: `User${Math.floor(Math.random() * 1000)}`,
});

// Format timestamp to local time
function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Scroll to bottom of messages
function scrollToBottom() {
    nextTick(() => {
        if (messagesContainerRef.value) {
            messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
        }
    });
}

// Send message
function sendMessage() {
    const content = newMessage.value.trim();
    if (!content || !isConnected.value) return;

    const message: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.value.id,
        username: currentUser.value.username,
        content,
        timestamp: new Date(),
    };

    // In a real app, you would emit this to your WebSocket/WebRTC connection
    messages.value.push(message);
    newMessage.value = '';
    scrollToBottom();
}

// Mock connection status for demo
// Replace with actual WebSocket/WebRTC connection logic
onMounted(() => {
    isConnected.value = true;
    connectedUsers.value = 1;
    systemMessage.value = 'Connected to chat';

    // Add some sample messages
    messages.value = [
        {
            id: '1',
            userId: 'system',
            username: 'System',
            content: 'Welcome to the chat!',
            timestamp: new Date(),
        },
        {
            id: '2',
            userId: 'other',
            username: 'John',
            content: 'Hello everyone!',
            timestamp: new Date(),
        },
    ];

    scrollToBottom();
});

// Clean up
onBeforeUnmount(() => {
    isConnected.value = false;
    systemMessage.value = 'Disconnected from chat';
});

// Watch for new messages to scroll
watch(
    () => messages.value.length,
    () => {
        scrollToBottom();
    }
);
</script>

<template>
    <div class="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
        <!-- Chat Header -->
        <div class="p-4 border-b">
            <h2 class="text-xl font-semibold">Live Chat</h2>
            <p class="text-sm text-gray-500">{{ connectedUsers }} users in chat</p>
        </div>

        <!-- Messages Container -->
        <div
            ref="messagesContainerRef"
            class="flex-1 p-4 overflow-y-auto"
        >
            <div
                v-if="messages.length === 0"
                class="text-center text-gray-500 mt-4"
            >
                No messages yet. Be the first to say hello!
            </div>

            <div
                v-for="message in messages"
                :key="message.id"
                class="mb-4"
            >
                <div :class="['flex items-start', message.userId === currentUser.id ? 'flex-row-reverse' : '']">
                    <!-- User Avatar -->
                    <div class="flex-shrink-0">
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center"
                            :class="message.userId === currentUser.id ? 'bg-blue-100' : 'bg-gray-100'"
                        >
                            {{ message.username.charAt(0).toUpperCase() }}
                        </div>
                    </div>

                    <!-- Message Content -->
                    <div
                        :class="[
                            'max-w-[70%] rounded-lg px-4 py-2',
                            message.userId === currentUser.id ? 'mr-3 bg-blue-500 text-white' : 'ml-3 bg-gray-100',
                        ]"
                    >
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-sm">
                                {{ message.username }}
                            </span>
                            <span class="text-xs opacity-70">
                                {{ formatTime(message.timestamp) }}
                            </span>
                        </div>
                        <p :class="['break-words', message.userId === currentUser.id ? 'text-white' : 'text-gray-800']">
                            {{ message.content }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- System Messages -->
        <div
            v-if="systemMessage"
            class="px-4 py-2 bg-gray-100 border-t border-b"
        >
            <p class="text-sm text-gray-600">{{ systemMessage }}</p>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t">
            <form
                class="flex gap-2"
                @submit.prevent="sendMessage"
            >
                <SharedBaseInput
                    v-model="newMessage"
                    type="text"
                    placeholder="Type a message..."
                    :disabled="!isConnected"
                    @keydown.enter.prevent="sendMessage"
                />
                <SharedBaseButton
                    type="submit"
                    state="filled"
                    :disabled="!isConnected || !newMessage.trim()"
                >
                    Send
                </SharedBaseButton>
            </form>
        </div>
    </div>
</template>
