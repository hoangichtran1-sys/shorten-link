import { z } from "zod";
import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { contactFormSchema } from "../schemas";

type ResponseType = Treaty.Data<typeof eden.other.contact.post>;
type RequestType = z.infer<typeof contactFormSchema>;

export const useSendContact = () => {
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.other.contact.post(body);

            if (error) {
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Send contact successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
