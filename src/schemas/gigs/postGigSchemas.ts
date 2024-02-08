// POST /gigs

import { Request } from "express";
import { z } from "zod";

/** Validates `req.body` */
const bodySchema = z.object({
    title: z.string().min(3),
    description: z.string().min(4),
    offer: z.coerce.number(),
    category: z.string().min(3),
    location: z.object({
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
        name: z.string().min(1)
    })
});

type PostGigBodyType = z.infer<typeof bodySchema>;

export { bodySchema as postGigsBodySchema };
export type { PostGigBodyType };

export type PostGigRequest = Request<any, any, PostGigBodyType, any>;