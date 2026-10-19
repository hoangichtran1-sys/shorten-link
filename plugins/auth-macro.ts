import { Elysia } from "elysia";
import jwt from "@elysia/jwt";
import { jwtConfig } from "@/lib/jwt";
import { ApiError } from "@/lib/api-error";
import { cookieSchema } from "@/modules/auth/server/schemas";

export const authMacro = new Elysia({ name: "auth-macro" }).use(jwt(jwtConfig)).macro("isAuth", {
    cookie: cookieSchema,
    resolve: async ({ jwt, cookie: { accessToken } }) => {
        if (!accessToken.value) {
            throw ApiError.unauthorized("Missing access token");
        }

        const payload = await jwt.verify(accessToken.value);

        if (!payload) {
            throw ApiError.unauthorized("Access token has expired or is invalid");
        }

        return {
            userId: payload.id,
        };
    },
});
