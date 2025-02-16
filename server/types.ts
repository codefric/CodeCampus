// server/types.ts
import { WebSocket } from 'ws';

// WebRTC Types
export type MessageType = 'offer' | 'answer' | 'ice-candidate' | 'viewer-connected' | 'viewer-disconnected';

export interface SignalingMessage {
    type: MessageType;
    data?: any;
    streamId: string;
    viewerId?: string;
}

export interface StreamRoom {
    host: WebSocket | null;
    viewers: Map<string, WebSocket>;
    createdAt: number;
}

// Chat Types
export interface ChatMessage {
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
    type: 'chat' | 'system';
    streamId: string;
}

export interface ChatRoom {
    clients: Map<string, WebSocket>;
    createdAt: number;
}
