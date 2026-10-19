import { eden } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrent = () => {
    const query = useQuery({
        queryKey: ["current"],
        queryFn: async () => {
            const { data, error } = await eden.auth.current.get();
            if (error) {
                return null;
            }

            return data;
        },
    });

    return query;
};
