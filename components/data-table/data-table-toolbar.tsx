"use client";

import { type ReactTable, type RowData } from "@tanstack/react-table";
import { DownloadIcon, TrashIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { type DataTableFeatures } from "./data-table-features";
import { exportTableToCSV } from "./export";

interface DataTableToolbarProps<TData extends RowData> {
    table: ReactTable<DataTableFeatures, TData>;
    onDelete?: (rows: TData[]) => void;
    disabled?: boolean;
}

export function DataTableToolbar<TData extends RowData>({
    table,
    onDelete,
    disabled,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.state.columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
                <Input
                    placeholder="Filter link..."
                    value={(table.getColumn("longUrl")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("longUrl")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {isFiltered && (
                    <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <DataTableViewOptions table={table} />
                {table.getFilteredSelectedRowModel().rows.length > 0 && onDelete && (
                    <Button
                        onClick={() => {
                            const selectedRows = table.getFilteredSelectedRowModel().rows;
                            onDelete(selectedRows.map((row) => row.original));
                            table.resetRowSelection();
                        }}
                        disabled={disabled}
                        size="sm"
                        variant="outline"
                        className="ml-auto font-normal text-xs"
                    >
                        <TrashIcon className="size-4" />
                        <span className="hidden lg:block">Delete</span> (
                        {table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                )}
                <Button
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        exportTableToCSV(table, {
                            excludeColumns: ["select", "actions"],
                            onlySelected: true,
                        });
                    }}
                >
                    <DownloadIcon />
                    Export
                </Button>
            </div>
        </div>
    );
}
