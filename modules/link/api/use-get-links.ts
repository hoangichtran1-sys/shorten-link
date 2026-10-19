import { Treaty } from "@elysia/eden";
import { eden } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export type GetLinks = Treaty.Data<typeof eden.link.get>;

export const useGetLinks = () => {
    const query = useQuery({
        queryKey: ["links"],
        queryFn: async () => {
            const { data, error } = await eden.link.get();
            if (error) {
                return [];
            }

            return data;
        },
    });

    return query;
};
