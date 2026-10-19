"use client";

import { format } from "date-fns";
import { createColumnHelper } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Hint } from "@/components/hint";
import { CopyButton } from "./copy-button";

import { type GetLinks } from "@/modules/link/api/use-get-links";
import { DataTableColumnHeader } from "./data-table-column-header";
import { type DataTableFeatures } from "./data-table-features";
import { DataTableRowActions } from "./data-table-row-actions";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, GetLinks[number]>();

export const columns = columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
            const name = row.original.name;

            if (!name) {
                return <div className="font-normal italic text-muted-foreground">Untitled</div>;
            }

            return <div className="line-clamp-1 font-medium">{name}</div>;
        },
    }),
    columnHelper.accessor("longUrl", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Long URL" />,
        cell: ({ row }) => {
            const longUrl = row.original.longUrl;

            return (
                <div className="flex items-center gap-2 max-w-md">
                    <Hint text={longUrl}>
                        <p className="truncate font-medium">{longUrl}</p>
                    </Hint>
                    <CopyButton value={longUrl} />
                </div>
            );
        },
    }),
    columnHelper.accessor("shortCode", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => {
            const code = row.original.shortCode;
            return (
                <div className="flex items-center gap-2">
                    <p className="line-clamp-2 font-medium">{code}</p>
                    <CopyButton value={code} />
                </div>
            );
        },
    }),
    columnHelper.accessor("clicks", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Click Count" />,
        cell: ({ row }) => {
            const count = row.original.clicks;
            return (
                <div className="w-[50%]">
                    <p className="line-clamp-1 text-sm font-semibold">{count}</p>
                </div>
            );
        },
    }),
    columnHelper.accessor("createdAt", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
        cell: ({ row }) => {
            const createdAtFormatted = format(row.original.createdAt, "MMMM do, yyyy");
            return <p className="line-clamp-1">{createdAtFormatted}</p>;
        },
    }),
    columnHelper.display({
        id: "actions",
        cell: ({ row }) => <DataTableRowActions data={row.original} />,
    }),
]);
