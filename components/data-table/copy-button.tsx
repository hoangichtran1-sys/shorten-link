"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "../ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";

export const CopyButton = ({ value }: { value: string }) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    return (
        <Button
            aria-label="Copy to cliboard"
            variant="ghost"
            size="icon-xs"
            onClick={() => copyToClipboard(value)}
        >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
        </Button>
    );
};
