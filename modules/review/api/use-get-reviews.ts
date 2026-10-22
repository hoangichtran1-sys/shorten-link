import { Treaty } from "@elysia/eden";
import { useQuery } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";

export type GetReviews = Treaty.Data<typeof eden.review.get>;

export const useGetReviews = () => {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const { data, error } = await eden.review.get();

            if (error) {
                return [];
            }

            return data;
        },
    });
};
