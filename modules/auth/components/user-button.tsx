"use client";

import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { LogOutIcon, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCurrent } from "../api/use-current";
import { useLogout } from "../api/use-logout";
import { generateColor } from "@/lib/utils";

export const UserButton = () => {
    const { setTheme } = useTheme();
    const { data: currentUser, isLoading } = useGetCurrent();

    const logout = useLogout();

    if (isLoading) {
        return <Skeleton className="h-12 w-12 rounded-full" />;
    }

    if (!currentUser) {
        return null;
    }

    return (
        <div className="flex flex-row items-center gap-3">
            <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer border-none hover:border-none">
                    <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger>
                            <Avatar>
                                <AvatarFallback
                                    style={{ backgroundColor: generateColor(currentUser.name) }}
                                    className="text-white font-semibold"
                                >
                                    {currentUser.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent side="left" className="min-w-80">
                            <div className="flex flex-col gap-1">
                                <h4 className="font-medium">Email: {currentUser.email}</h4>
                                <p>Name: {currentUser.name}</p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    sideOffset={10}
                    className="w-64 md:w-48 rounded-xl shadow-md bg-background overflow-hidden right-1 top-12 text-sm font-semibold"
                >
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <div className="flex items-center gap-2">
                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                <span>Toggle theme</span>
                            </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="mt-4" onClick={() => logout.mutate()}>
                        <LogOutIcon className="size-5" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
