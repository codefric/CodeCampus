import express from 'express';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

interface StreamRoom {
    host: WebSocket | null;
    viewers: Map<string, WebSocket>;
}

const streams = new Map<string, StreamRoom>();

wss.on('connection', (ws: WebSocket, req: any) => {
    const streamId = req.url.split('/').pop();
    const viewerId = Math.random().toString(36).substring(2, 15);

    if (!streams.has(streamId)) {
        streams.set(streamId, {
            host: null,
            viewers: new Map(),
        });
    }

    const room = streams.get(streamId)!;

    // First connection for this stream becomes the host
    if (!room.host) {
        room.host = ws;
        console.log(`Host connected for stream ${streamId}`);

        ws.on('message', (message: string) => {
            const parsedMessage = JSON.parse(message);

            // Broadcast to all viewers
            room.viewers.forEach((viewer) => {
                if (viewer.readyState === WebSocket.OPEN) {
                    viewer.send(
                        JSON.stringify({
                            ...parsedMessage,
                            streamId,
                        })
                    );
                }
            });
        });

        ws.on('close', () => {
            console.log(`Host disconnected from stream ${streamId}`);
            // Notify all viewers that the stream has ended
            room.viewers.forEach((viewer) => {
                if (viewer.readyState === WebSocket.OPEN) {
                    viewer.close();
                }
            });
            streams.delete(streamId);
        });
    } else {
        // This is a viewer
        room.viewers.set(viewerId, ws);
        console.log(`Viewer ${viewerId} connected to stream ${streamId}`);

        // Notify host of new viewer
        if (room.host.readyState === WebSocket.OPEN) {
            room.host.send(
                JSON.stringify({
                    type: 'viewer-connected',
                    viewerId,
                    streamId,
                })
            );
        }

        ws.on('message', (message: string) => {
            const parsedMessage = JSON.parse(message);

            // Send messages to host
            if (room.host && room.host.readyState === WebSocket.OPEN) {
                room.host.send(
                    JSON.stringify({
                        ...parsedMessage,
                        viewerId,
                        streamId,
                    })
                );
            }
        });

        ws.on('close', () => {
            console.log(`Viewer ${viewerId} disconnected from stream ${streamId}`);
            room.viewers.delete(viewerId);

            // Notify host of viewer disconnection
            if (room.host && room.host.readyState === WebSocket.OPEN) {
                room.host.send(
                    JSON.stringify({
                        type: 'viewer-disconnected',
                        viewerId,
                        streamId,
                    })
                );
            }
        });
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
});
