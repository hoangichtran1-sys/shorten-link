import { requireAuth } from "@/lib/auth-utils";
import { CreateShortenLinkForm } from "@/modules/link/components/create-shorten-link-form";
import { RecentLinks } from "@/modules/link/components/recent-links";

const Page = async () => {
    await requireAuth();

    return (
        <div className="flex h-screen items-start justify-center">
            <div className="w-full max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CreateShortenLinkForm />
                <RecentLinks />
            </div>
        </div>
    );
};

export default Page;
