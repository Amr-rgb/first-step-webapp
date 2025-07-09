"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Report = {
  id: number;
  childName: string;
  nurseryName: string;
  reportDate: string;
  pdf_url: string;
};

interface ParentReportsColumnsProps {
  onDelete?: (id: number) => void;
}

export const useParentReportsColumns = ({
  onDelete,
}: ParentReportsColumnsProps = {}) => {
  const t = useTranslations("dashboard.tables.reports");
  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "childNumber",
      header: () => (
        <div className="text-[.7rem] font-normal text-center">----</div>
      ),
      cell: ({ row }) => {
        return <div className="text-center">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "childName",
      header: t("fields.childName"),
    },
    {
      accessorKey: "nurseryName",
      header: t("fields.nurseryName"),
    },
    {
      accessorKey: "reportDate",
      header: t("fields.reportDate"),
    },
    {
      accessorKey: "control",
      header: t("fields.control"),
      cell: ({ row }) => {
        const report = row.original;

        const handleDelete = () => {
          if (onDelete) {
            onDelete(report.id);
          }
        };

        return (
          <div className="flex items-center gap-1">
            <Button
              asChild
              variant={"ghost"}
              size={"icon"}
              title={t("actions.view")}
            >
              <Link
                href={`daily-reports/${report.id}`}
                aria-label={t("actions.view")}
              >
                <Eye className="size-4 text-mid-gray" />
              </Link>
            </Button>
            <Button
              asChild
              variant={"ghost"}
              size={"icon"}
              title={t("actions.download")}
            >
              <a
                href={report.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("actions.download")}
              >
                <Download className="size-4 text-mid-gray" />
              </a>
            </Button>
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={handleDelete}
              title={t("actions.delete")}
            >
              <Trash2 className="size-4 text-mid-gray" />
            </Button>
          </div>
        );
      },
    },
  ];

  return columns;
};
