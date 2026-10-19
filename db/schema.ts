import {
    integer,
    bigint,
    pgTable,
    varchar,
    timestamp,
    text,
    index,
    smallint,
    pgEnum,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const userType = pgEnum("user_type", ["normal", "guest"]);

export const users = pgTable("users", {
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: text().notNull(),
    type: userType("type").notNull().default("normal"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const urls = pgTable(
    "urls",
    {
        id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        userId: bigint("user_id", { mode: "number" })
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        name: text(),
        longUrl: text("long_url").notNull(),
        shortCode: text("short_code").notNull().unique(),
        clicks: integer().notNull().default(0),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (t) => [index("user_id_idx").on(t.userId), index("long_url_idx").on(t.longUrl)],
);

export const reviews = pgTable(
    "reviews",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        userId: bigint("user_id", { mode: "number" })
            .references(() => users.id, {
                onDelete: "set null",
            })
            .unique(),
        rating: smallint().notNull().default(0),
        feedback: text(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (t) => [index("rating_idx").on(t.rating)],
);

export const userSelectSchema = createSelectSchema(users);
export const userDTO = userSelectSchema.omit({
    password: true,
    createdAt: true,
});

export const urlSelectSchema = createSelectSchema(urls);
export const urlInsertSchema = createInsertSchema(urls);
export const urlUpdateSchema = createUpdateSchema(urls);

export const reviewSelectSchema = createSelectSchema(reviews);
export const reviewInsertSchema = createInsertSchema(reviews);
export const reviewUpdateSchema = createUpdateSchema(reviews);

export const relations = defineRelations({ users, urls, reviews }, (r) => ({
    users: {
        urls: r.many.urls(),
        review: r.one.reviews(),
    },
    urls: {
        user: r.one.users({
            from: r.urls.userId,
            to: r.users.id,
        }),
    },
    reviews: {
        user: r.one.users({
            from: r.reviews.userId,
            to: r.users.id,
        }),
    },
}));
