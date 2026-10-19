import { useState } from "react";
import { toast } from "sonner";

export const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (value: string) => {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                setIsCopied(true);
                toast.success("Copied to clipboard");
            })
            .catch(() => toast.error("Failed to copy to clipboard"))
            .finally(() => setTimeout(() => setIsCopied(false), 2000));
    };

    return { isCopied, copyToClipboard };
};
