// POST /gigs/:gigId

import { Request } from "express";
import mongoose from "mongoose";
import { z } from "zod";

const isValidObjectId = (value: string): boolean => {
    return mongoose.Types.ObjectId.isValid(value);
};

/** Validates `req.params` */
const paramsSchema = z.object({
    gigId: z.string().refine(isValidObjectId, {
        message: 'gigId must be a valid Mongoose ObjectId'
    })
})

type PostGigConnectionParamsType = z.infer<typeof paramsSchema>;

export { paramsSchema as postGigConnectionParamsSchema };
export type { PostGigConnectionParamsType };

export type PostGigConnectionRequest = Request<PostGigConnectionParamsType, any, any, any>;