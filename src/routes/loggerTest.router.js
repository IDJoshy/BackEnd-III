import { Router } from 'express';
import { logger } from '../app.js'; 

const router = Router();

router.get('/', (req, res) => {
    logger.debug('Logger Test: This is a DEBUG message.');
    logger.http('Logger Test: This is an HTTP message.');
    logger.info('Logger Test: This is an INFO message.');
    logger.warning('Logger Test: This is a WARNING message.');
    logger.error('Logger Test: This is an ERROR message.');
    logger.fatal('Logger Test: This is a FATAL message.'); 
    
    
    logger.error('Logger Test: Error with metadata.', {
        route: req.path,
        method: req.method,
        userId: req.user ? req.user.id : 'anonymous'
    });

    res.send('Logs sent to console and file. Check your terminal and "ServerErrorLogs/errors.log".');
});

export default router;