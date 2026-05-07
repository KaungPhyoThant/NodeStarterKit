import pino from 'pino';
import env from '../config/env.js';

const logger = pino(
  env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, ignore: 'pid,hostname' },
        },
      }
    : {},
);

export default logger;
