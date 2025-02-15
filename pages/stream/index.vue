<script lang="ts" setup>
const localVideoRef = ref<HTMLVideoElement | null>(null);
const isCameraActive = ref(false);
const isScreenSharing = ref(false);
const isLive = ref(false);
const localStream = ref<MediaStream | null>(null);

const { startBroadcasting, cleanup, isConnected, error, viewerCount } = useWebRTC(true);

const streamUrl = computed(() => {
    if (!isLive.value) return '';
    // Replace with your actual domain
    return `${window.location.origin}/watch/${streamId.value}`;
});

const streamId = ref(generateStreamId());

function generateStreamId() {
    return Math.random().toString(36).substring(2, 15);
}

async function toggleCamera() {
    try {
        if (isCameraActive.value) {
            stopMediaStream();
            isCameraActive.value = false;
        } else {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            startMediaStream(stream);
            isCameraActive.value = true;
            isScreenSharing.value = false;
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Error accessing camera. Please check permissions.');
    }
}

async function toggleScreenShare() {
    try {
        if (isScreenSharing.value) {
            stopMediaStream();
            isScreenSharing.value = false;
        } else {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            startMediaStream(stream);
            isScreenSharing.value = true;
            isCameraActive.value = false;
        }
    } catch (error) {
        console.error('Error sharing screen:', error);
        alert('Error sharing screen. Please try again.');
    }
}

function startMediaStream(stream: MediaStream) {
    if (localVideoRef.value) {
        localVideoRef.value.srcObject = stream;
        localStream.value = stream;
    }
}

function stopMediaStream() {
    if (localStream.value) {
        localStream.value.getTracks().forEach((track) => track.stop());
        localStream.value = null;
    }
    if (localVideoRef.value) {
        localVideoRef.value.srcObject = null;
    }
}

function toggleStream() {
    if (!localStream.value) {
        alert('Please start your camera or screen share first.');
        return;
    }

    isLive.value = !isLive.value;
    if (isLive.value) {
        startBroadcast();
    } else {
        stopBroadcast();
    }
}

async function startBroadcast() {
    if (!localStream.value) {
        alert('Please start your camera or screen share first.');
        return;
    }

    try {
        await startBroadcasting(localStream.value, streamId.value);
        isLive.value = true;
    } catch (err) {
        console.error('Error starting broadcast:', err);
        alert('Failed to start broadcast. Please try again.');
    }
}

function stopBroadcast() {
    cleanup();
    isLive.value = false;
}

function copyStreamUrl() {
    navigator.clipboard
        .writeText(streamUrl.value)
        .then(() => alert('Stream URL copied to clipboard!'))
        .catch((err) => console.error('Error copying URL:', err));
}

// Clean up on component unmount
onBeforeUnmount(() => {
    stopMediaStream();
    if (isLive.value) {
        stopBroadcast();
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

                    <!-- Controls -->
                    <div class="flex flex-wrap gap-4">
                        <SharedBaseButton
                            state="semi-filled"
                            @click="toggleCamera"
                        >
                            {{ isCameraActive ? 'Stop Camera' : 'Start Camera' }}
                        </SharedBaseButton>

                        <SharedBaseButton
                            state="semi-filled"
                            @click="toggleScreenShare"
                        >
                            {{ isScreenSharing ? 'Stop Sharing' : 'Share Screen' }}
                        </SharedBaseButton>

                        <SharedBaseButton
                            state="semi-filled"
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
                            <SharedBaseChip :label="`${isConnected}`" />
                            <SharedBaseChip :label="`${viewerCount}`" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chat Section -->
            <div class="lg:col-span-1">
                <SharedChatBox />
            </div>
        </div>
    </div>
</template>
