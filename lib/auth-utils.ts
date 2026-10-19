"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eden } from "./rpc";

export const requireAuth = async () => {
    const headerList = await headers();
    const { data, error } = await eden.auth.current.get({
        headers: {
            cookie: headerList.get("cookie") || "",
        },
    });

    if (error) {
        redirect("/login");
    }

    return data;
};

export const requireUnauth = async () => {
    const headerList = await headers();
    const { data } = await eden.auth.current.get({
        headers: {
            cookie: headerList.get("cookie") || "",
        },
    });

    console.log(data);

    if (data) {
        redirect("/");
    }
};
