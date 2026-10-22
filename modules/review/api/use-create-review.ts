import { z } from "zod";
import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { createReviewSchema } from "../schemas";

type RequestType = z.infer<typeof createReviewSchema>;
type ResponseType = Treaty.Data<typeof eden.review.post>;

export const useCreateReview = () => {
    const router = useRouter();

    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.review.post(body);

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Review created");
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
