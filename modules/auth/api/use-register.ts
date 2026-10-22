import { z } from "zod";
import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { registerSchema } from "../schemas";
import { useRouter } from "next/navigation";

type ResponseType = Treaty.Data<typeof eden.auth.register.post>;
type RequestType = z.infer<typeof registerSchema>;

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.auth.register.post(body);

            if (error) {
                console.log(error);
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Register successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            router.replace("/short-link");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
