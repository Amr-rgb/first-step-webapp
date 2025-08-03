"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Eye, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Report = {
  id: number;
  parentName: string;
  phone: string;
  childs: { id: string; name: string }[];
  reportDate: string;
};

interface SelectedChild {
  reportId: string;
  reportDate: string;
}

interface ReportIdMap {
  reportId: number;
  reportDate: string;
}

export function useCenterReportsColumns(
  selectedChildMap: Record<number, SelectedChild>,
  setSelectedChildMap: React.Dispatch<
    React.SetStateAction<Record<number, SelectedChild>>
  >,
  reportIdMap: Record<string, ReportIdMap>
) {
  const t = useTranslations("dashboard.tables.center-reports");

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "parentName",
      header: () => t("headers.parentName"),
    },
    {
      accessorKey: "phone",
      header: () => t("headers.phone"),
    },
    {
      accessorKey: "childs",
      header: () => t("headers.child"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const childs = row.original.childs;

        const selectedChild = selectedChildMap[parentId] ?? {
          reportId: childs[0]?.id ?? "",
          reportDate: reportIdMap[childs[0]?.id]?.reportDate ?? "",
        };

        return (
          <select
            className="text-xs px-2 py-1 rounded bg-info text-white"
            value={selectedChild.reportId}
            onChange={(e) => {
              const childId = e.target.value;
              setSelectedChildMap((prev) => ({
                ...prev,
                [parentId]: {
                  reportId: childId,
                  reportDate: reportIdMap[childId]?.reportDate ?? "",
                },
              }));
            }}
          >
            {childs.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      accessorKey: "reportDate",
      header: () => t("headers.reportDate"),
      cell: ({ row }) => {
        const parent = row.original;
        const selectedChild = selectedChildMap[parent.id] ?? {
          reportId: parent.childs[0]?.id ?? "",
          reportDate: reportIdMap[parent.childs[0]?.id]?.reportDate ?? "",
        };
        return selectedChild?.reportDate ?? row.original.reportDate;
      },
    },
    {
      accessorKey: "control",
      header: () => t("headers.control"),
      cell: ({ row }) => {
        const parent = row.original;
        const selectedChild = selectedChildMap[parent.id] ?? {
          reportId: parent.childs[0]?.id ?? "",
          reportDate: reportIdMap[parent.childs[0]?.id]?.reportDate ?? "",
        };
        const reportId = reportIdMap[selectedChild.reportId]?.reportId;

        return (
          <div className="flex items-center gap-1">
            <Button asChild variant={"ghost"} size={"icon"}>
              <Link href={`daily-reports/${reportId}`}>
                <Eye className="size-4 text-mid-gray" />
              </Link>
            </Button>
            <Button asChild variant={"ghost"} size={"icon"}>
              <a target="_blank" href={`/api/daily-reports/${reportId}/pdf`}>
                <Download className="size-4 text-mid-gray" />
              </a>
            </Button>
            {/* <Button variant={"ghost"} size={"icon"}>
              <Trash2 className="size-4 text-mid-gray" />
            </Button> */}
          </div>
        );
      },
    },
  ];

  return columns;
}
