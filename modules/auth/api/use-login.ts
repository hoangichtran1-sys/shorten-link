import { z } from "zod";
import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { loginSchema } from "../schemas";
import { useRouter } from "next/navigation";

type ResponseType = Treaty.Data<typeof eden.auth.login.post>;
type RequestType = z.infer<typeof loginSchema>;

export const useLogin = () => {
    const router = useRouter();
    const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
        mutationFn: async (body) => {
            const { data, error } = await eden.auth.login.post(body);

            if (error) {
                console.log(error);
                throw error.value;
            }

            return data;
        },
        onSuccess: () => {
            toast.success("Login successfully");
            router.replace("/short-link");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
