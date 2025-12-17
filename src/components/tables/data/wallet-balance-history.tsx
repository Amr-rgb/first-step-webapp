"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Type definitions based on the API response
export type BalanceHistoryPayment = {
  order_id: number;
  amount: string;
  payment_status: string;
  paid_at: string;
};

export type BalanceHistoryItem = {
  enrollment_id: number;
  status: string;
  enrollment_type: string | null;
  price_amount: number;
  enrollment_date: string;
  parent_name: string | null;
  branch_name: string;
  branch_id: number;
  balance_before: number;
  balance_after: number;
  pricing: {
    original_amount: number;
    discount: number;
    final_amount: number;
    discount_type: string | null;
  };
  payments: BalanceHistoryPayment[];
};

export const useWalletBalanceHistoryColumns = () => {
  const t = useTranslations("wallet.balanceHistory");

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy - h:mm a", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const columns: ColumnDef<BalanceHistoryItem>[] = [
    // 1. Enrollment ID (رقم الاشتراك)
    {
      accessorKey: "enrollment_id",
      header: () => (
        <div className="text-center">{t("headers.enrollmentId")}</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.original.enrollment_id}
          </div>
        );
      },
    },
    // 2. Payment Date & Time (تاريخ ووقت الدفع)
    {
      id: "paymentDate",
      header: () => (
        <div className="text-center">{t("headers.paymentDate")}</div>
      ),
      cell: ({ row }) => {
        // Get the latest payment date
        const payments = row.original.payments;
        const latestPayment =
          payments && payments.length > 0
            ? payments[payments.length - 1]
            : null;
        const dateString =
          latestPayment?.paid_at || row.original.enrollment_date;
        return <div className="text-center">{formatDate(dateString)}</div>;
      },
    },
    // 3. Branch (الفرع)
    {
      accessorKey: "branch_name",
      header: () => <div className="text-center">{t("headers.branch")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.branch_name || "-"}</div>
        );
      },
    },
    // 4. Parent Name (اسم ولي الأمر)
    {
      accessorKey: "parent_name",
      header: () => (
        <div className="text-center">{t("headers.parentName")}</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.original.parent_name || "-"}</div>
        );
      },
    },
    // 5. Balance Before (الرصيد قبل)
    {
      accessorKey: "balance_before",
      header: () => (
        <div className="text-center">{t("headers.balanceBefore")}</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <span>{row.original.balance_before}</span>
            <span className="sar">$</span>
          </div>
        );
      },
    },
    // 6. Amount (المبلغ)
    {
      id: "amount",
      header: () => <div className="text-center">{t("headers.amount")}</div>,
      cell: ({ row }) => {
        const amount =
          row.original.pricing?.final_amount || row.original.price_amount;
        return (
          <div className="text-center">
            <span>{amount}</span>
            <span className="sar">$</span>
          </div>
        );
      },
    },
    // 7. Balance After (الرصيد بعد)
    {
      accessorKey: "balance_after",
      header: () => (
        <div className="text-center">{t("headers.balanceAfter")}</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <span>{row.original.balance_after}</span>
            <span className="sar">$</span>
          </div>
        );
      },
    },
  ];

  return columns;
};
