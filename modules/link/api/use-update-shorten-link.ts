import { z } from "zod";
import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { updateFormSchema } from "../schemas";

type ResponseType = Treaty.Data<ReturnType<typeof eden.link>["put"]>;
type RequestType = {
    id: number;
    body: Partial<z.infer<typeof updateFormSchema>>;
};

export const useUpdateShortenLink = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ id, body }) => {
            const { data, error } = await eden.link({ id }).put(body);

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: (data) => {
            toast.success("Shorten link updated");
            queryClient.invalidateQueries({ queryKey: ["recent-links"] });
            queryClient.invalidateQueries({ queryKey: ["links"] });
            queryClient.invalidateQueries({ queryKey: ["link", data.id] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
