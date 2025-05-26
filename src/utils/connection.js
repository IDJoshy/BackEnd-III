import mongoose from 'mongoose';
import { logger } from '../app.js';
import AppError from './AppError.js';

const connection = async(url, dbName) => 
{
    try
    {
        await mongoose.connect(url, {dbName:dbName});
        logger.info(`Connected to Cluster at ${url}, database: ${dbName}`);
    }
    catch(e)
    {
        
        const error = new AppError("SERVICE_UNAVAILABLE", {
            message: "Error connecting to MongoDB Cluster",
            original: e.message
        });
        logger.fatal(`[${error.code}] ${error.message} - ${error.etc.original}`);
        logger.end();
        process.exit(1);
    }   
}

export default connection;