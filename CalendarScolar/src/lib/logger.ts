/**
 * Structured logging utility using pino
 * Replaces console.error/warn/info for production-ready logging
 */

import pino from 'pino'

// Create logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
})

/**
 * Log levels:
 * - error: Errors that need immediate attention
 * - warn: Warnings that should be investigated
 * - info: General informational messages
 * - debug: Debug information (only in development)
 */

export const log = {
  error: (message: string, context?: Record<string, unknown>) => {
    logger.error({ ...context }, message)
  },
  
  warn: (message: string, context?: Record<string, unknown>) => {
    logger.warn({ ...context }, message)
  },
  
  info: (message: string, context?: Record<string, unknown>) => {
    logger.info({ ...context }, message)
  },
  
  debug: (message: string, context?: Record<string, unknown>) => {
    logger.debug({ ...context }, message)
  },
}

// Export logger instance for advanced usage
export default logger

