"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { useSecondarySidebarOpen } from "@/store/sidebarStore";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setSelected?: React.Dispatch<React.SetStateAction<TData[]>>;
  globalFilterValue?: string;
  setGlobalFilterValue?: React.Dispatch<React.SetStateAction<string>>;
  pagination?: boolean;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setSelected,
  globalFilterValue,
  setGlobalFilterValue,
  pagination,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { open: sidebarOpen } = useSidebar();
  const secondarySidebarOpen = useSecondarySidebarOpen();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilterValue,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter: globalFilterValue,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    globalFilterFn: "includesString",
  });

  useEffect(() => {
    if (!setSelected) return;
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setSelected(selectedRows);
  }, [rowSelection, table, setSelected]);

  const TableSkeleton = () => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={columns.length} className="p-2">
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="rounded-sm max-w-full overflow-hidden">
      <div
        className={cn(
          "max-w-[calc(100vw-3rem)]",
          sidebarOpen
            ? "md:max-w-[calc(100vw-22rem)]"
            : "md:max-w-[calc(100vw-6rem)]",
          sidebarOpen && secondarySidebarOpen
            ? "xl:max-w-[calc(100vw-40rem)]"
            : !sidebarOpen && secondarySidebarOpen
            ? "xl:max-w-[calc(100vw-25rem)]"
            : "xl:max-w-[calc(100vw-7rem)]"
        )}
      >
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <Table className="mb-1">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {pagination && <DataTablePagination table={table} />}
          </>
        )}
      </div>
    </div>
  );
}
