import { Elysia, t } from "elysia";
import { and, desc, eq, inArray } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { authMacro } from "@/plugins/auth-macro";
import { urls } from "@/db/schema";
import { env } from "@/lib/env";
import { createFormSchema, updateFormSchema } from "../schemas";
import { ApiError } from "@/lib/api-error";
import { redisClient } from "@/lib/redis";

export const linkRouter = new Elysia({ name: "link-router", prefix: "/link" })
    .use(authMacro)
    .post(
        "/",
        async ({ set, body, userId }) => {
            const { longUrl, codeLength } = body;

            const urlsData = await db
                .select({
                    shortCode: urls.shortCode,
                })
                .from(urls)
                .where(eq(urls.longUrl, longUrl))
                .limit(1)
                .orderBy(desc(urls.createdAt));

            if (urlsData.length > 0) {
                set.status = 200;

                return `${env.APP_URL}/api/shorten/${urlsData[0].shortCode}`;
            }

            const shortCode = nanoid(codeLength);
            const randomName = generateSlug(3, { format: "lower" });

            const [urlCreated] = await db
                .insert(urls)
                .values({
                    userId,
                    name: randomName,
                    longUrl,
                    shortCode,
                })
                .returning({
                    shortCode: urls.shortCode,
                });

            set.status = 200;
            return `${env.APP_URL}/api/shorten/${urlCreated.shortCode}`;
        },
        {
            body: createFormSchema,
            isAuth: true,
        },
    )
    .get(
        "/recent",
        async ({ userId }) => {
            const recentUrls = await db
                .select()
                .from(urls)
                .where(eq(urls.userId, userId))
                .orderBy(desc(urls.createdAt))
                .limit(3);

            if (recentUrls.length === 0) {
                throw ApiError.notFound("No recent link found");
            }

            const recentUrlsFormatted = recentUrls.map((url) => ({
                id: url.id,
                name: url.name,
                shortLink: `${env.APP_URL}/api/shorten/${url.shortCode}`,
            }));

            return recentUrlsFormatted;
        },
        {
            isAuth: true,
        },
    )
    .get(
        "/",
        async ({ userId }) => {
            const urlsData = await db
                .select()
                .from(urls)
                .where(eq(urls.userId, userId))
                .orderBy(desc(urls.createdAt));

            return urlsData;
        },
        {
            isAuth: true,
        },
    )
    .get(
        "/:id",
        async ({ userId, params }) => {
            const { id } = params;

            const [existingUrlData] = await db
                .select()
                .from(urls)
                .where(and(eq(urls.id, id), eq(urls.userId, userId)));

            if (!existingUrlData) {
                throw ApiError.notFound("Url not found");
            }

            return existingUrlData;
        },
        {
            isAuth: true,
            params: t.Object({ id: t.Integer({ minimum: 1 }) }),
        },
    )
    .put(
        "/:id",
        async ({ userId, body, params }) => {
            const { id } = params;

            const [existingUrlData] = await db
                .select()
                .from(urls)
                .where(and(eq(urls.id, id), eq(urls.userId, userId)));

            if (!existingUrlData) {
                throw ApiError.notFound("Url not found");
            }

            const [urlUpdated] = await db.update(urls).set(body).where(eq(urls.id, id)).returning();

            return urlUpdated;
        },
        {
            isAuth: true,
            body: updateFormSchema.partial(),
            params: t.Object({ id: t.Integer({ minimum: 1 }) }),
        },
    )
    .delete(
        "/:id",
        async ({ userId, params }) => {
            const { id } = params;

            const [existingUrlData] = await db
                .select()
                .from(urls)
                .where(and(eq(urls.id, id), eq(urls.userId, userId)));

            if (!existingUrlData) {
                throw ApiError.notFound("Url not found");
            }

            await Promise.all([
                redisClient.del(`url:${existingUrlData.shortCode}:code`),
                redisClient.hdel("clicks_buffer", existingUrlData.shortCode),
                db.delete(urls).where(eq(urls.id, existingUrlData.id)),
            ]);

            return { id };
        },
        {
            isAuth: true,
            params: t.Object({ id: t.Integer({ minimum: 1 }) }),
        },
    )
    .post(
        "/bulk-delete",
        async ({ userId, body }) => {
            const { ids } = body;
            const urlsDeleted = await db
                .select()
                .from(urls)
                .where(and(inArray(urls.id, ids), eq(urls.userId, userId)));

            if (urlsDeleted.length === 0) {
                throw ApiError.notFound("Url not found");
            }

            await Promise.all(
                urlsDeleted.map((item) =>
                    Promise.all([
                        redisClient.del(`url:${item.shortCode}:code`),
                        redisClient.hdel("clicks_buffer", item.shortCode),
                        db.delete(urls).where(eq(urls.id, item.id)),
                    ]),
                ),
            );

            return { count: urlsDeleted.length };
        },
        {
            isAuth: true,
            body: t.Object({
                ids: t.Array(t.Integer({ minimum: 1 })),
            }),
        },
    );
