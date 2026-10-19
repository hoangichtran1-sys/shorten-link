import { BrevoClient } from "@getbrevo/brevo";
import { env } from "./env";

export const brevo = new BrevoClient({
    apiKey: env.BREVO_API_KEY,
});
