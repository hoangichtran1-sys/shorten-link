"use client";

import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { Star, ThumbsUp, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewReactionToggle } from "./review-reaction-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    type CarouselApi,
} from "@/components/ui/carousel";
import { formatNumber, generateColor } from "@/lib/utils";
import type { GetReviews } from "../api/use-get-reviews";

export const ReviewRatingSummary = ({ reviews }: { reviews: GetReviews }) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!carouselApi) return;

        const updateCurrent = () => setCurrent(carouselApi.selectedScrollSnap());

        carouselApi.on("select", updateCurrent);
        return () => {
            carouselApi.off("select", updateCurrent);
        };
    }, [carouselApi]);

    const scrollTo = (index: number) => {
        if (carouselApi) {
            carouselApi.scrollTo(index);
        }
    };

    const handleLike = (reviewId: number) => {
        setIsLiked((prev) => ({
            ...prev,
            [reviewId]: !prev[reviewId],
        }));
    };

    const averageRating = useMemo(() => {
        const totalReview = reviews.length;
        if (totalReview === 0) return 0;

        const totalRating = reviews.reduce((curr, item) => curr + item.rating, 0);
        return Number((totalRating / totalReview).toFixed(2));
    }, [reviews]);

    const ratingDistribution = useMemo(() => {
        const totalReview = reviews.length;
        const oneStar =
            totalReview > 0
                ? (reviews.filter((rev) => rev.rating === 1).length / totalReview) * 100
                : 0;
        const twoStar =
            totalReview > 0
                ? (reviews.filter((rev) => rev.rating === 2).length / totalReview) * 100
                : 0;
        const threeStar =
            totalReview > 0
                ? (reviews.filter((rev) => rev.rating === 3).length / totalReview) * 100
                : 0;
        const fourStar =
            totalReview > 0
                ? (reviews.filter((rev) => rev.rating === 4).length / totalReview) * 100
                : 0;
        const fiveStar =
            totalReview > 0
                ? (reviews.filter((rev) => rev.rating === 5).length / totalReview) * 100
                : 0;

        return [
            Number(oneStar.toFixed(1)),
            Number(twoStar.toFixed(1)),
            Number(threeStar.toFixed(1)),
            Number(fourStar.toFixed(1)),
            Number(fiveStar.toFixed(1)),
        ];
    }, [reviews]);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center">
                <h2 className="mb-3 text-4xl font-bold">Customer Stories</h2>
                <p className="text-muted-foreground mx-auto max-w-2xl">
                    Discover what our community has to say about their experience. Real stories from
                    real users.
                </p>
            </div>

            <div className="mt-8 mb-12 flex flex-col items-center justify-center gap-8 md:flex-row">
                <div className="text-center">
                    <div className="mb-2 text-6xl font-bold">{averageRating}</div>
                    <div className="flex justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            const isFull = averageRating >= starValue;
                            const isHalf =
                                averageRating >= starValue - 0.5 && averageRating < starValue;
                            return (
                                <div key={i} className="relative size-5">
                                    {/* Empty star */}
                                    <Star className="absolute inset-0" fill="none" />

                                    {/* Full star */}
                                    {isFull && (
                                        <Star className="absolute inset-0" fill="currentColor" />
                                    )}

                                    {/* Half star */}
                                    {isHalf && (
                                        <div className="absolute inset-0 overflow-hidden w-1/2">
                                            <Star fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Based on {formatNumber(reviews.length)} reviews
                    </p>
                </div>

                <div className="bg-border mx-4 hidden h-16 w-px md:block" />

                <div className="flex flex-col gap-1">
                    {ratingDistribution.map((percentage, index) => {
                        const rating = index + 1;
                        return (
                            <div key={index} className="flex items-center gap-2">
                                <div className="flex flex-1 justify-end gap-1">
                                    {Array.from({ length: Number(rating) }).map((_, i) => (
                                        <Star key={i} className="size-3 fill-current" />
                                    ))}
                                </div>
                                <Progress value={percentage} className="h-2 w-32" />
                                <span className="text-muted-foreground w-8 text-sm">
                                    {percentage}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Carousel Section */}
            <div className="relative mx-auto max-w-4xl">
                <Carousel
                    setApi={setCarouselApi}
                    className="w-full"
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        {reviews.map((review) => (
                            <CarouselItem key={review.id}>
                                <div className="p-6 sm:p-8">
                                    <div className="flex flex-col gap-4">
                                        {/* First Row: User Info */}
                                        <div className="flex items-start gap-4">
                                            <Avatar className="bg-muted size-12">
                                                <AvatarFallback
                                                    style={{
                                                        backgroundColor: generateColor(
                                                            review.user?.name,
                                                        ),
                                                    }}
                                                    className="text-white text-lg font-semibold"
                                                >
                                                    {(review.user?.name || "Anonymous").substring(
                                                        0,
                                                        2,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold">
                                                    {review.user?.name || "Anonymous"}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="flex gap-0.5">
                                                        {Array.from({ length: review.rating }).map(
                                                            (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className="size-4 fill-current"
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                    <span className="text-muted-foreground text-sm">
                                                        •
                                                    </span>
                                                    <time className="text-muted-foreground flex items-center text-sm">
                                                        <Calendar className="me-1 size-3.5" />
                                                        {format(review.createdAt, "LLL dd, y")}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Second Row: Review Content and Actions */}
                                        <div>
                                            <p className="text-muted-foreground">
                                                {review.feedback || "No feedback"}
                                            </p>
                                            <div className="mt-4 flex gap-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleLike(review.id)}
                                                    className="h-8 px-3 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                                                >
                                                    <ReviewReactionToggle
                                                        active={!!isLiked[review.id]}
                                                        icon={ThumbsUp}
                                                        iconClassName="size-4"
                                                        activeColorClassName="text-primary"
                                                    />
                                                    {formatNumber(
                                                        review.likes + (isLiked[review.id] ? 1 : 0),
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                                                >
                                                    <MessageCircle className="size-4" />
                                                    {review.comments}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2">
                    {reviews.map((_, i) => (
                        <Button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className={`mx-1 size-2 cursor-pointer rounded-full p-1 transition-all ${current === i ? "bg-foreground w-6" : "bg-muted"}`}
                            aria-label={`Go to review ${i + 1}`}
                            aria-current={current === i ? "step" : undefined}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
