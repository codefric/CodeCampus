# components/StreamBroadcaster.vue
<script setup lang="ts">
const localVideoRef = ref<HTMLVideoElement | null>(null);
const isCameraActive = ref(false);
const isScreenSharing = ref(false);
const isLive = ref(false);
const localStream = ref<MediaStream | null>(null);
const streamError = ref<string | null>(null);

const { startBroadcasting, cleanup, isConnected, viewerCount } = useWebRTC(true);

const streamId = ref(generateStreamId());
const debugState = reactive({
    lastMediaStream: null as any,
    lastError: null as any,
    mediaStreamAttempts: 0,
});

const streamUrl = computed(() => {
    if (!isLive.value) return '';
    return `${window.location.origin}/watch/${streamId.value}`;
});

function generateStreamId() {
    return Math.random().toString(36).substring(2, 15);
}

async function toggleCamera() {
    try {
        if (isCameraActive.value) {
            stopMediaStream();
            isCameraActive.value = false;
        } else {
            debugState.mediaStreamAttempts++;
            console.log('[Broadcaster] Requesting camera access');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 },
                },
                audio: true,
            });

            console.log('[Broadcaster] Camera access granted:', {
                tracks: stream.getTracks().map((t) => ({
                    kind: t.kind,
                    enabled: t.enabled,
                    muted: t.muted,
                    settings: t.getSettings(),
                })),
            });

            startMediaStream(stream);
            isCameraActive.value = true;
            isScreenSharing.value = false;
            streamError.value = null;
        }
    } catch (error) {
        console.error('[Broadcaster] Camera access error:', error);
        streamError.value = 'Error accessing camera. Please check permissions.';
        debugState.lastError = error;
    }
}

async function toggleScreenShare() {
    try {
        if (isScreenSharing.value) {
            stopMediaStream();
            isScreenSharing.value = false;
        } else {
            debugState.mediaStreamAttempts++;
            console.log('[Broadcaster] Requesting screen share');

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 30 },
                },
                audio: true,
            });

            console.log('[Broadcaster] Screen share granted:', {
                tracks: stream.getTracks().map((t) => ({
                    kind: t.kind,
                    enabled: t.enabled,
                    muted: t.muted,
                    settings: t.getSettings(),
                })),
            });

            startMediaStream(stream);
            isScreenSharing.value = true;
            isCameraActive.value = false;
            streamError.value = null;
        }
    } catch (error) {
        console.error('[Broadcaster] Screen share error:', error);
        streamError.value = 'Error sharing screen. Please try again.';
        debugState.lastError = error;
    }
}

function startMediaStream(stream: MediaStream) {
    console.log('[Broadcaster] Starting media stream:', {
        tracks: stream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            muted: t.muted,
        })),
    });

    debugState.lastMediaStream = {
        id: stream.id,
        tracks: stream.getTracks().map((t) => ({
            kind: t.kind,
            enabled: t.enabled,
            muted: t.muted,
            settings: t.getSettings(),
        })),
    };

    if (localVideoRef.value) {
        localVideoRef.value.srcObject = stream;
        localStream.value = stream;

        // Monitor track endings
        stream.getTracks().forEach((track) => {
            track.onended = () => {
                console.log('[Broadcaster] Track ended:', track.kind);
                if (isLive.value) {
                    stopBroadcast();
                }
            };
        });
    }
}

function stopMediaStream() {
    console.log('[Broadcaster] Stopping media stream');
    if (localStream.value) {
        localStream.value.getTracks().forEach((track) => {
            track.stop();
            console.log('[Broadcaster] Stopped track:', track.kind);
        });
        localStream.value = null;
    }
    if (localVideoRef.value) {
        localVideoRef.value.srcObject = null;
    }
}

async function startBroadcast() {
    if (!localStream.value) {
        streamError.value = 'Please start your camera or screen share first.';
        return;
    }

    try {
        console.log('[Broadcaster] Starting broadcast with stream:', {
            id: localStream.value.id,
            tracks: localStream.value.getTracks().map((t) => ({
                kind: t.kind,
                enabled: t.enabled,
                muted: t.muted,
                settings: t.getSettings(),
            })),
        });

        await startBroadcasting(localStream.value, streamId.value);
        isLive.value = true;
        streamError.value = null;
    } catch (err) {
        console.error('[Broadcaster] Broadcast error:', err);
        streamError.value = 'Failed to start broadcast. Please try again.';
        debugState.lastError = err;
        isLive.value = false;
    }
}

function toggleStream() {
    if (!localStream.value) {
        streamError.value = 'Please start your camera or screen share first.';
        return;
    }

    if (isLive.value) {
        stopBroadcast();
    } else {
        startBroadcast();
    }
}

function stopBroadcast() {
    console.log('[Broadcaster] Stopping broadcast');
    cleanup();
    isLive.value = false;
}

function copyStreamUrl() {
    navigator.clipboard
        .writeText(streamUrl.value)
        .then(() => {
            console.log('[Broadcaster] Stream URL copied:', streamUrl.value);
        })
        .catch((err) => {
            console.error('[Broadcaster] Error copying URL:', err);
            streamError.value = 'Failed to copy stream URL';
        });
}

// Debug helper
const getDebugInfo = () => {
    return {
        isLive: isLive.value,
        isConnected: isConnected.value,
        viewerCount: viewerCount.value,
        hasLocalStream: !!localStream.value,
        streamTracks: localStream.value?.getTracks().length || 0,
        debugState,
    };
};

// Make debug info available in Vue DevTools
defineExpose({
    getDebugInfo,
});

onBeforeUnmount(() => {
    console.log('[Broadcaster] Unmounting, final state:', getDebugInfo());
    stopMediaStream();
    if (isLive.value) {
        stopBroadcast();
    }
});
</script>

<template>
    <div class="container mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Streaming Section -->
            <div class="lg:col-span-2">
                <div class="space-y-4">
                    <!-- Preview -->
                    <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            ref="localVideoRef"
                            class="w-full h-full"
                            autoplay
                            muted
                            playsinline
                        />
                    </div>

                    <!-- Error Message -->
                    <div
                        v-if="streamError"
                        class="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200"
                    >
                        {{ streamError }}
                    </div>

                    <!-- Controls -->
                    <div class="flex flex-wrap gap-4">
                        <SharedBaseButton
                            state="semi-filled"
                            :disabled="isLive"
                            @click="toggleCamera"
                        >
                            {{ isCameraActive ? 'Stop Camera' : 'Start Camera' }}
                        </SharedBaseButton>

                        <SharedBaseButton
                            state="semi-filled"
                            :disabled="isLive"
                            @click="toggleScreenShare"
                        >
                            {{ isScreenSharing ? 'Stop Sharing' : 'Share Screen' }}
                        </SharedBaseButton>

                        <SharedBaseButton
                            state="semi-filled"
                            :disabled="!localStream"
                            @click="toggleStream"
                        >
                            {{ isLive ? 'End Stream' : 'Go Live' }}
                        </SharedBaseButton>
                    </div>

                    <!-- Stream Info -->
                    <div
                        v-if="isLive"
                        class="p-4 bg-green-100 rounded-lg"
                    >
                        <p class="font-medium">🔴 Live</p>
                        <p class="text-sm">Share this link with viewers:</p>
                        <div class="flex items-center gap-2 mt-1">
                            <SharedBaseInput
                                v-model="streamUrl"
                                type="text"
                                readonly
                            />
                            <SharedBaseButton
                                state="semi-filled"
                                @click="copyStreamUrl"
                            >
                                Copy
                            </SharedBaseButton>
                            <SharedBaseChip :label="`Connected: ${isConnected}`" />
                            <SharedBaseChip :label="`Viewers: ${viewerCount}`" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chat Section -->
            <div class="lg:col-span-1">
                <SharedChatBox :stream-id="streamId" />
            </div>
        </div>
    </div>
</template>
