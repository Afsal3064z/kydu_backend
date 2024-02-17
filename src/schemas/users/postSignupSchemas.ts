// POST /signup

import { Request } from "express";
import { z } from "zod";

/** Validates `req.body` */
const bodySchema = z.object({
    name: z.string()
        .min(3),

    email: z.string()
        .email(),

    password: z.string()
        .min(8)
        .regex(/^[a-zA-Z0-9]{8,30}$/), // Alphanumeric, 8-30 characters
    
    fcmToken: z.string().optional()
});

type PostSignupBodyType = z.infer<typeof bodySchema>;

export { bodySchema as postSignupSchema };
export type { PostSignupBodyType };

export type PostSignupRequest = Request<any, any, PostSignupBodyType, any>;