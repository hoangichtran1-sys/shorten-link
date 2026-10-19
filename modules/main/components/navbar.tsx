import { UserButton } from "@/modules/auth/components/user-button";
import { MainNav } from "./main-nav";
import Image from "next/image";

export const Navbar = () => {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <Image className="mr-2" height={30} width={30} alt="Logo" src="/logo.svg" />
                <MainNav className="mx-6 flex flex-1 items-center justify-center" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton />
                </div>
            </div>
        </div>
    );
};
