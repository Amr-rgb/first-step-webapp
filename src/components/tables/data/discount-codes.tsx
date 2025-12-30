"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

export type DiscountCodeStatus = "active" | "notStarted" | "paused" | "expired";

export type DiscountCode = {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  discountPercentage: number;
  discountValue: number;
  status: DiscountCodeStatus;
};

const getStatusColorClass = (status: DiscountCodeStatus): string => {
  const colorMap: Record<DiscountCodeStatus, string> = {
    active: "bg-success text-white",
    notStarted: "bg-warning text-white",
    paused: "bg-gray-400 text-white",
    expired: "bg-danger text-white",
  };
  return colorMap[status] || "bg-gray-400 text-white";
};

export const useDiscountCodesColumns = ({
  onEdit,
  onView,
}: {
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
} = {}) => {
  const t = useTranslations("discountCodes");

  const getStatusText = (status: DiscountCodeStatus): string => {
    return t(`filters.${status}`);
  };

  const columns: ColumnDef<DiscountCode>[] = [
    // 1. Code
    {
      accessorKey: "code",
      header: () => <div className="text-center">{t("table.code")}</div>,
      cell: ({ row }) => {
        const code = row.getValue("code") as string;
        return <div className="text-center font-medium">{code}</div>;
      },
    },
    // 2. Start Date
    {
      accessorKey: "startDate",
      header: () => <div className="text-center">{t("table.startDate")}</div>,
      cell: ({ row }) => {
        const date = row.getValue("startDate") as string;
        return <div className="text-center">{date}</div>;
      },
    },
    // 3. End Date
    {
      accessorKey: "endDate",
      header: () => <div className="text-center">{t("table.endDate")}</div>,
      cell: ({ row }) => {
        const date = row.getValue("endDate") as string;
        return <div className="text-center">{date}</div>;
      },
    },
    // 4. Usage Limit
    {
      accessorKey: "usageLimit",
      header: () => <div className="text-center">{t("table.usageLimit")}</div>,
      cell: ({ row }) => {
        const limit = row.getValue("usageLimit") as number;
        return (
          <div className="text-center">
            {limit} {t("table.usage")}
          </div>
        );
      },
    },
    // 7. Discount Percentage
    {
      accessorKey: "discountPercentage",
      header: () => (
        <div className="text-center">{t("table.discountPercentage")}</div>
      ),
      cell: ({ row }) => {
        const percentage = row.getValue("discountPercentage") as number;
        return (
          <div className="text-center">
            <span>{percentage}</span>
            <span className="mx-1">{t("table.percentage")}</span>
          </div>
        );
      },
    },
    // 8. Discount Value
    {
      accessorKey: "discountValue",
      header: () => (
        <div className="text-center">{t("table.discountValue")}</div>
      ),
      cell: ({ row }) => {
        const value = row.getValue("discountValue") as number;
        return (
          <div className="text-center">
            <span>{value}</span>
            <span className="mx-1">{t("table.currency")}</span>
          </div>
        );
      },
    },
    // 9. Status
    {
      accessorKey: "status",
      header: () => <div className="text-center">{t("table.status")}</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as DiscountCodeStatus;
        const colorClasses = getStatusColorClass(status);
        const text = getStatusText(status);

        return (
          <div className="flex justify-center">
            <div
              className={`text-xs px-3 py-1.5 rounded-[4px] select-none ${colorClasses} whitespace-nowrap min-w-[80px] text-center`}
            >
              {text}
            </div>
          </div>
        );
      },
    },
    // 10. Actions
    {
      id: "actions",
      header: () => <div className="text-center">{t("table.actions")}</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              onClick={() => onView?.(row.original.id)}
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              onClick={() => onEdit?.(row.original.id)}
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        );
      },
    },
  ];

  return columns;
};
