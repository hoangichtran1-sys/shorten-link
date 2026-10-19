import { Elysia } from "elysia";
import { eq, sql, lte, and } from "drizzle-orm";
import { subWeeks } from "date-fns";
import { redisClient } from "@/lib/redis";
import { db } from "@/lib/db";
import { urls, users } from "@/db/schema";

export const cronsRouter = new Elysia({ name: "cron-router", prefix: "/trigger" })
    .get("/synchronize-clicks", async ({ set }) => {
        const bufferedClicks = (await redisClient.hgetall("clicks_buffer")) as Record<
            string,
            string
        >;

        if (Object.keys(bufferedClicks).length === 0) {
            set.status = 200;
            return { message: "No data available for synchronization" };
        }

        await redisClient.hdel("clicks_buffer");

        Object.entries(bufferedClicks).forEach(async ([code, count]) => {
            const clickCount = parseInt(count, 10);

            await db
                .update(urls)
                .set({
                    clicks: sql`${urls.clicks} + ${clickCount}`,
                })
                .where(eq(urls.shortCode, code));
        });

        set.status = 200;

        return { message: "Data synchronization successful" };
    })
    .get("/cleanup-guest", async ({ set }) => {
        const oneWeekAgo = subWeeks(new Date(), 1);

        const guestData = await db
            .select({
                id: users.id,
            })
            .from(users)
            .where(and(eq(users.type, "guest"), lte(users.createdAt, oneWeekAgo)));

        await Promise.all(guestData.map((guest) => db.delete(users).where(eq(users.id, guest.id))));

        set.status = 200;
        return { message: "Cleanup guest user data successful" };
    });
