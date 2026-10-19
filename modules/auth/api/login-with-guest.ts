import { toast } from "sonner";
import { Treaty } from "@elysia/eden";
import { useMutation } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { useRouter } from "next/navigation";

type ResponseType = Treaty.Data<(typeof eden.auth)["login-with-guest"]["post"]>;
export const useLoginWithGuest = () => {
    const router = useRouter();
    const mutation = useMutation<ResponseType, ErrorResponse>({
        mutationFn: async () => {
            const { data, error } = await eden.auth["login-with-guest"]["post"]();

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
