import "dotenv/config";
import { Command, Option } from "commander";
import {loadEnv} from "./config/config.js";
import connection from "./utils/connection.js";
import express from 'express';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

import errorHandler from "./utils/errorHandler.js";
import compress from "express-compression";



//#region commander
const program = new Command();
program.addOption(new Option('-m, --mode <type>', 'environment').choices(['dev', 'prod']).default('prod'));
program.parse();
const opts = program.opts();
loadEnv(opts.mode);

//#endregion

const app = express();
const PORT = process.env.PORT;

connection(process.env.MONGO_URL,process.env.DB_NAME);

app.use(compress()); //compress
app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use((err, req, res, next) => {
    errorHandler(err, res);
});

app.listen(PORT,()=>console.log(`Listening on ${PORT}`));

