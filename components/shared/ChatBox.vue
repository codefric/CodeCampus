<script setup lang="ts">
import { useChat } from '@/composables/useChat';
import { ref, watch } from 'vue';

const props = defineProps<{
    streamId: string;
}>();

const messagesContainerRef = ref<HTMLElement | null>(null);
const newMessage = ref('');

const { messages, isConnected, connectedUsers, systemMessage, currentUser, sendMessage, formatTimestamp } = useChat(props.streamId);

// Scroll to bottom of messages
function scrollToBottom() {
    nextTick(() => {
        if (messagesContainerRef.value) {
            messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
        }
    });
}

// Handle message submission
function handleSendMessage() {
    const content = newMessage.value.trim();
    if (!content || !isConnected.value) return;

    if (sendMessage(content)) {
        newMessage.value = '';
        scrollToBottom();
    }
}

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
                <!-- System Message -->
                <div
                    v-if="message.type === 'system'"
                    class="text-center text-sm text-gray-500 my-2"
                >
                    <span class="font-medium">{{ message.username }}</span>
                    {{ message.content }}
                </div>

                <!-- Chat Message -->
                <div
                    v-else
                    :class="['flex items-start', message.userId === currentUser.id ? 'flex-row-reverse' : '']"
                >
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
                                {{ formatTimestamp(message.timestamp) }}
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
                @submit.prevent="handleSendMessage"
            >
                <SharedBaseInput
                    v-model="newMessage"
                    type="text"
                    placeholder="Type a message..."
                    :disabled="!isConnected"
                    @keydown.enter.prevent="handleSendMessage"
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
