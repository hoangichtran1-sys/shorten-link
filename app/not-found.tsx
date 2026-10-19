"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Error = () => {
    return (
        <div className="h-screen flex flex-col gap-y-4 items-center justify-center">
            <h2 className="text-lg font-semibold">Page Not Found</h2>
            <p className="text-sm font-medium">Could not find requested resource.</p>
            <Button variant="secondary" size="sm" asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    );
};

export default Error;
