import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";

type ResponseType = Treaty.Data<ReturnType<typeof eden.link>["delete"]>;
type RequestType = {
    id: number;
};

export const useDeleteShortenLink = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ id }) => {
            const { data, error } = await eden.link({ id }).delete();

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Shorten link deleted");
            queryClient.invalidateQueries({ queryKey: ["recent-links"] });
            queryClient.invalidateQueries({ queryKey: ["links"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
