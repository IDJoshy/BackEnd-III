import { logger } from '../app.js';

export function logControllerError({ req, method, error }) {
    logger.error(
        `[${req.method}] ${req.originalUrl} - Failed at ${method} - Reason: ${error?.message}`
    );
}