<!-- components/StreamViewer.vue -->
<script setup lang="ts">
const props = defineProps<{
    streamId: string;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
const status = ref<'connecting' | 'connected' | 'error'>('connecting');
const connectionError = ref<string | null>(null);
const isMuted = ref(true);

const { joinStream, cleanup, isConnected, error, viewerCount, stream } = useWebRTC(false);

// Track states for debugging
const debugState = reactive({
    lastStreamUpdate: null as any,
    lastError: null as any,
    connectionAttempts: 0,
    videoAttachAttempts: 0,
});

onMounted(async () => {
    console.log('[StreamViewer] Mounting with streamId:', props.streamId);
    try {
        debugState.connectionAttempts++;
        await joinStream(props.streamId);
        console.log('[StreamViewer] Successfully joined stream');
    } catch (err) {
        console.error('[StreamViewer] Error joining stream:', err);
        connectionError.value = err instanceof Error ? err.message : 'Failed to join stream';
        status.value = 'error';
        debugState.lastError = err;
    }
});

// Watch for stream changes with enhanced error handling
watch(
    () => stream.value,
    (newStream, oldStream) => {
        debugState.lastStreamUpdate = {
            hasStream: !!newStream,
            trackCount: newStream?.getTracks().length || 0,
            tracks: newStream?.getTracks().map((t) => ({
                kind: t.kind,
                enabled: t.enabled,
                muted: t.muted,
                readyState: t.readyState,
            })),
        };
        console.log('[StreamViewer] Stream changed:', debugState.lastStreamUpdate);

        if (oldStream) {
            console.log('[StreamViewer] Cleaning up old stream');
            oldStream.getTracks().forEach((track) => track.stop());
        }

        if (newStream && videoRef.value) {
            console.log('[StreamViewer] Attaching new stream to video element');
            debugState.videoAttachAttempts++;

            // Ensure video element is ready
            if (videoRef.value.srcObject) {
                const oldStream = videoRef.value.srcObject as MediaStream;
                oldStream.getTracks().forEach((track) => track.stop());
                videoRef.value.srcObject = null;
            }

            // Attach new stream
            videoRef.value.srcObject = newStream;
            status.value = 'connected';

            // Attempt playback
            videoRef.value.play().catch((err) => {
                console.error('[StreamViewer] Error playing video:', err);
                if (err.name === 'NotAllowedError') {
                    console.log('[StreamViewer] Autoplay prevented, trying muted playback');
                    isMuted.value = true;
                    videoRef.value!.muted = true;
                    return videoRef.value!.play();
                }
                connectionError.value = 'Failed to play video stream';
                status.value = 'error';
                debugState.lastError = err;
            });
        }
    },
    { immediate: true, deep: true }
);

// Watch for connection status
watch(
    () => isConnected.value,
    (connected) => {
        console.log('[StreamViewer] Connection status changed:', connected);
    }
);

// Watch for errors with enhanced debugging
watch(
    () => error.value,
    (newError) => {
        if (newError) {
            console.error('[StreamViewer] Error occurred:', newError);
            connectionError.value = newError;
            status.value = 'error';
            debugState.lastError = newError;
        }
    }
);

// Enhanced audio toggle with error handling
const toggleAudio = async () => {
    if (!videoRef.value) {
        console.error('[StreamViewer] No video element available');
        return;
    }

    if (!videoRef.value.srcObject) {
        console.error('[StreamViewer] No stream attached to video element');
        return;
    }

    try {
        isMuted.value = !isMuted.value;
        videoRef.value.muted = isMuted.value;

        if (!isMuted.value) {
            await videoRef.value.play();
            console.log('[StreamViewer] Successfully unmuted and playing');
        }
    } catch (err) {
        console.error('[StreamViewer] Error toggling audio:', err);
        isMuted.value = true;
        videoRef.value.muted = true;
        debugState.lastError = err;
    }
};

// Debug helper
const getDebugInfo = () => {
    return {
        status: status.value,
        isConnected: isConnected.value,
        hasVideo: !!videoRef.value,
        hasStream: !!stream.value,
        streamTracks: stream.value?.getTracks().length || 0,
        videoMuted: videoRef.value?.muted,
        videoPlaying: !videoRef.value?.paused,
        debugState,
    };
};

// Make debug info available in Vue DevTools
defineExpose({
    getDebugInfo,
});

onBeforeUnmount(() => {
    console.log('[StreamViewer] Unmounting, final state:', getDebugInfo());
    cleanup();
});
</script>

<template>
    <div class="relative w-full">
        <!-- Loading State -->
        <div
            v-if="status === 'connecting'"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-10"
        >
            <p>Connecting to stream...</p>
        </div>

        <!-- Error State -->
        <div
            v-if="status === 'error'"
            class="mb-4 p-4 rounded-lg bg-red-50 border border-red-200"
        >
            <h3 class="text-red-800 font-medium">Stream Error</h3>
            <p class="text-red-700">
                {{ connectionError || 'Could not connect to stream. Please try refreshing the page.' }}
            </p>
        </div>

        <!-- Video Player -->
        <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
                ref="videoRef"
                class="w-full h-full"
                autoplay
                playsinline
                :muted="isMuted"
            />

            <!-- Audio Controls -->
            <div class="absolute bottom-4 right-4">
                <button
                    class="bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                    @click="toggleAudio"
                >
                    <span class="sr-only">{{ isMuted ? 'Unmute' : 'Mute' }}</span>
                    <div class="w-6 h-6">
                        {{ isMuted ? '🔇' : '🔊' }}
                    </div>
                </button>
            </div>
        </div>

        <!-- Stream Info -->
        <div
            v-if="isConnected"
            class="mt-2 flex items-center gap-2"
        >
            <div class="flex items-center">
                <span class="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />
                <span class="font-medium">Live</span>
            </div>
            <span
                v-if="viewerCount > 0"
                class="text-sm text-gray-600"
            >
                {{ viewerCount }} watching
            </span>
        </div>
    </div>
</template>
