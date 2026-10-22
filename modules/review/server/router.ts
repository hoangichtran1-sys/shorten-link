import { Elysia, t } from "elysia";
import { eq, and, getColumns, desc } from "drizzle-orm";
import { authMacro } from "@/plugins/auth-macro";
import { db } from "@/lib/db";
import { reviews, users } from "@/db/schema";
import { createReviewSchema } from "../schemas";
import { ApiError } from "@/lib/api-error";

export const reviewRouter = new Elysia({ prefix: "/review", name: "review-router" })
    .use(authMacro)
    .post(
        "/",
        async ({ body, userId }) => {
            const [existingReview] = await db
                .select()
                .from(reviews)
                .where(eq(reviews.userId, userId));

            if (existingReview) {
                throw ApiError.conflict("Existing review");
            }

            const [newReview] = await db
                .insert(reviews)
                .values({
                    ...body,
                    userId,
                })
                .returning();

            return newReview;
        },
        {
            isAuth: true,
            body: createReviewSchema,
        },
    )
    .put(
        "/:id",
        async ({ body, userId, params }) => {
            const { id } = params;
            const [existingReview] = await db
                .select()
                .from(reviews)
                .where(and(eq(reviews.id, id), eq(reviews.userId, userId)));

            if (!existingReview) {
                throw ApiError.notFound("Review not found");
            }

            const [reviewUpdated] = await db
                .update(reviews)
                .set(body)
                .where(eq(reviews.id, existingReview.id))
                .returning();

            return reviewUpdated;
        },
        {
            isAuth: true,
            body: createReviewSchema.partial(),
            params: t.Object({ id: t.Integer({ minimum: 1 }) }),
        },
    )
    .get("/", async () => {
        const data = await db
            .select({
                ...getColumns(reviews),
                user: { email: users.email, name: users.name, type: users.type },
            })
            .from(reviews)
            .leftJoin(users, eq(reviews.userId, users.id))
            .orderBy(desc(reviews.createdAt));

        return data.map((item) => ({
            ...item,
            likes: Math.floor(item.rating * 30),
            comments: Math.floor(item.rating * 10),
        }));
    })
    .get(
        "/current",
        async ({ userId }) => {
            const [existingReview] = await db
                .select()
                .from(reviews)
                .where(eq(reviews.userId, userId));

            if (!existingReview) {
                throw ApiError.notFound("Review not found");
            }

            return existingReview;
        },
        {
            isAuth: true,
        },
    );
