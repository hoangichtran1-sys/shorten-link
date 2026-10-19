import { rateLimit } from "elysia-rate-limit";
import { ApiError } from "./api-error";

export const globalRateLimit = rateLimit({
    duration: 60000, // 1 phút
    max: 1000,
    errorResponse: new ApiError(429, "Too many requests, please try again later."),
    generator: (req) => {
        const xForwardedFor = req.headers.get("x-forwarded-for");
        const xRealIp = req.headers.get("x-real-ip");

        return xForwardedFor || xRealIp || "127.0.0.1";
    },
});
