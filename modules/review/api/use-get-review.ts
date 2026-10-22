import { Treaty } from "@elysia/eden";
import { useQuery } from "@tanstack/react-query";
import { eden } from "@/lib/rpc";

export type GetReview = Treaty.Data<typeof eden.review.current.get>;

export const useGetReview = () => {
    return useQuery({
        queryKey: ["review"],
        queryFn: async () => {
            const { data, error } = await eden.review.current.get();

            if (error) {
                return null;
            }

            return data;
        },
    });
};
