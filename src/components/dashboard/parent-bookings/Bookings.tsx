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
import { toastSuccess, toastError } from "@/lib/toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState";
import { useAuthUser } from "@/store/authStore";
import {
  enrollmentService,
  parentService as apiParentService,
  paymentService,
  nurseryService,
} from "@/services/api";

const STATUS_STYLES: Record<string, string> = {
  pending: "text-white",
  accepted: "text-white",
  existing: "text-white",
  paid: "text-white",
  expired: "text-white",
  rejected: "text-white",
  canceled: "text-white",
  cancelled: "text-white",
  waiting_confirmation: "text-white",
};

const Bookings = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [renewingId, setRenewingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    booking: any | null;
  }>({ open: false, booking: null });
  const queryClient = useQueryClient();
  const authUser = useAuthUser();
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
    pending: t("status.pending"),
    accepted: t("status.accepted"),
    existing: t("status.existing"),
    paid: t("status.paid"),
    expired: t("status.expired"),
    rejected: t("status.rejected"),
    canceled: t("status.canceled"),
    cancelled: t("status.cancelled"),
    waiting_confirmation: t("status.waiting_confirmation"),
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: "#9891FF",
    accepted: "#FFAD0D",
    existing: "#3B82F6",
    paid: "#47B881",
    expired: "#CACACA",
    rejected: "#F64C4C",
    canceled: "#000000",
    cancelled: "#000000",
    waiting_confirmation: "#9891FF",
  };

  const actionsByStatus: Record<
    string,
    {
      label: string;
      variant?: "destructive" | "default";
      action: "details" | "cancel" | "renew" | null;
    }[]
  > = {
    [t("status.accepted")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.cancel"), variant: "destructive", action: "cancel" },
    ],
    [t("status.paid")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.renew"), action: "renew" },
    ],
    [t("status.existing")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.renew"), action: "renew" },
    ],
    [t("status.expired")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.renew"), action: "renew" },
    ],
    [t("status.rejected")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.renew"), action: "renew" },
    ],
    [t("status.canceled")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.renew"), action: "renew" },
    ],
    [t("status.waiting_confirmation")]: [
      { label: t("actions.showDetails"), action: "details" },
      // Note: Cancel action removed for "waiting_confirmation" because backend
      // only allows canceling "pending" or "accepted" statuses
      // { label: t("actions.cancel"), variant: "destructive", action: "cancel" },
    ],
    [t("status.pending")]: [
      { label: t("actions.showDetails"), action: "details" },
      { label: t("actions.cancel"), variant: "destructive", action: "cancel" },
    ],
  };

  function StatusBadge({ status }: { status: string }) {
    const backgroundColor = STATUS_COLORS[status] || "#CACACA";
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-bold ${
          STATUS_STYLES[status] || "text-white"
        }`}
        style={{ backgroundColor }}
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
    onRenew,
    cancellingId,
    renewingId,
  }: {
    booking: any;
    onShowDetails: () => void;
    onCancel: () => void;
    onRenew: () => void;
    cancellingId: number | null;
    renewingId: number | null;
  }) {
    return (
      <Card id={`enrollment-${booking.id}`} className="w-full transition-all">
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
            {(() => {
              // Filter actions based on backend validation - only "pending" and "accepted" can be canceled
              const allActions =
                actionsByStatus[STATUS_MAP[booking.status]] || [];
              const filteredActions = allActions.filter((action) => {
                // Backend only allows canceling "pending" or "accepted" statuses
                // Filter out cancel action for "waiting_confirmation" status
                if (
                  action.action === "cancel" &&
                  booking.status === "waiting_confirmation"
                ) {
                  return false;
                }
                return true;
              });
              const isOnlyButton = filteredActions.length === 1;

              // Check if there are multiple buttons and one of them is "renew" or "cancel"
              const hasOtherButton = filteredActions?.some(
                (a) => a.action === "renew" || a.action === "cancel"
              );

              return filteredActions.map((action, idx) => {
                // Check statuses that should use primary style for Show Details
                const shouldBePrimaryForDetails =
                  action.label === t("actions.showDetails") &&
                  (isOnlyButton ||
                    booking.status === "accepted" ||
                    booking.status === "waiting_confirmation" ||
                    (booking.status === "pending" && !hasOtherButton) ||
                    (booking.status === "paid" && !hasOtherButton) ||
                    (booking.status === "existing" && !hasOtherButton));

                // Style mapping: Renew = Primary, Details = Secondary (or Primary if alone), Cancel = Destructive
                let buttonStyle = "";

                // Base styles for all buttons (using secondary button dimensions as reference)
                const baseStyles =
                  "py-[10.5px] px-[60px] rounded-lg font-bold text-base leading-[19px] w-full max-w-[258px]";

                if (action.label === t("actions.cancel")) {
                  buttonStyle = `bg-transparent text-red-500 border-red-500 hover:bg-red-50 ${baseStyles}`;
                } else if (action.label === t("actions.renew")) {
                  buttonStyle = `bg-primary text-white hover:bg-primary/90 shadow-md ${baseStyles}`;
                } else if (action.label === t("actions.showDetails")) {
                  if (shouldBePrimaryForDetails) {
                    buttonStyle = `bg-primary text-white hover:bg-primary/90 shadow-md ${baseStyles}`;
                  } else {
                    // Figma design: transparent/no fill background, gray border, gray text
                    buttonStyle = `bg-transparent text-[#8E8E8E] border-[#CACACA] hover:bg-transparent ${baseStyles}`;
                  }
                }

                return (
                  <Button
                    key={action.label}
                    variant={
                      action.label === t("actions.showDetails") &&
                      !isOnlyButton &&
                      hasOtherButton &&
                      booking.status !== "pending" &&
                      booking.status !== "waiting_confirmation" &&
                      booking.status !== "accepted"
                        ? "outline"
                        : action.variant
                    }
                    className={
                      shouldBePrimaryForDetails
                        ? buttonStyle
                        : `border ${buttonStyle}`
                    }
                    style={
                      shouldBePrimaryForDetails
                        ? { color: "#ffffff" }
                        : undefined
                    }
                    onClick={
                      action.action === "details"
                        ? onShowDetails
                        : action.action === "cancel"
                        ? onCancel
                        : action.action === "renew"
                        ? onRenew
                        : undefined
                    }
                    disabled={
                      (action.action === "cancel" &&
                        cancellingId === booking.id) ||
                      (action.action === "renew" && renewingId === booking.id)
                    }
                  >
                    {(action.action === "cancel" &&
                      cancellingId === booking.id) ||
                    (action.action === "renew" && renewingId === booking.id) ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      action.label
                    )}
                  </Button>
                );
              });
            })()}
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

  // Log the raw data to see what's available
  if (data?.data && data.data.length > 0 && data.data[0]) {
    console.log("Raw enrollment data from API:", data.data[0]);
    console.log("Total enrollments returned:", data.data.length);
    console.log(
      "All enrollment IDs:",
      data.data.map((e: any) => ({ id: e.id, status: e.status }))
    );
  }

  const bookings =
    data?.data.map((booking: any) => {
      // Extract children names from children array
      const childrenNames =
        booking.children?.length > 0
          ? booking.children
              .map((child: any) => child.child_name || child.name)
              .filter(Boolean)
              .join("، ")
          : "";

      // Get program name - prefer enrollment_type_name or price_title, fallback to enrollment_type
      const programName =
        booking.enrollment_type_name ||
        booking.price_title ||
        booking.enrollment_type ||
        "";

      return {
        id: booking.id,
        status: booking.status,
        childName: childrenNames || booking.parent_name || "",
        className: booking.center_name,
        branch: booking.branch_name,
        program: programName,
        startDay: new Date(booking.enrollment_date).toLocaleDateString(
          "ar-SA",
          {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }
        ),
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
        // Preserve original enrollment data for renewal
        center_branch_id:
          booking.center_branch_id || booking.branch_id || booking.branch_id,
        branch_price_id: booking.branch_price_id || null,
        enrollment_date: booking.enrollment_date,
        enrollment_type: booking.enrollment_type,
        children: booking.children || [],
        parent_phone: booking.parent_phone,
        originalData: booking, // Keep full booking data
        // Additional fields from API
        branch_id: booking.branch_id,
        id_raw: booking.id, // Keep original ID
        // Additional info from API
        enrollment_type_name:
          booking.enrollment_type_name || booking.enrollment_type,
        price_title: booking.price_title,
      };
    }) || [];

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon="📅"
        size="lg"
        translationKey="dashboard.emptyStates.bookings"
      />
    );
  }

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
      toastSuccess(t("cancelSuccess"));
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    } catch (e: any) {
      // Check if the error is about status validation
      const errorMessage =
        e?.response?.data?.message || e?.message || t("cancelError");

      const actualStatus = booking.status || booking.originalData?.status;
      if (
        errorMessage.toLowerCase().includes("only") &&
        errorMessage.toLowerCase().includes("cancel") &&
        actualStatus === "waiting_confirmation"
      ) {
        toastError(
          t("cancelError") +
            " - " +
            "This enrollment is in 'waiting for confirmation' status. " +
            "Please contact support if you need to cancel this enrollment."
        );
      } else {
        toastError(errorMessage);
      }
    } finally {
      setCancellingId(null);
      setConfirmDialog({ open: false, booking: null });
    }
  };

  // Renew booking handler - uses same flow as reservation form
  const handleRenew = async (booking: any) => {
    console.log("Renew booking data:", booking);
    console.log("Original booking data:", booking.originalData);
    console.log("Enrollment type from booking:", booking.enrollment_type);
    console.log(
      "Enrollment type from originalData:",
      booking.originalData?.enrollment_type
    );

    // Use branch_id if center_branch_id is not available
    const branchId = booking.center_branch_id || booking.branch_id;

    // Get parent phone from booking or fallback to auth user (can be null)
    const parentPhone =
      booking.parent_phone ||
      (authUser as any)?.phone ||
      (authUser as any)?.user?.phone ||
      null;

    if (!branchId) {
      console.error("Missing required data:", {
        branchId,
      });
      toastError("Missing information to renew booking");
      return;
    }

    setRenewingId(booking.id);
    try {
      // Fetch children if not already available
      let childrenIds = booking.children?.map((child: any) => Number(child.id));

      if (!childrenIds || childrenIds.length === 0) {
        const childrenData = await apiParentService.getChildren();
        childrenIds = childrenData.map((child: any) => Number(child.id));
      }

      if (!childrenIds || childrenIds.length === 0) {
        toastError("No children found to renew booking");
        return;
      }

      const branchIdRenew = booking.center_branch_id || booking.branch_id;

      // Get enrollment type from original data or booking
      const enrollmentType =
        booking.originalData?.enrollment_type || booking.enrollment_type;
      console.log("Using enrollment type:", enrollmentType);

      // Check if it's hourly by looking at original data fields
      const hasDayString =
        booking.originalData?.day_string !== null &&
        booking.originalData?.day_string !== undefined;
      const hasStartingTime =
        booking.originalData?.starting_time !== null &&
        booking.originalData?.starting_time !== undefined;

      // Also check by looking at the pricing plan type if we have branch_price_id
      let isHourlyType =
        enrollmentType === "hour" || hasDayString || hasStartingTime;

      // If still not sure, check the pricing plan
      if (!isHourlyType && booking.branch_price_id) {
        try {
          const pricingData = await nurseryService.getBranchPricing(
            branchIdRenew
          );
          const selectedPlan = pricingData.find(
            (plan: any) => plan.id === booking.branch_price_id
          );
          if (selectedPlan?.enrollment_type === "hour") {
            isHourlyType = true;
            console.log("Detected hourly from pricing plan:", selectedPlan);
          }
        } catch (err) {
          console.error("Could not fetch pricing data:", err);
        }
      }

      console.log("Is hourly enrollment?", isHourlyType, {
        enrollmentType,
        hasDayString,
        hasStartingTime,
        branch_price_id: booking.branch_price_id,
      });

      // Prepare enrollment payload same as reservation form
      const enrollmentPayload: any = {
        center_branch_id: Number(branchIdRenew),
        branch_price_id: booking.branch_price_id
          ? Number(booking.branch_price_id)
          : 1, // Fallback if not available
        parent_phone: parentPhone,
        children: childrenIds,
      };

      // Add date/time fields based on enrollment type - use today's date
      const today = new Date();
      const todayISO = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Check if it's hourly enrollment
      if (isHourlyType) {
        // For hourly enrollment, send date in YYYY-MM-DD format
        enrollmentPayload.day_string = todayISO;
        enrollmentPayload.starting_time = "09:00"; // Default time
        console.log("Adding hourly fields:", {
          day_string: todayISO,
          starting_time: "09:00",
        });
      } else {
        // For day/week/month/year types - use today's date
        enrollmentPayload.starting_date = todayISO;
        console.log("Adding date field:", { starting_date: todayISO });
      }

      console.log("Final enrollment payload:", enrollmentPayload);

      // Create enrollment (creates with pending status)
      const enrollmentResponse = await enrollmentService.createEnrollment(
        enrollmentPayload
      );
      console.log("Enrollment created successfully:", enrollmentResponse);

      // Show success message
      toastSuccess(t("renewSuccess"));

      // Wait a bit before refetching to ensure backend has updated
      setTimeout(async () => {
        queryClient.invalidateQueries({ queryKey: ["enrollments"] });
        await queryClient.refetchQueries({ queryKey: ["enrollments"] });
      }, 1500);
    } catch (e: any) {
      console.error("Renew enrollment error:", e);
      const errorMessage =
        e?.response?.data?.message || e?.message || t("renewError");
      const errorDetails = e?.response?.data?.errors
        ? JSON.stringify(e.response.data.errors)
        : "";
      toastError(`${errorMessage} ${errorDetails}`);
    } finally {
      setRenewingId(null);
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
          onRenew={() => handleRenew(booking)}
          cancellingId={cancellingId}
          renewingId={renewingId}
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
