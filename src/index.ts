import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Router as expressRouter } from 'express';
import morgan from 'morgan';

import authRouter from './routers/authRouter.js';
import gigRouter from './routers/gigRouter.js';

// Inject the `.env` file into `process.env`
dotenv.config();

// Connect with the database.
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("[database] A connection has been established with MongoDB."))
    .catch(err => {
        console.error("[database] A connection could not be established.");
        console.error(err);
        process.exit(1);
    });

const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV as string === 'development') {
    app.use(morgan('dev'))
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', async (_req: Request, res: Response) => {
    res.status(200).send({ status: "API is online." });
});

app.use("/api/", authRouter as expressRouter);
app.use("/api/gigs", gigRouter as expressRouter);

// Handle our 404.
app.get('*', (_req: Request, res: Response) => res.sendStatus(404));

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack)
    res.status(500).json({ error: "An internal server error has occured. "});
})

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(PORT, () => {
    console.log(" ██╗  ██╗██╗   ██╗██████╗ ██╗   ██╗");
    console.log(" ██║ ██╔╝╚██╗ ██╔╝██╔══██╗██║   ██║");
    console.log(" █████╔╝  ╚████╔╝ ██║  ██║██║   ██║");
    console.log(" ██╔═██╗   ╚██╔╝  ██║  ██║██║   ██║");
    console.log(" ██║  ██╗   ██║   ██████╔╝╚██████╔╝");
    console.log(" ╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ ");
    console.log(`[server] ⚡ Server has started listening on http://localhost:${PORT}`);
});