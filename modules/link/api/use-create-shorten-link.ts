import { z } from "zod";
import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { createFormSchema } from "../schemas";

type ResponseType = Treaty.Data<typeof eden.link.post>;
type RequestType = z.infer<typeof createFormSchema>;

export const useCreatShortenLink = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.link.post(body);

            if (error) {
                console.log(error);
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Shorten link created");
            queryClient.invalidateQueries({ queryKey: ["recent-links"] });
            queryClient.invalidateQueries({ queryKey: ["links"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
