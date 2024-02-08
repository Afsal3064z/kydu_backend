// POST /login

import { Request } from "express";
import { z } from "zod";

/** Validates `req.body` */
const bodySchema = z.object({
    email: z.string()
        .email(),

    password: z.string()
});

type PostLoginBodyType = z.infer<typeof bodySchema>;

export { bodySchema as postLoginSchema };
export type { PostLoginBodyType };

export type PostLoginRequest = Request<any, any, PostLoginBodyType, any>;