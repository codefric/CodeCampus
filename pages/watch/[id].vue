<script setup lang="ts">
const route = useRoute();
const streamId = route.params.id as string;
const remoteVideoRef = ref<HTMLVideoElement | null>(null);

const { joinStream, cleanup, isConnected, error, viewerCount, stream } = useWebRTC(false);

onMounted(async () => {
    try {
        await joinStream(streamId);
    } catch (err) {
        console.error('Error joining stream:', err);
    }
});

onBeforeUnmount(() => {
    cleanup();
});

watch(stream, (newStream) => {
    if (newStream && remoteVideoRef.value) {
        remoteVideoRef.value.srcObject = newStream;
    }
});

watch(
    () => error.value,
    (err) => {
        if (err) console.log(err);
    }
);
</script>

<template>
    <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Streaming Section -->
            <div class="lg:col-span-2">
                <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                        ref="remoteVideoRef"
                        class="w-full h-full"
                        autoplay
                        playsinline
                    />
                </div>
                <div class="mt-4 flex items-center gap-2">
                    <div class="flex items-center">
                        <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />
                        <span class="font-medium">Live</span>
                    </div>
                    <SharedBaseChip
                        :label="viewerCount + ' watching'"
                        :color="isConnected ? 'success' : 'default'"
                    />
                </div>
            </div>

            <!-- Chat Section -->
            <div class="lg:col-span-1">
                <SharedChatBox />
            </div>
        </div>
    </div>
</template>
