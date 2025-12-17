"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Download } from "lucide-react";

// Withdrawal status types
export type WithdrawStatus = "pending" | "accepted" | "rejected";

// Type definitions based on the API response
export type WithdrawRequest = {
  id: number;
  center_id: number;
  amount: string;
  status: WithdrawStatus;
  center_name: string;
  time_of_accepted: string | null;
  created_at?: string;
};

const getStatusColorClass = (status: WithdrawStatus): string => {
  const colorMap: Record<WithdrawStatus, string> = {
    accepted: "bg-success text-white",
    pending: "bg-warning text-white",
    rejected: "bg-danger text-white",
  };
  return colorMap[status] || "bg-gray-400 text-white";
};

export const useWalletWithdrawRequestsColumns = () => {
  const t = useTranslations("wallet.withdrawRequests");

  const getStatusText = (status: WithdrawStatus): string => {
    return t(`status.${status}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "d / M / yyyy", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: string) => {
    // Remove decimal places if they are .00
    const numAmount = parseFloat(amount);
    return Number.isInteger(numAmount) ? numAmount : numAmount.toFixed(2);
  };

  const columns: ColumnDef<WithdrawRequest>[] = [
    // 1. Withdraw ID (رقم السحب)
    {
      accessorKey: "id",
      header: () => (
        <div className="text-center">{t("headers.withdrawId")}</div>
      ),
      cell: ({ row }) => {
        return <div className="text-center font-medium">{row.original.id}</div>;
      },
    },
    // 2. Request Date & Time (تاريخ ووقت طلب السحب)
    {
      id: "requestDate",
      header: () => (
        <div className="text-center">{t("headers.requestDate")}</div>
      ),
      cell: ({ row }) => {
        const dateString =
          row.original.time_of_accepted || row.original.created_at;
        return (
          <div className="text-center">{formatDate(dateString || null)}</div>
        );
      },
    },
    // 3. Withdraw Amount (مبلغ السحب)
    {
      accessorKey: "amount",
      header: () => <div className="text-center">{t("headers.amount")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <span>{formatAmount(row.original.amount)}</span>
            <span className="mx-1">{t("currency")}</span>
          </div>
        );
      },
    },
    // 4. Withdrawal Method (طريقة السحب)
    {
      id: "method",
      header: () => <div className="text-center">{t("headers.method")}</div>,
      cell: () => {
        // Currently hardcoded as "ميسر" based on the design
        return <div className="text-center">{t("methods.moyasar")}</div>;
      },
    },
    // 5. Transfer Status (حالة التحويل)
    {
      accessorKey: "status",
      header: () => <div className="text-center">{t("headers.status")}</div>,
      cell: ({ row }) => {
        const status = row.original.status as WithdrawStatus;
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
    // 6. Transfer Receipt (إيصال التحويل)
    {
      id: "receipt",
      header: () => <div className="text-center">{t("headers.receipt")}</div>,
      cell: ({ row }) => {
        // Only show download icon if status is accepted
        const isAccepted = row.original.status === "accepted";

        return (
          <div className="flex justify-center">
            {isAccepted ? (
              <button
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                onClick={() => {
                  // TODO: Implement receipt download
                  console.log("Download receipt for:", row.original.id);
                }}
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};
