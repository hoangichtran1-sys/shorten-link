"use client";

import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { StarIcon, SendIcon } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupText,
    InputGroupTextarea,
    InputGroupAddon,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { createReviewSchema } from "../schemas";
import { useCreateReview } from "../api/use-create-review";
import type { GetReview } from "../api/use-get-review";
import { useEditReview } from "../api/use-edit-review";

type CreateFormValues = z.infer<typeof createReviewSchema>;

interface ReviewRatingFormProps {
    initialData: GetReview | null;
}

export const ReviewRatingForm = ({ initialData }: ReviewRatingFormProps) => {
    const [rating, setRating] = useState<number>(initialData?.rating || 0);
    const [hoveredStar, setHoveredStar] = useState<number>(initialData?.rating || 0);

    const create = useCreateReview();
    const edit = useEditReview();

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(createReviewSchema),
        defaultValues: {
            rating: initialData?.rating || 0,
            feedback: initialData?.feedback || null,
        },
    });

    const onSubmit = (values: CreateFormValues) => {
        if (initialData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateData: any = {};

            const dirtyFields = form.formState.dirtyFields;
            Object.keys(dirtyFields).forEach((field) => {
                const key = field as keyof typeof values;
                updateData[key] = values[key];
            });

            edit.mutate(
                {
                    body: updateData,
                    id: initialData.id,
                },
                {
                    onSuccess: (data) => {
                        form.reset({
                            rating: data.rating,
                            feedback: data.feedback,
                        });
                    },
                },
            );
        } else {
            create.mutate(values, {
                onSuccess: (data) => {
                    form.reset({
                        rating: data.rating,
                        feedback: data.feedback,
                    });
                },
            });
        }
    };

    const feedback = useWatch({
        control: form.control,
        name: "feedback",
    });

    const submittingButtonText = !!initialData ? "Editting..." : "Submitting...";
    const submitButtonText = !!initialData ? "Edit Review" : "Submit Review";

    const isSubmitting = create.isPending || edit.isPending;
    const disabled = !form.formState.isDirty || create.isPending || edit.isPending;

    return (
        <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
                <CardHeader>
                    <CardTitle id="review-form-heading">How was your experience?</CardTitle>
                    <CardDescription>
                        Please rate your experience and share any additional feedback.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="rating"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="sr-only" htmlFor={field.name}>
                                            Rating
                                        </FieldLabel>
                                        <div
                                            className="flex gap-1"
                                            role="radiogroup"
                                            aria-label={field.name}
                                        >
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Button
                                                    variant="ghost"
                                                    key={star}
                                                    type="button"
                                                    name={field.name}
                                                    id={field.name}
                                                    onClick={() => {
                                                        setRating(star);
                                                        form.setValue("rating", star, {
                                                            shouldDirty: true,
                                                            shouldValidate: true,
                                                            shouldTouch: true,
                                                        });
                                                    }}
                                                    onMouseEnter={() => setHoveredStar(star)}
                                                    className="h-9 px-4 py-2 focus-visible:ring-ring cursor-pointer rounded-full p-1! transition-transform hover:scale-110 hover:bg-transparent focus:outline-hidden focus-visible:ring-2"
                                                    onMouseLeave={() => setHoveredStar(0)}
                                                    aria-pressed={rating === star}
                                                    aria-label={`Rate ${star} ${star === 1 ? "star" : "stars"}`}
                                                >
                                                    <StarIcon
                                                        className={cn(
                                                            "size-6",
                                                            (hoveredStar || rating) >= star
                                                                ? "fill-foreground"
                                                                : "",
                                                        )}
                                                    />
                                                </Button>
                                            ))}
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="feedback"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Additional feedback (optional)
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                value={field.value || ""}
                                                className="min-h-36"
                                                placeholder="Tell us more about your experience..."
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <InputGroupAddon align="block-end">
                                                <InputGroupText>
                                                    {feedback ? feedback.trim().length : 0}/1000
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                )}
                            />

                            <Button
                                type="submit"
                                className="h-9 px-4 py-2 w-full cursor-pointer"
                                disabled={disabled}
                            >
                                {isSubmitting ? submittingButtonText : submitButtonText}
                                {isSubmitting && <SendIcon className="size-4" />}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
