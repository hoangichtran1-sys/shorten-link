"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/components/data-table/columns";
import { useBulkDeleteLinks } from "../api/use-bulk-delete-links";
import { useGetLinks } from "../api/use-get-links";

export const ManageLink = () => {
    const { data, isLoading } = useGetLinks();

    const bulkDelete = useBulkDeleteLinks();

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        "The following action will permanently remove links",
    );

    if (data === undefined || isLoading) {
        return (
            <div className="mx-auto max-w-7xl">
                <div className="max-w-full flex flex-col gap-y-2 mt-6">
                    <Skeleton className="w-36 h-6" />
                    <Skeleton className="w-48 h-4" />
                </div>
                <Separator className="mb-2 mt-2" />
                <div className="max-w-full">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-x-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                    </div>
                    <div className="flex max-w-full flex-col gap-4">
                        {Array.from({ length: 9 }).map((_, index1) => (
                            <div key={`row-${index1}`}>
                                <div className="flex gap-20">
                                    {false && <Skeleton className="h-6 w-6 rounded-md" />}
                                    {Array.from({ length: 9 }).map((_, index2) => (
                                        <Skeleton key={`col-${index2}`} className="h-6 w-30" />
                                    ))}
                                    {index1 !== 0 && <Skeleton className="h-4 w-2 rounded-md" />}
                                </div>
                                {index1 === 0 && <Separator className="mb-2 mt-2" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <RemoveConfirmation />
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Links ({data.length})</h2>
                <p className="text-sm text-muted-foreground">Manage links</p>
            </div>
            <Separator />
            <DataTable
                data={data}
                columns={columns}
                disabled={bulkDelete.isPending}
                onDelete={async (data) => {
                    const ok = await confirmRemove();
                    if (!ok) return;

                    const ids = data.map((item) => item.id);

                    await bulkDelete.mutateAsync({ ids });
                }}
            />
        </>
    );
};
