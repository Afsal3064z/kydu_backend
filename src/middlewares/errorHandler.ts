import { NextFunction, Request, Response } from "express";
import { CastError, MongooseError } from "mongoose";

export class AppError extends Error {
    public readonly name: string;
    // public readonly httpCode: number;
    public readonly isCatastrophic: boolean;

    constructor(name: string, description: string, isCatastrophic: boolean = false) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

        this.name = name;
        // this.httpCode = httpCode;
        this.isCatastrophic = isCatastrophic;

        Error.captureStackTrace(this);
    }
}

export const errorMiddleware = (err: AppError | CastError, req: Request, res: Response, next: NextFunction) => {
    console.error("===INTERNAL SERVER ERROR===");
    console.error(err);
    console.log("\n\n");

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err instanceof MongooseError) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            statusCode = 404;
            message = 'Resource not found';
        }
    } else {
        if (err.isCatastrophic) {
            res.status(500).json({ error: "Internal Server Error"});
            console.log("╔═╗╦  ╔═╗╦═╗╔╦╗");
            console.log("╠═╣║  ║╣ ╠╦╝ ║ ");
            console.log("╩ ╩╩═╝╚═╝╩╚═ ╩ ");
            console.error(err.name);
            console.error(`\t -${err.message}`);
            console.log("Error is of catastrophic nature. Server is shut down to prevent snowballing.");
            process.exit(1);
        }
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}
