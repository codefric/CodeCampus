// server/chatServer.ts
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import type { ChatMessage, ChatRoom } from './types';
import { config } from './utils/config';
import { logger } from './utils/logger';

export class ChatServer {
    private rooms = new Map<string, ChatRoom>();
    private wss: WebSocketServer;
    private cleanupInterval!: NodeJS.Timeout;

    constructor(server: ReturnType<typeof createServer>) {
        this.wss = new WebSocketServer({ server, path: '/chat' });
        this.initialize();
    }

    private initialize() {
        this.setupWebSocketServer();
        this.startCleanupInterval();
    }

    private setupWebSocketServer() {
        this.wss.on('connection', (ws: WebSocket, req) => {
            try {
                const streamId = req.url?.split('/').pop();

                if (!streamId) {
                    logger.warn('Connection attempt without stream ID');
                    ws.close(1002, 'No stream ID provided');
                    return;
                }

                this.handleConnection(ws, streamId);
            } catch (err) {
                logger.error('Error in WebSocket connection setup:', err as Error);
                ws.close(1011, 'Internal server error');
            }
        });
    }

    private handleConnection(ws: WebSocket, streamId: string) {
        logger.info('[Chat] New connection', { streamId });

        if (!this.rooms.has(streamId)) {
            this.rooms.set(streamId, {
                clients: new Map(),
                createdAt: Date.now(),
            });
            logger.debug('[Chat] Created new room', { streamId });
        }

        const room = this.rooms.get(streamId)!;

        // Setup event handlers with error boundaries
        ws.on('message', (data: string) => {
            try {
                this.handleMessage(ws, data, room, streamId);
            } catch (err) {
                logger.error('[Chat] Error handling message:', err as Error);
            }
        });

        ws.on('close', () => {
            try {
                this.handleDisconnection(ws, room, streamId);
            } catch (err) {
                logger.error('[Chat] Error handling disconnection:', err as Error);
            }
        });

        ws.on('error', (error) => {
            logger.error('[Chat] WebSocket error:', error as Error, { streamId });
        });
    }

    private handleMessage(ws: WebSocket, data: string, room: ChatRoom, streamId: string) {
        try {
            const message: ChatMessage = JSON.parse(data.toString());
            logger.debug('[Chat] Received message', {
                streamId,
                userId: message.userId,
                type: message.type,
            });

            // Validate message
            if (!this.isValidMessage(message)) {
                logger.warn('[Chat] Invalid message received', { streamId });
                return;
            }

            // Add the user to the room if not already present
            if (!room.clients.has(message.userId)) {
                room.clients.set(message.userId, ws);
                logger.debug('[Chat] New user added to room', {
                    streamId,
                    userId: message.userId,
                });
            }

            this.broadcastToRoom(room, message);
            this.sendUserCount(room, streamId);
        } catch (err) {
            logger.error('[Chat] Error handling message:', err as Error);
        }
    }

    private isValidMessage(message: any): message is ChatMessage {
        return (
            typeof message === 'object' &&
            typeof message.userId === 'string' &&
            typeof message.username === 'string' &&
            typeof message.content === 'string' &&
            (message.type === 'chat' || message.type === 'system') &&
            typeof message.streamId === 'string'
        );
    }

    private handleDisconnection(ws: WebSocket, room: ChatRoom, streamId: string) {
        let disconnectedUserId: string | undefined;

        // Find and remove the disconnected user
        for (const [userId, client] of room.clients.entries()) {
            if (client === ws) {
                room.clients.delete(userId);
                disconnectedUserId = userId;
                break;
            }
        }

        if (disconnectedUserId) {
            logger.info('[Chat] User disconnected', {
                streamId,
                userId: disconnectedUserId,
            });
        }

        this.sendUserCount(room, streamId);

        // Clean up empty rooms
        if (room.clients.size === 0) {
            this.rooms.delete(streamId);
            logger.info('[Chat] Room deleted (empty)', { streamId });
        }
    }

    private broadcastToRoom(room: ChatRoom, message: ChatMessage) {
        const messageStr = JSON.stringify(message);
        let successCount = 0;
        let failCount = 0;

        room.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                try {
                    client.send(messageStr);
                    successCount++;
                } catch (err) {
                    failCount++;
                    logger.error('[Chat] Error broadcasting message:', err as Error);
                }
            }
        });

        logger.debug('[Chat] Broadcast complete', {
            streamId: message.streamId,
            success: successCount,
            failed: failCount,
        });
    }

    private sendUserCount(room: ChatRoom, streamId: string) {
        const systemMessage: ChatMessage = {
            userId: 'system',
            username: 'System',
            content: `${room.clients.size} ${room.clients.size === 1 ? 'user' : 'users'} in chat`,
            timestamp: new Date(),
            type: 'system',
            streamId,
        };

        this.broadcastToRoom(room, systemMessage);
    }

    private startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [streamId, room] of this.rooms.entries()) {
                if (now - room.createdAt > config.chat.cleanup.timeout) {
                    this.cleanupRoom(room, streamId);
                }
            }
        }, config.chat.cleanup.interval);
    }

    private cleanupRoom(room: ChatRoom, streamId: string) {
        logger.info('[Chat] Cleaning up inactive room', { streamId });

        room.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                try {
                    client.close(1000, 'Room timeout');
                } catch (err) {
                    logger.error('[Chat] Error closing client connection:', err as Error);
                }
            }
        });

        this.rooms.delete(streamId);
    }

    public getStats() {
        const stats = {
            activeRooms: this.rooms.size,
            totalUsers: Array.from(this.rooms.values()).reduce((total, room) => total + room.clients.size, 0),
            roomDetails: Array.from(this.rooms.entries()).map(([streamId, room]) => ({
                streamId,
                userCount: room.clients.size,
                uptime: Date.now() - room.createdAt,
            })),
        };

        logger.debug('[Chat] Stats generated', stats);
        return stats;
    }

    public shutdown() {
        logger.info('[Chat] Shutting down chat server');

        clearInterval(this.cleanupInterval);

        this.wss.clients.forEach((client) => {
            try {
                client.close(1000, 'Server shutting down');
            } catch (err) {
                logger.error('[Chat] Error during client shutdown:', err as Error);
            }
        });
    }
}
