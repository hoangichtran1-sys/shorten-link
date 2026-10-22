import { Elysia } from "elysia";
import { serverTiming } from "@elysia/server-timing";

import { ApiError } from "@/lib/api-error";
import { globalRateLimit } from "@/lib/rate-limiter";

import { authRouter } from "@/modules/auth/server/route";
import { linkRouter } from "@/modules/link/server/route";
import { reviewRouter } from "@/modules/review/server/router";
import { cronsRouter } from "./cron";
import { handleRedirect } from "./redirect";
import { otherRouter } from "./other";

export const app = new Elysia();

app.use(serverTiming());
app.use(globalRateLimit);

app.error({
    API_ERROR: ApiError,
}).onError(({ code, error, status }) => {
    switch (code) {
        case "API_ERROR":
            return status(error.statusCode, {
                message: error.message,
                cause: error.cause,
            });
        case "VALIDATION":
            return status(422, {
                message: error.message,
                cause: error.cause,
            });
        default:
            console.log(error);
            return status(500, {
                message: "Something went wrong",
            });
    }
});

app.use(handleRedirect);

export const router = app.group("/api", (app) =>
    app
        .use(authRouter)
        .use(linkRouter)
        .use(reviewRouter)
        .use(cronsRouter)
        .use(otherRouter)
        .get("/health", ({ set }) => {
            set.status = 200;
            return {
                data: {
                    message: "Service is healthy",
                    status: "healthy",
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                },
            };
        }),
);

export const GET = app.fetch;
export const POST = app.fetch;
export const PATCH = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;

export type App = typeof router;
