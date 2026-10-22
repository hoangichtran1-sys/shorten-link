import { useQuery } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";

export const useGetUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data, error } = await eden.other["user-with-review"].get();

            if (error) {
                return [];
            }

            return data;
        },
    });
};
