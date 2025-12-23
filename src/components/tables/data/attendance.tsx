"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { format, parse, isValid } from "date-fns";

export type Attendance = {
  child_id: number;
  check_in: string | null;
  check_out: string | null;
  temperature: string;
  child_name: string;
  branch_name: string;
  created_date: string;
  updated_date: string;
};

export function useAttendanceColumns() {
  const t = useTranslations("dashboard.center.gate.table");

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "-";
    try {
      // Try parsing common formats
      const formats = [
        "yyyy-MM-dd HH:mm:ss",
        "yyyy-MM-dd'T'HH:mm:ss",
        "HH:mm:ss",
      ];
      let parsedDate: Date | undefined;

      for (const fmt of formats) {
        const d = parse(timeStr, fmt, new Date());
        if (isValid(d)) {
          parsedDate = d;
          break;
        }
      }

      if (parsedDate) {
        return format(parsedDate, "hh:mm a");
      }
      return timeStr;
    } catch (e) {
      return timeStr;
    }
  };

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: "child_id",
      header: () => t("number"),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "child_name",
      header: () => t("childName"),
    },
    {
      accessorKey: "created_date",
      header: () => t("date"),
    },
    {
      accessorKey: "check_in",
      header: () => t("arrivalTime"),
      cell: ({ row }) => formatTime(row.original.check_in),
    },
    {
      accessorKey: "temperature",
      header: () => t("temperature"),
      cell: ({ row }) =>
        row.original.temperature ? `${row.original.temperature}°` : "-",
    },
    {
      accessorKey: "check_out",
      header: () => t("departureTime"),
      cell: ({ row }) => formatTime(row.original.check_out),
    },
    {
      accessorKey: "branch_name",
      header: () => t("branch"),
    },
  ];

  return columns;
}
