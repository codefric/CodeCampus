// composables/useWebRTC.ts
interface SignalingMessage {
    type: 'offer' | 'answer' | 'ice-candidate' | 'viewer-connected' | 'viewer-disconnected';
    data: any;
    streamId: string;
    viewerId?: string;
}

const RTC_CONFIG: RTCConfiguration = {
    iceServers: [
        { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
        { urls: ['stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302'] },
    ],
    iceCandidatePoolSize: 10,
    iceTransportPolicy: 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
};

export function useWebRTC(isHost: boolean = false) {
    const peerConnection = ref<RTCPeerConnection | null>(null);
    const socket = ref<WebSocket | null>(null);
    const stream = ref<MediaStream | null>(null);
    const error = ref<string | null>(null);
    const isConnected = ref(false);
    const viewerCount = ref(0);
    const pendingCandidates = ref<RTCIceCandidate[]>([]);
    const currentStreamId = ref<string>('');
    const reconnectAttempts = ref(0);
    const maxReconnectAttempts = 3;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    async function connectToSignalingServer(streamId: string): Promise<void> {
        if (socket.value?.readyState === WebSocket.OPEN) {
            console.log('[WebSocket] Already connected');
            return;
        }

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.hostname}:34567/ws?streamId=${streamId}`;
        console.log('[WebSocket] Connecting to:', wsUrl);

        return new Promise((resolve, reject) => {
            try {
                const ws = new WebSocket(wsUrl);
                socket.value = ws;

                const connectionTimeout = setTimeout(() => {
                    console.log('[WebSocket] Connection timeout');
                    ws.close();
                    reject(new Error('WebSocket connection timeout'));
                }, 10000);

                ws.onopen = () => {
                    clearTimeout(connectionTimeout);
                    console.log('[WebSocket] Connected successfully');
                    isConnected.value = true;
                    reconnectAttempts.value = 0;

                    if (!isHost) {
                        sendSignalingMessage({
                            type: 'viewer-connected',
                            data: null,
                            streamId,
                        });
                    }
                    resolve();
                };

                ws.onmessage = (event) => {
                    try {
                        const message: SignalingMessage = JSON.parse(event.data);
                        console.log('[WebSocket] Received message:', message);
                        handleSignalingMessage(message).catch((err) => {
                            console.error('[WebSocket] Error handling message:', err);
                        });
                    } catch (err) {
                        console.error('[WebSocket] Message parsing error:', err);
                    }
                };

                ws.onerror = (event) => {
                    console.error('[WebSocket] Error:', event);
                    clearTimeout(connectionTimeout);
                    error.value = 'WebSocket connection error';
                    ws.close();
                };

                ws.onclose = (event) => {
                    console.log('[WebSocket] Connection closed:', {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean,
                    });
                    isConnected.value = false;

                    // Clear any existing reconnect timeout
                    if (reconnectTimeout) {
                        clearTimeout(reconnectTimeout);
                        reconnectTimeout = null;
                    }

                    // Attempt reconnection if needed
                    if (reconnectAttempts.value < maxReconnectAttempts) {
                        console.log(`[WebSocket] Attempting to reconnect (${reconnectAttempts.value + 1}/${maxReconnectAttempts})`);
                        reconnectAttempts.value++;

                        reconnectTimeout = setTimeout(() => {
                            connectToSignalingServer(streamId).catch(console.error);
                        }, 2000 * reconnectAttempts.value);
                    } else {
                        error.value = 'Connection lost. Please refresh the page.';
                        cleanup();
                    }
                };
            } catch (err) {
                reject(err);
            }
        });
    }

    function createPeerConnection(): RTCPeerConnection {
        const pc = new RTCPeerConnection(RTC_CONFIG);
        console.log('[WebRTC] Creating peer connection with config:', RTC_CONFIG);

        pc.onicecandidate = ({ candidate }) => {
            if (candidate) {
                console.log('[WebRTC] New ICE candidate:', candidate);
                sendSignalingMessage({
                    type: 'ice-candidate',
                    data: candidate,
                    streamId: currentStreamId.value,
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
            if (pc.iceConnectionState === 'failed') {
                console.log('[WebRTC] ICE connection failed, attempting restart');
                pc.restartIce();
            }
        };

        pc.onconnectionstatechange = () => {
            const state = pc.connectionState;
            console.log('[WebRTC] Connection state changed:', state);

            switch (state) {
                case 'connected':
                    console.log('[WebRTC] Connection established successfully');
                    break;
                case 'disconnected':
                    console.log('[WebRTC] Connection disconnected, attempting to recover');
                    break;
                case 'failed':
                    console.log('[WebRTC] Connection failed');
                    error.value = 'Connection failed. Please try again.';
                    cleanup();
                    break;
                case 'closed':
                    console.log('[WebRTC] Connection closed');
                    break;
            }
        };

        if (!isHost) {
            pc.ontrack = (event) => {
                console.log('[WebRTC] Received track:', {
                    kind: event.track.kind,
                    id: event.track.id,
                    label: event.track.label,
                });

                if (!stream.value) {
                    stream.value = new MediaStream();
                }

                stream.value.addTrack(event.track);
            };
        }

        return pc;
    }

    // Start broadcasting (host only)
    async function startBroadcasting(mediaStream: MediaStream, streamId: string) {
        try {
            currentStreamId.value = streamId;
            const pc = createPeerConnection();
            peerConnection.value = pc;

            // Add all tracks from the media stream
            mediaStream.getTracks().forEach((track) => {
                console.log('[WebRTC] Adding track to peer connection:', track.kind);
                pc.addTrack(track, mediaStream);
            });

            stream.value = mediaStream;

            // Connect to signaling server
            await connectToSignalingServer(streamId);
        } catch (err) {
            console.error('[WebRTC] Broadcasting failed:', err);
            error.value = 'Failed to start broadcasting';
            cleanup();
            throw err;
        }
    }

    async function joinStream(streamId: string) {
        try {
            currentStreamId.value = streamId;
            const pc = createPeerConnection();
            peerConnection.value = pc;

            // Set up transceivers for receiving media
            pc.addTransceiver('video', { direction: 'recvonly' });
            pc.addTransceiver('audio', { direction: 'recvonly' });

            await connectToSignalingServer(streamId);
        } catch (err) {
            console.error('[WebRTC] Failed to join stream:', err);
            error.value = 'Failed to join stream';
            cleanup();
            throw err;
        }
    }

    // Handle incoming signaling messages
    async function handleSignalingMessage(message: SignalingMessage) {
        if (!peerConnection.value) return;

        try {
            switch (message.type) {
                case 'offer':
                    if (!isHost) await handleOffer(message);
                    break;
                case 'answer':
                    if (isHost) await handleAnswer(message);
                    break;
                case 'ice-candidate':
                    await handleIceCandidate(message);
                    break;
                case 'viewer-connected':
                    if (isHost) await handleViewerConnected(message);
                    break;
                case 'viewer-disconnected':
                    if (isHost) viewerCount.value = Math.max(0, viewerCount.value - 1);
                    break;
            }
        } catch (err) {
            console.error('[WebRTC] Error handling message:', err);
            error.value = 'Connection error';
        }
    }

    async function handleOffer(message: SignalingMessage) {
        const pc = peerConnection.value;
        if (!pc) return;

        try {
            console.log('[WebRTC] Handling offer, current signaling state:', pc.signalingState);

            // If we're not in stable state, we need to handle rollback
            if (pc.signalingState !== 'stable') {
                console.log('[WebRTC] Signaling state not stable, rolling back');
                await Promise.all([
                    pc.setLocalDescription({ type: 'rollback' }),
                    pc.setRemoteDescription(new RTCSessionDescription(message.data)),
                ]);
            } else {
                await pc.setRemoteDescription(new RTCSessionDescription(message.data));
            }

            console.log('[WebRTC] Creating answer');
            const answer = await pc.createAnswer();
            console.log('[WebRTC] Setting local description');
            await pc.setLocalDescription(answer);

            sendSignalingMessage({
                type: 'answer',
                data: answer,
                streamId: message.streamId,
                viewerId: message.viewerId,
            });

            await processPendingCandidates();
        } catch (err) {
            console.error('[WebRTC] Error handling offer:', err);
            throw err;
        }
    }

    async function handleAnswer(message: SignalingMessage) {
        const pc = peerConnection.value;
        if (!pc) return;

        try {
            const answer = new RTCSessionDescription(message.data);
            await pc.setRemoteDescription(answer);
            await processPendingCandidates();
        } catch (err) {
            console.error('[WebRTC] Error handling answer:', err);
            throw err;
        }
    }

    async function handleIceCandidate(message: SignalingMessage) {
        const pc = peerConnection.value;
        if (!pc) return;

        try {
            const candidate = new RTCIceCandidate(message.data);
            if (pc.remoteDescription) {
                await pc.addIceCandidate(candidate);
            } else {
                pendingCandidates.value.push(candidate);
            }
        } catch (err) {
            console.error('[WebRTC] Error handling ICE candidate:', err);
            throw err;
        }
    }

    async function handleViewerConnected(message: SignalingMessage) {
        if (!peerConnection.value) return;

        viewerCount.value++;
        console.log('[WebRTC] Viewer connected, creating offer');

        try {
            // Only create offer if we're the host and have a stream
            if (isHost && stream.value) {
                // Wait for signaling state to be stable
                if (peerConnection.value.signalingState !== 'stable') {
                    console.log('[WebRTC] Waiting for signaling state to stabilize');
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }

                console.log('[WebRTC] Creating offer, current signaling state:', peerConnection.value.signalingState);

                const offer = await peerConnection.value.createOffer({
                    offerToReceiveAudio: false,
                    offerToReceiveVideo: false,
                });

                await peerConnection.value.setLocalDescription(offer);

                sendSignalingMessage({
                    type: 'offer',
                    data: offer,
                    streamId: message.streamId,
                    viewerId: message.viewerId,
                });
            }
        } catch (err) {
            console.error('[WebRTC] Error creating offer:', err);
            error.value = 'Failed to create offer';
        }
    }

    async function processPendingCandidates() {
        const pc = peerConnection.value;
        if (!pc?.remoteDescription) return;

        while (pendingCandidates.value.length > 0) {
            const candidate = pendingCandidates.value.shift();
            if (candidate) {
                try {
                    await pc.addIceCandidate(candidate);
                } catch (err) {
                    console.error('[WebRTC] Error adding ICE candidate:', err);
                }
            }
        }
    }

    function sendSignalingMessage(message: SignalingMessage) {
        if (socket.value?.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(message));
        }
    }

    function cleanup() {
        console.log('[WebRTC] Cleaning up resources');

        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }

        if (peerConnection.value) {
            peerConnection.value.close();
            peerConnection.value = null;
        }

        if (socket.value) {
            if (socket.value.readyState === WebSocket.OPEN) {
                socket.value.close();
            }
            socket.value = null;
        }

        if (stream.value && isHost) {
            stream.value.getTracks().forEach((track) => {
                track.stop();
                console.log('[WebRTC] Stopped track:', track.kind);
            });
            stream.value = null;
        }

        isConnected.value = false;
        pendingCandidates.value = [];
        error.value = null;
        currentStreamId.value = '';
        reconnectAttempts.value = 0;
    }

    onUnmounted(() => {
        cleanup();
    });

    return {
        startBroadcasting,
        joinStream,
        cleanup,
        isConnected,
        error,
        viewerCount,
        stream,
    };
}
