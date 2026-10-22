import { requireAuth } from "@/lib/auth-utils";
import { getCurrentReview, getReviews } from "@/modules/review/actions";
import { ReviewRatingForm } from "@/modules/review/components/review-rating-form";
import { ReviewRatingSummary } from "@/modules/review/components/review-rating-summary";

const Page = async () => {
    await requireAuth();

    const initialData = await getCurrentReview();
    const reviews = await getReviews();

    return (
        <div className="flex h-screen items-start justify-center">
            <div className="w-full max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="col-span-2">
                    <ReviewRatingForm initialData={initialData} />
                </div>
                <div className="col-span-3">
                    <ReviewRatingSummary reviews={reviews} />
                </div>
            </div>
        </div>
    );
};

export default Page;
