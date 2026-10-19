import { z } from "zod";

export const createFormSchema = z.object({
    longUrl: z.url(),
    codeLength: z.number().int().min(6).max(20),
});

export const updateFormSchema = createFormSchema
    .extend({
        name: z.string().nullable(),
    })
    .omit({ codeLength: true });
