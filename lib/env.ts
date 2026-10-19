import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().min(1),

        APP_URL: z.string().min(1),
        NODE_ENV: z.string().min(1),

        SENDER_EMAIL: z.email(),
        SENDER_NAME: z.string().min(1),
        BREVO_API_KEY: z.string().min(1),

        JWT_SECRET: z.string().min(1),
        JWT_EXPIRED: z.string().min(1),
        COOKIE_SECRET: z.string().min(1),

        UPSTASH_REDIS_REST_URL: z.url(),
        UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    },
    experimental__runtimeEnv: {},
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
