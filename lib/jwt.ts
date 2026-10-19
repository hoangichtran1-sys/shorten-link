import { z } from "zod";
import type { JWTOption } from "@elysia/jwt";
import { env } from "./env";

const payloadSchema = z.object({ id: z.number().int().positive() });

const jwtConfig: JWTOption<"jwt", typeof payloadSchema> = {
    name: "jwt",
    schema: payloadSchema,
    secret: env.JWT_SECRET,
    exp: env.JWT_EXPIRED,
};

export { jwtConfig };
