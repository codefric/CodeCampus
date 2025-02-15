// composables/useWebRTC.ts
interface SignalingMessage {
    type: 'offer' | 'answer' | 'ice-candidate' | 'viewer-connected' | 'viewer-disconnected';
    data: any;
    streamId: string;
    viewerId?: string;
}

export function useWebRTC(isHost: boolean = false) {
    const peerConnection = ref<RTCPeerConnection | null>(null);
    const socket = ref<WebSocket | null>(null);
    const stream = ref<MediaStream | null>(null);
    const error = ref<string | null>(null);
    const isConnected = ref(false);
    const viewerCount = ref(0);
    const pendingCandidates = ref<RTCIceCandidate[]>([]);

    // WebSocket Signaling Setup
    function connectSignaling(streamId: string) {
        const wsUrl = `${import.meta.env.VITE_WS_URL}/rtc/${streamId}`;
        socket.value = new WebSocket(wsUrl);

        socket.value.onopen = () => {
            console.log('Connected to signaling server');
            isConnected.value = true;
            if (!isHost) {
                sendSignalingMessage({
                    type: 'viewer-connected',
                    data: null,
                    streamId,
                });
            }
        };

        socket.value.onmessage = async (event) => {
            const message: SignalingMessage = JSON.parse(event.data);
            handleSignalingMessage(message);
        };

        socket.value.onerror = (err) => {
            console.error('WebSocket error:', err);
            error.value = 'Connection error';
        };

        socket.value.onclose = () => {
            console.log('WebSocket connection closed');
            isConnected.value = false;
            cleanup();
        };
    }

    // Initialize WebRTC Connection
    function initializePeerConnection() {
        if (peerConnection.value) {
            peerConnection.value.close();
        }

        const configuration: RTCConfiguration = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
            iceCandidatePoolSize: 10,
        };

        peerConnection.value = new RTCPeerConnection(configuration);

        // ICE Candidate handling
        peerConnection.value.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignalingMessage({
                    type: 'ice-candidate',
                    data: event.candidate,
                    streamId: stream.value?.id || '',
                });
            }
        };

        peerConnection.value.oniceconnectionstatechange = () => {
            console.log('ICE Connection State:', peerConnection.value?.iceConnectionState);
        };

        peerConnection.value.onconnectionstatechange = () => {
            console.log('Connection state:', peerConnection.value?.connectionState);
            if (peerConnection.value?.connectionState === 'failed') {
                error.value = 'Connection failed';
                cleanup();
            }
        };

        // Track handling for viewers
        if (!isHost) {
            peerConnection.value.ontrack = (event) => {
                console.log('Received remote track:', event.streams[0]);
                stream.value = event.streams[0];
            };
        }

        return peerConnection.value;
    }

    // Start Broadcasting
    async function startBroadcasting(mediaStream: MediaStream, streamId: string) {
        try {
            if (!peerConnection.value) {
                initializePeerConnection();
            }

            stream.value = mediaStream;
            mediaStream.getTracks().forEach((track) => {
                if (peerConnection.value && stream.value) {
                    peerConnection.value.addTrack(track, stream.value);
                }
            });

            connectSignaling(streamId);
        } catch (err) {
            console.error('Error starting broadcast:', err);
            error.value = 'Failed to start broadcasting';
        }
    }

    // Join Stream as Viewer
    async function joinStream(streamId: string) {
        try {
            if (!peerConnection.value) {
                initializePeerConnection();
            }
            connectSignaling(streamId);
        } catch (err) {
            console.error('Error joining stream:', err);
            error.value = 'Failed to join stream';
        }
    }

    async function addPendingCandidates() {
        if (peerConnection.value?.remoteDescription) {
            while (pendingCandidates.value.length > 0) {
                const candidate = pendingCandidates.value.shift();
                if (candidate) {
                    try {
                        await peerConnection.value.addIceCandidate(candidate);
                    } catch (err) {
                        console.error('Error adding pending candidate:', err);
                    }
                }
            }
        }
    }

    // Handle incoming signaling messages
    async function handleSignalingMessage(message: SignalingMessage) {
        try {
            switch (message.type) {
                case 'offer':
                    if (!isHost && peerConnection.value) {
                        console.log('Received offer, setting remote description');
                        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(message.data));
                        console.log('Creating answer');
                        const answer = await peerConnection.value.createAnswer();
                        console.log('Setting local description');
                        await peerConnection.value.setLocalDescription(answer);
                        console.log('Sending answer');
                        sendSignalingMessage({
                            type: 'answer',
                            data: answer,
                            streamId: message.streamId,
                            viewerId: message.viewerId,
                        });
                        await addPendingCandidates();
                    }
                    break;

                case 'answer':
                    if (isHost && peerConnection.value && peerConnection.value.localDescription) {
                        console.log('Received answer, setting remote description');
                        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(message.data));
                        await addPendingCandidates();
                    }
                    break;

                case 'ice-candidate':
                    if (peerConnection.value?.remoteDescription) {
                        await peerConnection.value.addIceCandidate(new RTCIceCandidate(message.data));
                    } else {
                        pendingCandidates.value.push(new RTCIceCandidate(message.data));
                    }
                    break;

                case 'viewer-connected':
                    if (isHost) {
                        viewerCount.value++;
                        console.log('Creating offer for new viewer');
                        const offer = await peerConnection.value?.createOffer({
                            offerToReceiveAudio: true,
                            offerToReceiveVideo: true,
                        });
                        if (offer && peerConnection.value) {
                            console.log('Setting local description');
                            await peerConnection.value.setLocalDescription(offer);
                            console.log('Sending offer');
                            sendSignalingMessage({
                                type: 'offer',
                                data: offer,
                                streamId: message.streamId,
                                viewerId: message.viewerId,
                            });
                        }
                    }
                    break;

                case 'viewer-disconnected':
                    if (isHost) {
                        viewerCount.value = Math.max(0, viewerCount.value - 1);
                    }
                    break;
            }
        } catch (err) {
            console.error('Error handling signaling message:', err);
            error.value = 'Connection error';
        }
    }

    // Send signaling message
    function sendSignalingMessage(message: SignalingMessage) {
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(message));
        }
    }

    // Cleanup function
    function cleanup() {
        if (peerConnection.value) {
            peerConnection.value.close();
            peerConnection.value = null;
        }
        if (socket.value) {
            socket.value.close();
            socket.value = null;
        }
        if (stream.value) {
            stream.value.getTracks().forEach((track) => track.stop());
            stream.value = null;
        }
        isConnected.value = false;
        pendingCandidates.value = [];
    }

    // Cleanup on component unmount
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
