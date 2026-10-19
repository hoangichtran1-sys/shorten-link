import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "@/lib/db";
import { urls } from "@/db/schema";
import { env } from "@/lib/env";
import { redisClient } from "@/lib/redis";

const EXPIRES_AT = 60 * 60 * 24;

export const handleRedirect = new Elysia({ name: "handle-redirect" }).get(
    "/api/shorten/:code",
    async ({ redirect, params }) => {
        const { code } = params;

        let longUrl = await redisClient.get(`url:${code}:code`);

        if (!longUrl) {
            const [urlData] = await db
                .select({ longUrl: urls.longUrl })
                .from(urls)
                .where(eq(urls.shortCode, code));
            if (!urlData) {
                return redirect(`${env.APP_URL}/failed-get-link`);
            }
            longUrl = urlData.longUrl;

            await redisClient.set(`url:${code}:code`, longUrl, { ex: EXPIRES_AT });
        }

        // Increment clicks url
        await redisClient.hincrby("clicks_buffer", code, 1);

        return redirect(longUrl as string);
    },
    {
        params: t.Object({ code: t.String({ minLength: 6, maxLength: 20 }) }),
    },
);
