import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";

export const AuthLayout = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10",
                className,
            )}
        >
            <div className="flex w-full max-w-sm flex-col gap-6 z-10">
                <Link
                    href="/"
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <Image src="/logo.svg" alt="Logo" width={30} height={30} />
                </Link>
                {children}
            </div>
        </div>
    );
};
