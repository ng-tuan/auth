/**
 * Simple logger utility for application logging
 */
export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, error: unknown): void => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};
