"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parentService } from "@/services/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useTranslations } from "next-intl";

const STATUS_STYLES: Record<string, string> = {
  accepted: "bg-success text-white border-green-400",
  pending: "bg-warning text-white",
  rejected: "bg-danger text-white border-red-400",
  waiting_confirmation: "bg-light-gray text-white",
};

const Bookings = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    booking: any | null;
  }>({ open: false, booking: null });
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["enrollments"],
    queryFn: parentService.getParentEnrollments,
  });
  const t = useTranslations("dashboard.parent.bookings");

  const rightFields = [
    { key: "status", label: t("fields.status"), isStatus: true },
    { key: "startDay", label: t("fields.startDay") },
    { key: "endDay", label: t("fields.endDay") },
    { key: "daysCount", label: t("fields.daysCount") },
  ];

  const leftFields = [
    { key: "childName", label: t("fields.childName") },
    { key: "className", label: t("fields.className") },
    { key: "branch", label: t("fields.branch") },
    { key: "program", label: t("fields.program") },
    { key: "paymentMethod", label: t("fields.paymentMethod") },
  ];

  const STATUS_MAP: Record<string, string> = {
    accepted: t("status.accepted"),
    pending: t("status.pending"),
    rejected: t("status.rejected"),
    waiting_confirmation: t("status.waiting_confirmation"),
    canceled: t("status.canceled"),
    cancelled: t("status.cancelled"),
  };

  const actionsByStatus: Record<
    string,
    {
      label: string;
      variant?: "destructive";
      action: "details" | "cancel" | null;
    }[]
  > = {
    [t("status.accepted")]: [
      { label: t("actions.showDetails"), action: "details" },
    ],
    [t("status.rejected")]: [
      { label: t("actions.showDetails"), action: "details" },
    ],
    [t("status.canceled")]: [
      { label: t("actions.showDetails"), action: "details" },
    ],
    [t("status.waiting_confirmation")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.cancel"), variant: "destructive", action: "cancel" },
    ],
    [t("status.pending")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.cancel"), variant: "destructive", action: "cancel" },
    ],
  };

  function StatusBadge({ status }: { status: string }) {
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-bold border ${
          STATUS_STYLES[status] || "bg-gray-100 text-gray-700 border-gray-400"
        }`}
      >
        {STATUS_MAP[status] || status}
      </span>
    );
  }

  function BookingCardSkeleton() {
    return (
      <Card className="w-full">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 gap-6 text-sm mb-4 place-items-center">
            <div className="flex flex-col gap-2 w-full">
              {rightFields.map((field) => (
                <div key={field.key} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 w-full">
              {leftFields.map((field) => (
                <div key={field.key} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  function BookingCard({
    booking,
    onShowDetails,
    onCancel,
    cancellingId,
  }: {
    booking: any;
    onShowDetails: () => void;
    onCancel: () => void;
    cancellingId: number | null;
  }) {
    return (
      <Card className="w-full">
        <CardContent className="py-6 px-6">
          <div className="grid grid-cols-2 gap-x-20 gap-y-4 text-sm mb-4 justify-center">
            {/* Swap: Render leftFields first, then rightFields */}
            <div className="flex flex-col gap-2 items-start">
              {leftFields.map((field, idx) => (
                <div
                  key={field.key + "-" + idx}
                  className="flex flex-row items-center gap-x-2 w-full justify-start"
                >
                  <span className="text-primary-blue font-bold whitespace-nowrap">
                    {field.label}:
                  </span>
                  <span className="font-bold text-mid-gray">
                    {booking[field.key]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 items-start">
              {rightFields.map((field, idx) => (
                <div
                  key={field.key + "-" + idx}
                  className="flex flex-row items-center gap-x-2 w-full justify-start"
                >
                  <span className="text-primary-blue font-bold whitespace-nowrap">
                    {field.label}:
                  </span>
                  <span className="font-bold text-mid-gray">
                    {field.isStatus ? (
                      <StatusBadge status={booking.status} />
                    ) : (
                      booking[field.key]
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {actionsByStatus[STATUS_MAP[booking.status]]?.map((action, idx) => (
              <Button
                key={action.label}
                variant={action.variant}
                className={`border ${
                  action.label === t("actions.cancel")
                    ? "bg-transparent text-red-500 border-red-500 hover:bg-red-50"
                    : "border-0"
                }`}
                onClick={
                  action.action === "details"
                    ? onShowDetails
                    : action.action === "cancel"
                    ? onCancel
                    : undefined
                }
                disabled={
                  action.action === "cancel" && cancellingId === booking.id
                }
              >
                {action.action === "cancel" && cancellingId === booking.id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  action.label
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  function InvoiceDialog({
    open,
    onOpenChange,
    booking,
  }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    booking: any;
  }) {
    if (!booking) return null;
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center w-full">
              {t("actions.showDetails")}
            </DialogTitle>
          </DialogHeader>
          {/* Invoice design based on image */}
          <div className="flex flex-col items-center gap-4">
            {/* Price Tabs */}
            <div className="flex gap-4 mb-2">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">50 ر.س</span>
                <span className="text-xs text-gray-500">شهري</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">50 ر.س</span>
                <span className="text-xs text-gray-500">اسبوعي</span>
              </div>
              <div className="flex flex-col items-center bg-primary/20 rounded-lg px-4 py-1 border-2 border-primary">
                <span className="text-lg font-bold text-primary">50 ر.س</span>
                <span className="text-xs text-primary">يومي</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">50 ر.س</span>
                <span className="text-xs text-gray-500">سعر بالساعة</span>
              </div>
            </div>
            {/* Details Section */}
            <div className="w-full bg-white rounded-lg shadow p-4">
              <div className="text-primary font-bold mb-2">
                {t("actions.showDetails")}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                {/* Match the order of the main booking page: leftFields first, then rightFields */}
                {leftFields.map((field, idx) => (
                  <div key={field.key + "-inv-l-" + idx}>
                    {field.label}:{" "}
                    <span className="font-bold">{booking[field.key]}</span>
                  </div>
                ))}
                {rightFields.map((field, idx) => (
                  <div key={field.key + "-inv-r-" + idx}>
                    {field.label}:{" "}
                    <span className="font-bold">
                      {field.isStatus
                        ? STATUS_MAP[booking.status]
                        : booking[field.key]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="font-bold text-lg">المبلغ</span>
                <span className="font-bold text-primary text-xl">
                  {booking.amount} ر.س
                </span>
              </div>
              {/* خدمات */}
              <div className="mt-2">
                <div className="font-bold text-sm mb-1">الخدمات:</div>
                <ul className="list-decimal pr-4 text-xs text-gray-600">
                  <li>خدمة 1 (مثال: تعليم القران الكريم)</li>
                  <li>خدمة 2 (مثال: تعليم اللغة الانجليزية)</li>
                  <li>خدمة 3 (مثال: أنشطة ترفيهية)</li>
                  <li>خدمة 4 (مثال: وجبات غذائية)</li>
                  <li>خدمة 5 (مثال: رعاية صحية)</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{t("error")}</div>;
  }

  const bookings =
    data?.data.map((booking) => ({
      id: booking.id,
      status: booking.status,
      childName: booking.parent_name,
      className: booking.center_name,
      branch: booking.branch_name,
      program: booking.enrollment_type,
      startDay: new Date(booking.enrollment_date).toLocaleDateString("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
      endDay: new Date(booking.enrollment_date).toLocaleDateString("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
      daysCount: 1,
      paymentMethod: "ميسر",
      amount: parseFloat(booking.price_amount),
      notes: [],
    })) || [];

  // Cancel booking handler
  const handleCancel = (booking: any) => {
    setConfirmDialog({ open: true, booking });
  };

  const confirmCancel = async () => {
    const booking = confirmDialog.booking;
    if (!booking) return;
    setCancellingId(booking.id);
    try {
      await parentService.cancelEnrollment(booking.id);
      toast.success(t("cancelSuccess"));
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    } catch (e: any) {
      toast.error(e.message || t("cancelError"));
    } finally {
      setCancellingId(null);
      setConfirmDialog({ open: false, booking: null });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onShowDetails={() => {
            setSelectedBooking(booking);
            setShowDetails(true);
          }}
          onCancel={() => handleCancel(booking)}
          cancellingId={cancellingId}
        />
      ))}
      <InvoiceDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        booking={selectedBooking}
      />
      <ConfirmationDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, booking: null })}
        onConfirm={confirmCancel}
        title={t("dialogs.cancelTitle")}
        description={t("dialogs.cancelDescription")}
        confirmText={t("dialogs.cancelConfirm")}
        cancelText={t("dialogs.cancelCancel")}
        variant="destructive"
      />
    </div>
  );
};

export { Bookings };
