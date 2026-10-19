import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";

type ResponseType = Treaty.Data<(typeof eden.link)["bulk-delete"]["post"]>;
type RequestType = {
    ids: number[];
};

export const useBulkDeleteLinks = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.link["bulk-delete"].post(body);

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: (data) => {
            toast.success(`${data.count} links deleted`);
            queryClient.invalidateQueries({ queryKey: ["recent-links"] });
            queryClient.invalidateQueries({ queryKey: ["links"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
