"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import {
  SubscriptionStatus,
  useSubscriptionStatus,
} from "./shared/subscription-status";

export type Subscription = {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  amount: number;
  status: SubscriptionStatus | string;
};

export function useSubscriptionsColumns() {
  const t = useTranslations("dashboard.tables.subscriptions");
  const { getStatusText, getStatusColorClass } = useSubscriptionStatus();

  const columns: ColumnDef<Subscription>[] = [
    {
      accessorKey: "type",
      header: () => t("headers.type"),
      cell: ({ row }) => <span>{t(`types.${row.getValue("type")}`)}</span>,
    },
    {
      accessorKey: "startDate",
      header: () => t("headers.startDate"),
    },
    {
      accessorKey: "endDate",
      header: () => t("headers.endDate"),
    },

    {
      accessorKey: "paymentMethod",
      header: () => t("headers.paymentMethod"),
    },
    {
      accessorKey: "amount",
      header: () => t("headers.amount"),
      cell: ({ row }) => (
        <div className="space-x-1 rtl:space-x-reverse">
          <span>{row.getValue("amount")}</span>
          <span>{t("currency")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => t("headers.status"),
      cell: ({ row }) => {
        const value = row.getValue("status") as string;
        const color = getStatusColorClass(value);
        const text = getStatusText(value);
        return (
          <div
            className={`text-xs w-fit px-2 py-1 rounded-[4px] select-none ${color}`}
          >
            {text}
          </div>
        );
      },
    },
  ];

  return columns;
}
