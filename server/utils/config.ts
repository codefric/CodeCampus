// server/utils/config.ts
export const config = {
    server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : 34567,
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
        },
    },
    webrtc: {
        cleanup: {
            interval: 5 * 60 * 1000, // 5 minutes
            timeout: 30 * 60 * 1000, // 30 minutes
        },
        ping: {
            interval: 30000, // 30 seconds
        },
    },
    chat: {
        cleanup: {
            interval: 5 * 60 * 1000, // 5 minutes
            timeout: 30 * 60 * 1000, // 30 minutes
        },
        reconnect: {
            maxAttempts: 5,
            interval: 3000, // 3 seconds
        },
    },
    log: {
        level: (process.env.LOG_LEVEL || 'INFO') as 'DEBUG' | 'INFO' | 'WARN' | 'ERROR',
    },
};
