import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import argon2 from "argon2";
import jwt from "@elysia/jwt";
import { generateSlug } from "random-word-slugs";
import uniqueSlug from "unique-slug";
import { nanoid } from "nanoid";

import { db } from "@/lib/db";
import { jwtConfig } from "@/lib/jwt";
import { env } from "@/lib/env";
import { ApiError } from "@/lib/api-error";
import { userDTO, users } from "@/db/schema";
import { authMacro } from "@/plugins/auth-macro";
import { loginSchema, registerSchema } from "../schemas";
import { cookieSchema } from "./schemas";

export const authRouter = new Elysia({ prefix: "/auth", name: "auth-route" })
    .use(jwt(jwtConfig))
    .use(authMacro)
    .post(
        "/register",
        async ({ jwt, set, body, cookie: { accessToken } }) => {
            const { name, email, password } = body;

            const [existingUser] = await db.select().from(users).where(eq(users.email, email));
            if (existingUser) {
                throw ApiError.conflict("User already exists");
            }

            const hashPassword = await argon2.hash(password);

            const [userCreated] = await db
                .insert(users)
                .values({
                    name,
                    email,
                    password: hashPassword,
                })
                .returning({
                    id: users.id,
                    email: users.email,
                    name: users.name,
                });

            const token = await jwt.sign({ id: userCreated.id });

            set.status = 201;

            accessToken.set({
                value: token,
                httpOnly: true,
                maxAge: 14 * 86400,
                path: "/",
                secure: env.NODE_ENV === "production",
            });

            return userCreated;
        },
        {
            body: registerSchema,
            cookie: cookieSchema,
        },
    )
    .post(
        "/login",
        async ({ jwt, set, body, cookie: { accessToken } }) => {
            const { email, password } = body;

            const [user] = await db.select().from(users).where(eq(users.email, email));
            if (!user) {
                throw ApiError.notFound("User not found");
            }

            const isValidPassword = await argon2.verify(user.password, password);

            if (!isValidPassword) {
                throw ApiError.unauthorized("Invalid credentials");
            }

            const token = await jwt.sign({ id: user.id });

            set.status = 200;

            accessToken.set({
                value: token,
                httpOnly: true,
                maxAge: 14 * 86400,
                path: "/",
                secure: env.NODE_ENV === "production",
            });

            return userDTO.parse(user);
        },
        {
            body: loginSchema,
            cookie: cookieSchema,
        },
    )
    .post(
        "/login-with-guest",
        async ({ jwt, set, cookie: { accessToken } }) => {
            const randomName = generateSlug(3, { format: "title" });
            const randomEmail = `guest.${uniqueSlug()}@gmail.com`;
            const randomPassword = nanoid(6);

            const hashPassword = await argon2.hash(randomPassword);

            const [newUser] = await db
                .insert(users)
                .values({
                    name: randomName,
                    email: randomEmail,
                    password: hashPassword,
                    type: "guest",
                })
                .returning({
                    id: users.id,
                    email: users.email,
                    name: users.name,
                });

            const token = await jwt.sign({ id: newUser.id });

            set.status = 200;

            accessToken.set({
                value: token,
                httpOnly: true,
                maxAge: 14 * 86400,
                path: "/",
                secure: env.NODE_ENV === "production",
            });

            return newUser;
        },
        {
            cookie: cookieSchema,
        },
    )
    .post(
        "/logout",
        async ({ set, cookie: { accessToken } }) => {
            accessToken.remove();

            set.status = 204;
            return null;
        },
        {
            isAuth: true,
            cookie: cookieSchema,
        },
    )
    .get(
        "/current",
        async ({ set, userId }) => {
            const [user] = await db.select().from(users).where(eq(users.id, userId));

            set.status = 200;

            return userDTO.parse(user);
        },
        {
            isAuth: true,
        },
    );
