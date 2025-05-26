import { Command, Option } from "commander";
import express from 'express';
import cookieParser from 'cookie-parser';
import compress from "express-compression";

import { loadEnv } from "./config/config.js";
import connection from "./utils/connection.js";
import errorHandler from "./utils/errorHandler.js";
import { createLogger } from "./utils/logger.js";

// Routers
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import loggerTestRouter from './routes/loggerTest.router.js';

//#region Commander (leer modo de entorno)
const program = new Command();
program.addOption(
    new Option('-m, --mode <type>', 'environment')
        .choices(['dev', 'prod'])
        .default('prod')
);
program.parse();
const opts = program.opts();
//#endregion

//#region Cargar entorno
loadEnv(opts.mode);
export const logger = createLogger(process.env.NODE_ENV); // Verificación
//#endregion

const app = express();
const PORT = process.env.PORT || 8080;

connection(process.env.MONGO_URL,process.env.DB_NAME);

app.use(compress());
app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks',mocksRouter);
app.use('/api/loggerTest',loggerTestRouter);


app.use((err, req, res, next) => {
    errorHandler(err, res);
});

app.listen(PORT,()=>
{
    // Verificación
    // These logs will help verify initial behavior
    logger.debug(`[APP_START] DEBUG - NODE_ENV loaded: ${process.env.NODE_ENV}`);
    logger.http(`[APP_START] HTTP - PID: ${process.pid}`);
    logger.info(`[APP_START] INFO - Server listening on port ${PORT}`);
    logger.warning(`[APP_START] WARNING - Test warning from app.js startup.`);
    logger.error(`[APP_START] ERROR - Test error from app.js startup.`);
    logger.fatal(`[APP_START] FATAL - Test fatal from app.js startup.`);
    
});

