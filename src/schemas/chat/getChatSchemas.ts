// GET /gigs/:gigId

import { z } from "zod";
import mongoose from 'mongoose';
import { Request } from "express";

const isValidObjectId = (value: string): boolean => {
    return mongoose.Types.ObjectId.isValid(value);
};

/** Validates `req.params` */
const paramsSchema = z.object({
    senderId: z.string().refine(isValidObjectId, {
        message: 'senderId must be a valid Mongoose ObjectId'
    }),
    receiverId: z.string().refine(isValidObjectId, {
        message: 'receiverId must be a valid Mongoose ObjectId'
    })
})

type GetChatParamsType = z.infer<typeof paramsSchema>;

export { paramsSchema as getChatParamsSchema };
export type { GetChatParamsType };


export type GetChatRequest = Request<GetChatParamsType, any, any, any>;