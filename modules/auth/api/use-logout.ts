import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";
import { ErrorResponse } from "@/types/error";
import { useRouter } from "next/navigation";

export const useLogout = () => {
    const router = useRouter();
    const mutation = useMutation<null, ErrorResponse>({
        mutationFn: async () => {
            const { error } = await eden.auth.logout.post();

            if (error) {
                throw error.value;
            }

            return null;
        },
        onSuccess: () => {
            toast.success("Logout successfully");
            router.replace("/login");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};
