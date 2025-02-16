<!-- # pages/watch/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const streamId = route.params.id as string;
</script>

<template>
    <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Streaming Section -->
            <div class="lg:col-span-2">
                <StreamViewer :stream-id="streamId" />
            </div>

            <!-- Chat Section -->
            <div class="lg:col-span-1">
                <SharedChatBox :stream-id="streamId" />
            </div>
        </div>
    </div>
</template>
