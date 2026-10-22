import { z } from "zod";

export const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    feedback: z.string().trim().max(500).nullable(),
});

export const updateReviewSchema = createReviewSchema;
