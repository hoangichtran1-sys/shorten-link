import { z } from "zod";

export const contactFormSchema = z.object({
    firstName: z.string().min(1).max(30),
    lastName: z.string().min(1).max(30),
    email: z.email(),
    subject: z.string().min(1).max(50),
    message: z.string().min(3).max(1000),
});
