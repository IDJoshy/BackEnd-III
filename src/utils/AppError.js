import errors from "./Dictionary.js";

class AppError extends Error
{
    constructor(code, etc = {}) 
    {
        const errorDictionary = errors[code] || 
        {
            code: 'UKNOWN_ERROR',
            message: 'an unknown error has occurred',
            status: 500
        };

        super(errorDictionary.message);
        this.code = errorDictionary.code;
        this.status = errorDictionary.status;
        this.etc = etc;
    }
}

export default AppError;