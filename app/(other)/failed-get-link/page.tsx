"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [value, setValue] = useState("");
    return (
        <Empty>
            <EmptyHeader>
                <EmptyTitle>404 - Not Found</EmptyTitle>
                <EmptyDescription>
                    The page you&apos;re looking for doesn&apos;t exist. Try searching for what you
                    need below.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <InputGroup className="sm:w-3/4">
                    <InputGroupInput
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Try searching for pages..."
                    />
                    <InputGroupAddon>
                        <SearchIcon
                            className="hover:text-primary cursor-pointer"
                            onClick={() => router.push(`/${value}`)}
                        />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <Kbd>/</Kbd>
                    </InputGroupAddon>
                </InputGroup>
                <EmptyDescription>
                    Need help? <Link href="/">Contact support</Link>
                </EmptyDescription>
            </EmptyContent>
        </Empty>
    );
}
