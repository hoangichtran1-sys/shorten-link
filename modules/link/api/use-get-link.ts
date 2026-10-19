import { eden } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetLinkProps {
    id: number;
}

export const useGetLink = ({ id }: UseGetLinkProps) => {
    const query = useQuery({
        queryKey: ["link", id],
        queryFn: async () => {
            const { data, error } = await eden.link({ id }).get();
            if (error) {
                return null;
            }

            return data;
        },
    });

    return query;
};
