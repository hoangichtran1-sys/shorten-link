import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";

type ResponseType = Treaty.Data<typeof eden.other.subscriber.post>;
type RequestType = { email: string };

export const useSubscriber = () => {
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async ({ email }) => {
            const { data, error } = await eden.other.subscriber.post({ email });

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Subscriber successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
