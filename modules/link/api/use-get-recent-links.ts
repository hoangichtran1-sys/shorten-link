import { Treaty } from "@elysia/eden";
import { eden } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export type GetRecentLinks = Treaty.Data<typeof eden.link.recent.get>;

export const useGetRecentLinks = () => {
    const query = useQuery({
        queryKey: ["recent-links"],
        queryFn: async () => {
            const { data, error } = await eden.link.recent.get();
            if (error) {
                return [];
            }

            return data;
        },
    });

    return query;
};
