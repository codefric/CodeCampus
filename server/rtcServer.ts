// server/rtcServer.ts
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import type { SignalingMessage, StreamRoom } from './types';
import { config } from './utils/config';
import { logger } from './utils/logger';

export class RTCServer {
    private streams = new Map<string, StreamRoom>();
    private wss: WebSocketServer;
    private cleanupInterval!: NodeJS.Timeout; // Using definite assignment assertion

    constructor(server: ReturnType<typeof createServer>) {
        this.wss = new WebSocketServer({ server, path: '/ws' });
        this.initialize();
    }

    private initialize() {
        this.setupWebSocketServer();
        this.startCleanupInterval();
    }

    private setupWebSocketServer() {
        this.wss.on('connection', (ws: WebSocket, req: any) => {
            try {
                // Fix URL parsing
                const fullUrl = new URL(req.url, 'ws://localhost');
                const streamId = fullUrl.searchParams.get('streamId') || fullUrl.pathname.split('/').pop();

                if (!streamId) {
                    logger.error('No stream ID provided');
                    ws.close(1002, 'No stream ID provided');
                    return;
                }

                // Remove any 'ws' prefix from streamId if present
                const cleanStreamId = streamId.replace(/^ws\??/, '');

                logger.info('New WebSocket connection attempt', {
                    streamId: cleanStreamId,
                    url: req.url,
                    headers: req.headers,
                });

                const viewerId = Math.random().toString(36).substring(2, 15);
                this.initializeStreamRoom(cleanStreamId, ws, viewerId);
            } catch (err) {
                logger.error('Error in WebSocket connection setup:', err as Error);
                ws.close(1011, 'Internal server error');
            }
        });
    }

    private initializeStreamRoom(streamId: string, ws: WebSocket, viewerId: string) {
        if (!this.streams.has(streamId)) {
            this.streams.set(streamId, {
                host: null,
                viewers: new Map(),
                createdAt: Date.now(),
            });
            logger.debug('Created new stream room', { streamId });
        }

        const room = this.streams.get(streamId)!;
        const pingInterval = this.setupPingPong(ws);

        // Set up error handler first
        ws.on('error', (error) => {
            logger.error(`WebSocket error for stream ${streamId}:`, error as Error);
        });

        if (!room.host) {
            this.handleHostConnection(ws, room, streamId, pingInterval);
        } else {
            this.handleViewerConnection(ws, room, streamId, viewerId, pingInterval);
        }
    }

    private setupPingPong(ws: WebSocket) {
        return setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.ping();
            }
        }, config.webrtc.ping.interval);
    }

    private handleHostConnection(ws: WebSocket, room: StreamRoom, streamId: string, pingInterval: NodeJS.Timeout) {
        room.host = ws;
        logger.info(`Host connected for stream ${streamId}`);

        ws.on('message', (message: string) => {
            try {
                const parsedMessage = JSON.parse(message) as SignalingMessage;

                if (!parsedMessage.type || !parsedMessage.streamId) {
                    logger.error('Invalid message format:', { message: parsedMessage } as any);
                    return;
                }

                logger.debug('Host message received', {
                    type: parsedMessage.type,
                    streamId,
                    hasViewerId: !!parsedMessage.viewerId,
                });

                if (parsedMessage.viewerId) {
                    const viewer = room.viewers.get(parsedMessage.viewerId);
                    if (viewer) {
                        this.safeSend(viewer, parsedMessage);
                    }
                } else {
                    room.viewers.forEach((viewer) => {
                        this.safeSend(viewer, parsedMessage);
                    });
                }
            } catch (err) {
                logger.error('Error handling host message:', err as Error);
            }
        });

        // Keep track of connection state
        let isClosing = false;

        ws.on('close', (code, reason) => {
            if (isClosing) return; // Prevent duplicate cleanup
            isClosing = true;

            logger.info(`Host disconnected from stream ${streamId}`, {
                code,
                reason: reason.toString(),
            });

            clearInterval(pingInterval);
            this.handleHostDisconnection(room, streamId);
        });
    }

    private handleViewerConnection(ws: WebSocket, room: StreamRoom, streamId: string, viewerId: string, pingInterval: NodeJS.Timeout) {
        room.viewers.set(viewerId, ws);
        logger.info(`Viewer ${viewerId} connected to stream ${streamId}`);

        if (room.host) {
            this.safeSend(room.host, {
                type: 'viewer-connected',
                viewerId,
                streamId,
            });
        }

        ws.on('message', (message: string) => {
            try {
                const parsedMessage = JSON.parse(message) as SignalingMessage;
                if (room.host) {
                    this.safeSend(room.host, {
                        ...parsedMessage,
                        viewerId,
                        streamId,
                    });
                }
            } catch (err) {
                logger.error('Error handling viewer message:', err as Error);
            }
        });

        ws.on('close', () => {
            logger.info(`Viewer ${viewerId} disconnected from stream ${streamId}`);
            clearInterval(pingInterval);
            this.handleViewerDisconnection(room, streamId, viewerId);
        });

        ws.on('error', (error) => {
            logger.error(`Viewer ${viewerId} error for stream ${streamId}:`, error as Error);
        });
    }

    private handleHostDisconnection(room: StreamRoom, streamId: string) {
        room.viewers.forEach((viewer) => {
            this.safeSend(viewer, {
                type: 'viewer-disconnected',
                streamId,
                data: { reason: 'Host disconnected' },
            });
            viewer.close(1000, 'Host disconnected');
        });

        this.streams.delete(streamId);
    }

    private handleViewerDisconnection(room: StreamRoom, streamId: string, viewerId: string) {
        room.viewers.delete(viewerId);

        if (room.host) {
            this.safeSend(room.host, {
                type: 'viewer-disconnected',
                viewerId,
                streamId,
            });
        }
    }

    private safeSend(ws: WebSocket, message: SignalingMessage) {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(message));
                logger.debug('Message sent successfully', {
                    type: message.type,
                    streamId: message.streamId,
                    viewerId: message.viewerId,
                });
            } catch (err) {
                logger.error('Error sending message:', err as Error);
            }
        } else {
            logger.warn('Attempted to send message to closed connection', {
                readyState: ws.readyState,
                type: message.type,
            });
        }
    }

    private startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [streamId, room] of this.streams.entries()) {
                if (now - room.createdAt > config.webrtc.cleanup.timeout) {
                    logger.info(`Cleaning up inactive stream ${streamId}`);
                    this.cleanupStream(room, streamId);
                }
            }
        }, config.webrtc.cleanup.interval);
    }

    private cleanupStream(room: StreamRoom, streamId: string) {
        room.viewers.forEach((viewer) => {
            if (viewer.readyState === WebSocket.OPEN) {
                viewer.close(1000, 'Stream timeout');
            }
        });

        if (room.host?.readyState === WebSocket.OPEN) {
            room.host.close(1000, 'Stream timeout');
        }

        this.streams.delete(streamId);
    }

    public getStats() {
        return {
            activeStreams: this.streams.size,
            totalViewers: Array.from(this.streams.values()).reduce((total, room) => total + room.viewers.size, 0),
        };
    }

    public shutdown() {
        clearInterval(this.cleanupInterval);
        this.wss.clients.forEach((client) => {
            client.close(1000, 'Server shutting down');
        });
    }
}
