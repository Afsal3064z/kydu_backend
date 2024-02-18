import { z } from "zod";
import { Request } from "express";

/** Validates `req.query` */
const querySchema = z.object({
    alertsOnly: z.coerce.boolean().optional(),
})

type GetUserProfileQueryType = z.infer<typeof querySchema>;

export { querySchema as getUserProfileQuerySchema };
export type { GetUserProfileQueryType };

export type GetUserProfileRequest = Request<any, any, any, GetUserProfileQueryType>;