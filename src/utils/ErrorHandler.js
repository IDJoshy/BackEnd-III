import AppError from "./AppError.js";
import { logger } from '../app.js';

const errorHandler = (err, res) =>
{
    if(err instanceof AppError)
    {
        logger.error(`[${err.code}] ${err.message} - ${JSON.stringify(err.etc || {})}`);
        return res.status(err.status).json({
            error: err.code,
            message: err.message,
            ...(Object.keys(err.etc).length > 0 && {details: err.etc})
        });
    }
    else
    {
        logger.fatal(`Unexpected error: ${err.message} \nStack: ${err.stack}`);
        return res.status(500).json(
        {
            error: 'INTERNAL_SERVER_ERROR',
            message: 'an unknown error has occurred'
        }
        );
    }

}

export default errorHandler;