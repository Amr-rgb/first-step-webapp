"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { ReservationStatus, useReservationStatus } from "./shared/status";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { centerService } from "@/services/dashboardApi";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Booking = {
  id: number;
  parentName: string;
  childs: {
    id: string;
    name: string;
    enrollmentId: string;
    status: string;
    branch: string;
    startDate: string;
    type: string;
    amount: number;
  }[];
  branch: string;
  startDate: string;
  type: string;
  amount: number;
};

export interface SelectedChild {
  enrollmentId: string;
  status: string;
  branch: string;
  startDate: string;
  type: string;
  amount: number;
}

export function useCenterBookingsColumns(
  selectedChildMap: Record<number, SelectedChild>,
  setSelectedChildMap: React.Dispatch<
    React.SetStateAction<Record<number, SelectedChild>>
  >
) {
  const t = useTranslations("dashboard.tables.center-bookings");
  const { getStatusText, getStatusColorClass } = useReservationStatus();
  const queryClient = useQueryClient();

  const enrollmentMutation = useMutation({
    mutationFn: async ({
      enrollmentId,
      status,
    }: {
      enrollmentId: string;
      status: string;
    }) => {
      await centerService.respondEnrollment(parseInt(enrollmentId), status);
    },
    onSuccess: () => {
      toast.success(t("enrollmentResponseSuccess"));
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["centerBookings"] });
    },
    onError: () => {
      toast.error(t("enrollmentResponseError"));
    },
  });

  const handleEnrollmentResponse = async (
    enrollmentId: string,
    status: string
  ) => {
    enrollmentMutation.mutate({ enrollmentId, status });
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "childNumber",
      header: () => (
        <div className="text-[.7rem] font-normal text-center">
          {t("headers.childNumber")}
        </div>
      ),
      cell: ({ row }) => {
        return <div className="text-center">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "parentName",
      header: () => t("headers.parentName"),
    },
    {
      accessorKey: "startDate",
      header: () => t("headers.startDate"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const selectedChild = selectedChildMap[parentId];
        return selectedChild?.startDate ?? row.original.startDate;
      },
    },
    {
      accessorKey: "type",
      header: () => t("headers.type"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const selectedChild = selectedChildMap[parentId];
        return selectedChild?.type ?? row.original.type;
      },
    },
    {
      accessorKey: "childs",
      header: () => t("headers.child"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const childs = row.original.childs;

        const selectedChild = selectedChildMap[parentId] ?? {
          enrollmentId: childs[0]?.enrollmentId ?? "",
          status: childs[0]?.status ?? "",
          branch: childs[0]?.branch ?? "",
          startDate: childs[0]?.startDate ?? "",
          type: childs[0]?.type ?? "",
          amount: childs[0]?.amount ?? 0,
        };

        return (
          <select
            className="text-xs px-2 py-1 rounded bg-info text-white"
            value={selectedChild.enrollmentId}
            onChange={(e) => {
              const childId = e.target.value;
              const child = childs.find((c) => c.enrollmentId === childId);
              if (child) {
                setSelectedChildMap((prev) => ({
                  ...prev,
                  [parentId]: {
                    enrollmentId: child.enrollmentId,
                    status: child.status as ReservationStatus,
                    branch: child.branch,
                    startDate: child.startDate,
                    type: child.type,
                    amount: child.amount,
                  },
                }));
              }
            }}
          >
            {childs.map((child) => (
              <option key={child.enrollmentId} value={child.enrollmentId}>
                {child.name}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      accessorKey: "branch",
      header: () => t("headers.branch"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const selectedChild = selectedChildMap[parentId];
        return selectedChild?.branch ?? row.original.branch;
      },
    },
    {
      accessorKey: "amount",
      header: () => t("headers.amount"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const selectedChild = selectedChildMap[parentId];
        const amount = selectedChild?.amount ?? row.original.amount;
        return (
          <div className="space-x-1 rtl:space-x-reverse">
            <span>{amount}</span>
            <span>{t("currency")}</span>
          </div>
        );
      },
    },
    {
      id: "reservationStatus",
      header: () => t("headers.reservationStatus"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const childs = row.original.childs;
        const selectedChild = selectedChildMap[parentId] ?? {
          status: childs[0]?.status ?? "",
        };

        const status = selectedChild.status as ReservationStatus;
        const colorClasses = getStatusColorClass(status);
        const text = getStatusText(status);

        return (
          <div
            className={`text-xs w-fit px-2 py-1 rounded-[4px] select-none ${colorClasses}`}
          >
            {text}
          </div>
        );
      },
    },
    {
      id: "control",
      header: () => t("headers.control"),
      cell: ({ row }) => {
        const parentId = row.original.id;
        const childs = row.original.childs;
        const selectedChild = selectedChildMap[parentId] ?? {
          status: childs[0]?.status ?? "",
          enrollmentId: childs[0]?.enrollmentId,
        };
        const isWaitingForConfirmation = selectedChild?.status === "pending";

        if (!isWaitingForConfirmation) return null;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 px-2.5 py-1.5 h-fit text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() =>
                handleEnrollmentResponse(selectedChild.enrollmentId, "accepted")
              }
              disabled={enrollmentMutation.isPending}
            >
              <Check className="w-4 h-4" />
              {enrollmentMutation.isPending ? t("processing") : t("accept")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 px-2.5 py-1.5 h-fit text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() =>
                handleEnrollmentResponse(selectedChild.enrollmentId, "rejected")
              }
              disabled={enrollmentMutation.isPending}
            >
              <X className="w-4 h-4" />
              {enrollmentMutation.isPending ? t("processing") : t("reject")}
            </Button>
          </div>
        );
      },
      enableHiding: true,
      meta: {
        isWaitingForConfirmation: (row: any) => {
          const parentId = row.original.id;
          const selectedChild = selectedChildMap[parentId];
          return selectedChild?.status === "waitingForConfirmation";
        },
      },
    },
  ];

  return columns;
}
