"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";
import { useGetUsers } from "../api/use-get-users";
import { useGetReviews } from "@/modules/review/api/use-get-reviews";
import { useMemo } from "react";
import { generateColor } from "@/lib/utils";

export const HeroSection = () => {
    const router = useRouter();

    const { data: users } = useGetUsers();

    const { data: reviews } = useGetReviews();

    const [reviewers, remainingCount] = useMemo(() => {
        if (!users) return [[], 0];
        if (users.length > 3) {
            const membersDisplay = users.slice(0, 3);
            const membersRemainingCount = users.slice(3).length;
            return [membersDisplay, membersRemainingCount];
        }

        return [users, 0];
    }, [users]);

    return (
        <section className="w-full py-12 lg:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="flex flex-col gap-8 text-center lg:text-start">
                        <header className="flex flex-col gap-4">
                            <ModeToggle />
                            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
                                Welcome to ShadcnStore
                            </h1>
                            <p className="text-muted-foreground text-balance md:text-lg">
                                Discover our premium collection of UI components and templates to
                                build beautiful, accessible web applications faster than ever.
                            </p>
                        </header>

                        <Button
                            size="lg"
                            className="h-10 px-8 cursor-pointer text-base w-fit self-center lg:self-start"
                            onClick={() => router.push("/short-link")}
                        >
                            Get Started
                        </Button>

                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <AvatarGroup>
                                {reviewers.map((reviewer) => (
                                    <Avatar
                                        key={reviewer.email}
                                        className="ring-background bg-muted size-10 ring-2"
                                    >
                                        <AvatarFallback
                                            style={{
                                                backgroundColor: generateColor(reviewer.name),
                                            }}
                                            className="text-md text-white font-semibold"
                                        >
                                            {reviewer.name.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {remainingCount > 0 && (
                                    <AvatarGroupCount>+{remainingCount}</AvatarGroupCount>
                                )}
                            </AvatarGroup>

                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center justify-center gap-1 lg:justify-start">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="fill-foreground size-4" />
                                    ))}
                                    <span className="ms-2 text-sm font-medium">
                                        ({reviews?.length || 0})
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Trusted by 1000+ developers
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="aspect-4/3 overflow-hidden rounded-xl border">
                        <Image
                            src="/hero.png"
                            alt="Hero Image"
                            className="size-full object-cover dark:brightness-[0.95] dark:invert"
                            width={800}
                            height={600}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
