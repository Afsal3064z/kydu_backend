import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/** Validates `req.body` against given Zod Schema. */
function validateBody(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate req.body against the provided schema
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstErrorMessage = error.errors[0].message;
                return res.status(400).send({ error: firstErrorMessage });
            }
            next(error);
        }
    };
}

/** Validates `req.params` against given Zod Schema. */
function validateParams(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate req.params against the provided schema
            req.params = schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstErrorMessage = error.errors[0].message;
                return res.status(400).send({ error: firstErrorMessage });
            }
            next(error);
        }
    };
}

/** Validates `req.query` against given Zod Schema. */
function validateQuery(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate req.query against the provided schema
            req.query = schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstErrorMessage = error.errors[0].message;
                return res.status(400).send({ error: firstErrorMessage });
            }
            next(error);
        }
    };
}

export { validateBody, validateParams, validateQuery };
