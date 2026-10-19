import { Redis } from "@upstash/redis";
import { env } from "./env";

const globalForRedis = global as unknown as {
    redisConnection: Redis | undefined;
};

export const redisClient =
    globalForRedis.redisConnection ??
    new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });

if (env.NODE_ENV !== "production") {
    globalForRedis.redisConnection = redisClient;
}
