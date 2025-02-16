// server/utils/logger.ts
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
    private static instance: Logger;
    private currentLevel: LogLevel = 'INFO';

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLevel(level: LogLevel) {
        this.currentLevel = level;
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.currentLevel];
    }

    private formatMessage(level: LogLevel, message: string, context?: any): string {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` ${JSON.stringify(context)}` : '';
        return `[${timestamp}] ${level}: ${message}${contextStr}`;
    }

    debug(message: string, context?: any) {
        if (this.shouldLog('DEBUG')) {
            console.debug(this.formatMessage('DEBUG', message, context));
        }
    }

    info(message: string, context?: any) {
        if (this.shouldLog('INFO')) {
            console.info(this.formatMessage('INFO', message, context));
        }
    }

    warn(message: string, context?: any) {
        if (this.shouldLog('WARN')) {
            console.warn(this.formatMessage('WARN', message, context));
        }
    }

    error(message: string, error?: Error, context?: any) {
        if (this.shouldLog('ERROR')) {
            console.error(
                this.formatMessage('ERROR', message, {
                    ...context,
                    error: error?.message,
                    stack: error?.stack,
                })
            );
        }
    }
}

export const logger = Logger.getInstance();
