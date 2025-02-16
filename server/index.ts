import express from 'express';
import { createServer } from 'http';
import { parse as parseUrl } from 'url';
import { WebSocket, WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Define message types for better type safety
type MessageType = 'offer' | 'answer' | 'ice-candidate' | 'viewer-connected' | 'viewer-disconnected';

interface SignalingMessage {
    type: MessageType;
    data?: any;
    streamId: string;
    viewerId?: string;
}

interface StreamRoom {
    host: WebSocket | null;
    viewers: Map<string, WebSocket>;
    createdAt: number;
}

const streams = new Map<string, StreamRoom>();

// Cleanup inactive streams periodically
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const STREAM_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function cleanupInactiveStreams() {
    const now = Date.now();
    for (const [streamId, room] of streams.entries()) {
        if (now - room.createdAt > STREAM_TIMEOUT) {
            console.log(`Cleaning up inactive stream ${streamId}`);

            // Close all viewer connections
            room.viewers.forEach((viewer) => {
                if (viewer.readyState === WebSocket.OPEN) {
                    viewer.close(1000, 'Stream timeout');
                }
            });

            // Close host connection
            if (room.host?.readyState === WebSocket.OPEN) {
                room.host.close(1000, 'Stream timeout');
            }

            streams.delete(streamId);
        }
    }
}

setInterval(cleanupInactiveStreams, CLEANUP_INTERVAL);

// Helper function to safely send WebSocket messages
function safeSend(ws: WebSocket, message: SignalingMessage) {
    if (ws.readyState === WebSocket.OPEN) {
        try {
            ws.send(JSON.stringify(message));
        } catch (err) {
            console.error('Error sending message:', err);
        }
    }
}

wss.on('connection', (ws: WebSocket, req: any) => {
    // Parse URL and extract streamId
    const urlParts = parseUrl(req.url);
    const pathParts = urlParts.pathname?.split('/') || [];
    const streamId = pathParts[pathParts.length - 1];
    console.log({ streamId });

    if (!streamId) {
        console.error('No stream ID provided');
        ws.close(1002, 'No stream ID provided');
        return;
    }

    const viewerId = Math.random().toString(36).substring(2, 15);

    // Initialize stream room if it doesn't exist
    if (!streams.has(streamId)) {
        streams.set(streamId, {
            host: null,
            viewers: new Map(),
            createdAt: Date.now(),
        });
    }

    const room = streams.get(streamId)!;

    // Set up ping-pong to detect disconnections
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

    // First connection becomes the host
    if (!room.host) {
        room.host = ws;
        console.log(`Host connected for stream ${streamId}`);

        ws.on('message', (message: string) => {
            try {
                const parsedMessage = JSON.parse(message) as SignalingMessage;

                // Validate message format
                if (!parsedMessage.type || !parsedMessage.streamId) {
                    console.error('Invalid message format:', parsedMessage);
                    return;
                }

                // Handle messages based on target
                if (parsedMessage.viewerId) {
                    // Message for specific viewer
                    const viewer = room.viewers.get(parsedMessage.viewerId);
                    if (viewer) {
                        safeSend(viewer, parsedMessage);
                    }
                } else {
                    // Broadcast to all viewers
                    room.viewers.forEach((viewer) => {
                        safeSend(viewer, parsedMessage);
                    });
                }
            } catch (err) {
                console.error('Error handling host message:', err);
            }
        });

        ws.on('close', () => {
            console.log(`Host disconnected from stream ${streamId}`);
            clearInterval(pingInterval);

            // Notify and close viewer connections
            room.viewers.forEach((viewer) => {
                safeSend(viewer, {
                    type: 'viewer-disconnected',
                    streamId,
                    data: { reason: 'Host disconnected' },
                });
                viewer.close(1000, 'Host disconnected');
            });

            streams.delete(streamId);
        });

        ws.on('error', (error) => {
            console.error(`Host error for stream ${streamId}:`, error);
        });
    } else {
        // Handle viewer connection
        room.viewers.set(viewerId, ws);
        console.log(`Viewer ${viewerId} connected to stream ${streamId}`);

        // Notify host of new viewer
        if (room.host) {
            safeSend(room.host, {
                type: 'viewer-connected',
                viewerId,
                streamId,
            });
        }

        ws.on('message', (message: string) => {
            try {
                const parsedMessage = JSON.parse(message) as SignalingMessage;

                // Forward message to host with viewer ID
                if (room.host) {
                    safeSend(room.host, {
                        ...parsedMessage,
                        viewerId,
                        streamId,
                    });
                }
            } catch (err) {
                console.error('Error handling viewer message:', err);
            }
        });

        ws.on('close', () => {
            console.log(`Viewer ${viewerId} disconnected from stream ${streamId}`);
            clearInterval(pingInterval);
            room.viewers.delete(viewerId);

            // Notify host of viewer disconnection
            if (room.host) {
                safeSend(room.host, {
                    type: 'viewer-disconnected',
                    viewerId,
                    streamId,
                });
            }
        });

        ws.on('error', (error) => {
            console.error(`Viewer ${viewerId} error for stream ${streamId}:`, error);
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        activeStreams: streams.size,
        totalViewers: Array.from(streams.values()).reduce((total, room) => total + room.viewers.size, 0),
    });
});

const PORT = process.env.PORT || 34567;
server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');

    // Close all WebSocket connections
    wss.clients.forEach((client) => {
        client.close(1000, 'Server shutting down');
    });

    // Close HTTP server
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
