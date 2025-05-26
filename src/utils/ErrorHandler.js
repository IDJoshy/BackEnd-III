import AppError from "./AppError.js";

const errorHandler = (err, res) =>
{
    if(err instanceof AppError)
    {
        return res.status(err.status).json({
            error: err.code,
            message: err.message,
            ...(Object.keys(err.etc).length > 0 && {details: err.etc})
        });
    }
    else
    {
        console.error(err);
        res.status(500).json(
        {
            error: 'INTERNAL_SERVER_ERROR',
            message: 'an unknown error has occurred'
        }
        );
    }

}

export default errorHandler;