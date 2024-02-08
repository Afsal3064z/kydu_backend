// GET /gigs/:gigId

import { z } from "zod";
import mongoose from 'mongoose';
import { Request } from "express";

const isValidObjectId = (value: string): boolean => {
    return mongoose.Types.ObjectId.isValid(value);
};

/** Validates `req.params` */
const paramsSchema = z.object({
    gigId: z.string().refine(isValidObjectId, {
        message: 'gigId must be a valid Mongoose ObjectId'
    })
})

type GetGigParamsType = z.infer<typeof paramsSchema>;

export { paramsSchema as getGigParamsSchema };
export type { GetGigParamsType as GetGigsParamsType };


export type GetGigRequest = Request<GetGigParamsType, any, any, any>;