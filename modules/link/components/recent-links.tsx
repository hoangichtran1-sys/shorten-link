"use client";

import { toast } from "sonner";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    ItemActions,
} from "@/components/ui/item";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon, LinkIcon, RefreshCcwIcon, Share2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { GetRecentLinks, useGetRecentLinks } from "../api/use-get-recent-links";

export const RecentLinks = () => {
    const { data, isLoading } = useGetRecentLinks();

    if (data === undefined || isLoading) {
        return (
            <Card className="w-full h-full shadow-none border-none">
                <CardHeader className="flex p-7">
                    <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent className="flex w-full flex-col gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-16 w-full" />
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full shadow-none border-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">Recent Links</CardTitle>
            </CardHeader>
            <CardContent className="flex w-full flex-col gap-6">
                {data.length === 0 && (
                    <Empty className="h-full">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <LinkIcon />
                            </EmptyMedia>
                            <EmptyTitle>No Links</EmptyTitle>
                            <EmptyDescription className="max-w-xs text-pretty">
                                You&apos;re all caught recent link. New link will appear here.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline">
                                <RefreshCcwIcon />
                                Refresh
                            </Button>
                        </EmptyContent>
                    </Empty>
                )}
                {data.map((item) => (
                    <RecentLinkItem key={item.id} data={item} />
                ))}
            </CardContent>
        </Card>
    );
};

interface RecentLinkItemProps {
    data: GetRecentLinks[number];
}

const RecentLinkItem = ({ data }: RecentLinkItemProps) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    return (
        <Item className="bg-secondary">
            <ItemMedia variant="icon">
                <LinkIcon />
            </ItemMedia>
            <ItemContent>
                {data.name ? (
                    <ItemTitle>{data.name}</ItemTitle>
                ) : (
                    <ItemTitle className="text-muted-foreground italic">Untitled</ItemTitle>
                )}
                <ItemDescription><span className="line-clamp-1 text-xs">{data.shortLink}</span></ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button
                    onClick={() => copyToClipboard(data.shortLink)}
                    size="icon-xs"
                    variant="ghost"
                >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                </Button>
                <Button
                    onClick={async () => {
                        try {
                            await navigator.share({
                                title: data.name || "Untitled",
                                text: data.shortLink,
                                url: window.location.href,
                            });
                        } catch {
                            toast.error("Share link failed");
                        }
                    }}
                    size="icon-xs"
                    variant="ghost"
                >
                    <Share2Icon />
                </Button>
            </ItemActions>
        </Item>
    );
};
