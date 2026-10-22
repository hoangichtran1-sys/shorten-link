"use server";

import { eden } from "@/lib/rpc";
import { headers } from "next/headers";

export async function getCurrentReview() {
    const headerList = await headers();

    const { data, error } = await eden.review.current.get({
        headers: {
            cookie: headerList.get("cookie") || "",
        },
    });

    if (error) {
        return null;
    }

    return data;
}

export async function getReviews() {
    const { data, error } = await eden.review.get();

    if (error) {
        return [];
    }

    return data;
}
