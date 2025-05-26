import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadEnv(mode = 'prod')
{
    const envFile = mode === 'dev' ? '../.env.dev' : '../.env';
    const envPath = path.resolve(__dirname, envFile);
    
    dotenv.config(
    {
        path: envPath
    });
    
    console.log(`[ENV] Loaded environment: ${mode} from ${envPath}`);
}

export default 
{
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    DB_NAME:process.env.DB_NAME
};
