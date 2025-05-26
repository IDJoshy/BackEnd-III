import dotenv from 'dotenv';
import path from 'path';
import __dirname from "../utils/index.js";

export function loadEnv(mode = 'prod')
{
    const envFile = mode === 'dev' ? '../../.env.dev' : '../../.env'
    const envPath = path.resolve(__dirname, envFile);
    
    dotenv.config({ path: envPath });
    process.env.NODE_ENV = mode;
}

export default 
{
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    DB_NAME:process.env.DB_NAME,
    NODE_ENV:process.env.NODE_ENV
};
