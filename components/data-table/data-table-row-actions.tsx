"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UpdateLinkSheet } from "@/modules/link/components/update-link-sheet";
import { GetLinks } from "@/modules/link/api/use-get-links";
import { useDeleteShortenLink } from "@/modules/link/api/use-delete-shorten-link";

interface DataTableRowActionsProps {
    data: GetLinks[number];
}

export function DataTableRowActions({ data }: DataTableRowActionsProps) {
    const [openSheet, setOpenSheet] = useState(false);

    const remove = useDeleteShortenLink();

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will permanently remove this link",
    );

    const handleDelete = async () => {
        const ok = await confirmRemove();
        if (!ok) return;

        await remove.mutateAsync({ id: data.id });
    };

    return (
        <>
            <RemoveConfirmation />
            <UpdateLinkSheet open={openSheet} onOpenChange={setOpenSheet} initialData={data} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() =>
                            navigator.clipboard
                                .writeText(
                                    `${process.env.NEXT_PUBLIC_APP_URL}/api/shorten/${data.shortCode}`,
                                )
                                .then(() => toast.success("Copy link to clipboard"))
                        }
                    >
                        Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            navigator.share({
                                title: data.name || "Untitled",
                                text: `${process.env.NEXT_PUBLIC_APP_URL}/api/shorten/${data.shortCode}`,
                                url: window.location.href,
                            })
                        }
                    >
                        Share link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenSheet(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} variant="destructive">
                        Delete
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
