// POST /gigs

import { Request } from "express";
import { z } from "zod";
import mongoose from 'mongoose';

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

/** Validates `req.body` */
const bodySchema = z.object({
    content: z.string().min(1).max(2000)
});

type PostChatParamsType = z.infer<typeof paramsSchema>;
type PostChatBodyType = z.infer<typeof bodySchema>;

export { paramsSchema as postChatParamsSchema };
export { bodySchema as postChatBodySchema };

export type { PostChatParamsType };
export type { PostChatBodyType };

export type PostChatRequest = Request<PostChatParamsType, any, PostChatBodyType, any>;

