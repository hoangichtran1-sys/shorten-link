import { t } from "elysia";
import { env } from "@/lib/env";

export const cookieSchema = t.Cookie(
    {
        accessToken: t.Optional(t.String()),
    },
    {
        secrets: env.COOKIE_SECRET,
        sign: ["accessToken"],
    },
);
