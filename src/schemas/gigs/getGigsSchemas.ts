// GET /gigs

import { z } from "zod";
import mongoose from 'mongoose';
import { Request } from "express";

const isValidObjectId = (value: string): boolean => {
    return mongoose.Types.ObjectId.isValid(value);
};

/** Validates `req.query` */
const querySchema = z.object({
    longitude: z.string().optional(),
    latitude: z.string().optional(),
    // bypass: z.boolean(),
    self: z.boolean().optional()
})

type GetGigsQueryType = z.infer<typeof querySchema>;

export { querySchema as getGigsQuerySchema };
export type { GetGigsQueryType };


export type GetGigsRequest = Request<any, any, any, GetGigsQueryType>;