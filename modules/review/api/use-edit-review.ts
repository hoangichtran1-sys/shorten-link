import { z } from "zod";
import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { updateReviewSchema } from "../schemas";

type RequestType = {
    body: Partial<z.infer<typeof updateReviewSchema>>;
    id: number;
};
type ResponseType = Treaty.Data<ReturnType<typeof eden.review>["put"]>;

export const useEditReview = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ body, id }) => {
            const { data, error } = await eden.review({ id }).put(body);

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Review updated");
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            queryClient.invalidateQueries({ queryKey: ["review"] });
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
