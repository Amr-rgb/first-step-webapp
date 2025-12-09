"use client";
import { useState, useEffect } from "react";
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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useTranslations, useLocale } from "next-intl";
import EmptyState from "@/components/common/EmptyState";
import { useAuthUser } from "@/store/authStore";
import {
  enrollmentService,
  parentService as apiParentService,
  paymentService,
  nurseryService,
} from "@/services/api";
import { promoCodeService } from "@/services/dashboardApi";
import { Input } from "@/components/ui/input";
import { X, RotateCw } from "lucide-react";
import ReservationForm from "@/components/general/nurseries/ReservationForm";
import BookingCard from "@/components/bookings/BookingCard";
import { FilterButtons } from "@/components/common/FilterButtons";

const Bookings = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [renewingId, setRenewingId] = useState<number | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    booking: any | null;
  }>({ open: false, booking: null });
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [renewBooking, setRenewBooking] = useState<any>(null);
  const queryClient = useQueryClient();
  const authUser = useAuthUser();
  const locale = useLocale();
  const { data, isLoading, isFetching, error } = useQuery({
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

  function InvoiceDialog({
    open,
    onOpenChange,
    booking,
    onConfirm,
  }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    booking: any;
    onConfirm?: (booking: any, couponCode?: string) => Promise<void>;
  }) {
    const locale = useLocale();
    const branchId = booking?.center_branch_id || booking?.branch_id;
    const [couponCode, setCouponCode] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponDiscount, setCouponDiscount] = useState<number>(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // Initialize coupon from booking if it exists
    useEffect(() => {
      if (booking && open) {
        const existingCoupon =
          booking.coupon_code || booking.originalData?.coupon_code;
        const existingDiscount =
          booking.discount_amount || booking.originalData?.discount_amount || 0;

        if (existingCoupon) {
          setAppliedCoupon(existingCoupon);
          setCouponCode(existingCoupon);
          setCouponDiscount(existingDiscount);
        } else {
          setAppliedCoupon(null);
          setCouponCode("");
          setCouponDiscount(0);
        }
      }
    }, [booking, open]);

    const originalPrice = booking?.amount || 0;
    const discountAmount = couponDiscount;
    const finalPrice = originalPrice - discountAmount;

    const handleApplyCoupon = async () => {
      if (!couponCode.trim()) {
        toastError(t("coupon.emptyError") || "Please enter a coupon code");
        return;
      }

      // Validate required fields
      if (!branchId) {
        toastError(
          locale === "ar"
            ? "معلومات الفرع غير متوفرة"
            : "Branch information not available"
        );
        return;
      }

      const branchPriceId = booking?.branch_price_id;
      if (!branchPriceId) {
        toastError(
          locale === "ar"
            ? "معلومات الخطة غير متوفرة"
            : "Plan information not available"
        );
        return;
      }

      setIsApplyingCoupon(true);
      try {
        const response = await promoCodeService.applyPromoCode({
          branch_price_id: Number(branchPriceId),
          branch_id: Number(branchId),
          promo_code: couponCode.trim().toUpperCase(),
        });

        // Use the discount from the API response
        setCouponDiscount(response.discount);
        setAppliedCoupon(response.promo_code);
        toastSuccess(
          t("coupon.appliedSuccess") || "Coupon applied successfully"
        );
      } catch (error: any) {
        toastError(
          error?.message || t("coupon.applyError") || "Failed to apply coupon"
        );
      } finally {
        setIsApplyingCoupon(false);
      }
    };

    const handleRemoveCoupon = () => {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponDiscount(0);
    };

    const handleConfirm = async () => {
      if (!onConfirm) return;
      setIsConfirming(true);
      try {
        await onConfirm(booking, appliedCoupon || undefined);
        onOpenChange(false);
      } catch (error) {
        // Error handling is done in the parent component
      } finally {
        setIsConfirming(false);
      }
    };

    const isAcceptedStatus = booking?.status === "accepted";

    // Fetch pricing plans for the branch
    const { data: apiPlans = [], isLoading: loadingPlans } = useQuery({
      queryKey: ["branch-plans-dialog", branchId],
      queryFn: () => nurseryService.getBranchPricing(branchId!),
      enabled: !!branchId && open,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

    // Convert API plans to display format
    const planList =
      apiPlans.length > 0
        ? apiPlans.map((apiPlan: any) => ({
            id: apiPlan.id,
            type: apiPlan.enrollment_type,
            name: apiPlan.title,
            price: `${apiPlan.price_amount} ${locale === "ar" ? "ر.س" : "SAR"}`,
            planId: apiPlan.id,
          }))
        : [];

    // Find the selected plan based on booking's branch_price_id
    const selectedPlanId = booking?.branch_price_id || null;

    if (!booking) return null;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-center w-full">
              {t("actions.showDetails")}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4">
            {/* Plan Selection - Same style as ReservationForm */}
            {loadingPlans ? (
              <div className="flex justify-center gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center py-3 px-4 rounded-xl border-2 border-gray-300 bg-gray-100 min-w-[120px]"
                  >
                    <div className="h-5 w-16 bg-gray-300 rounded mb-2 animate-pulse" />
                    <div className="w-full h-px bg-gray-300 mb-2" />
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : planList.length > 0 ? (
              <div className="flex justify-center gap-4 mb-6">
                {planList
                  .filter((p: any) => {
                    // Only show the selected plan (current booking's plan)
                    return (
                      selectedPlanId === p.id || selectedPlanId === p.planId
                    );
                  })
                  .map((p: any) => {
                    return (
                      <div
                        key={p.id}
                        className="flex flex-col items-center py-3 px-4 rounded-xl border-2 transition font-bold text-base bg-[#4D5EDB] text-white border-[#4D5EDB] shadow border-dashed outline-dashed outline-2 outline-[#4D5EDB]"
                      >
                        <span className="text-lg font-extrabold mb-1 text-white">
                          {p.price}
                        </span>
                        <span className="w-full h-px bg-white/30 mb-1" />
                        <span className="text-base font-bold text-white">
                          {p.name}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : null}

            {/* Details Section - Matching ReservationForm style */}
            <div className="w-full bg-white rounded-xl shadow p-6 mb-4">
              <h3 className="font-bold text-lg text-[#22336C] mb-4 text-center">
                {t("actions.showDetails")}
              </h3>
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                {/* Match the order of the main booking page: leftFields first, then rightFields */}
                {leftFields.map((field, idx) => (
                  <div
                    key={field.key + "-inv-l-" + idx}
                    className="flex justify-between"
                  >
                    <span>{field.label}</span>
                    <span className="font-bold">{booking[field.key]}</span>
                  </div>
                ))}
                {rightFields.map((field, idx) => (
                  <div
                    key={field.key + "-inv-r-" + idx}
                    className="flex justify-between"
                  >
                    <span>{field.label}</span>
                    <span className="font-bold">
                      {field.isStatus
                        ? STATUS_MAP[booking.status]
                        : booking[field.key]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Section - Only show for accepted status */}
              {isAcceptedStatus && (
                <div className="border-t pt-4 mt-4 space-y-3">
                  <div>
                    <label className="text-primary-blue font-bold text-sm block mb-2">
                      {t("coupon.label") || "كوبون الخصم"}:
                    </label>
                    {appliedCoupon ? (
                      <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <span className="text-purple-700 font-bold flex-1">
                          {appliedCoupon}
                        </span>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-purple-700 hover:text-purple-900"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder={
                            t("coupon.placeholder") || "أدخل كود الكوبون"
                          }
                          className="flex-1 h-9"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-4 h-9"
                        >
                          {isApplyingCoupon ? (
                            <Skeleton className="h-4 w-16" />
                          ) : (
                            t("coupon.apply") || "تطبيق"
                          )}
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                      {t("coupon.info") ||
                        "يمكنك تغيير الكوبون وإضافة كوبون آخر"}
                      <span className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center text-[10px]">
                        ?
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#22336C] text-base">
                      {isAcceptedStatus
                        ? t("confirmReservation.required") || "المطلوب"
                        : t("total")}
                      :
                    </span>
                    <span className="font-bold">
                      {originalPrice} {locale === "ar" ? "ر.س" : "SAR"}
                    </span>
                  </div>
                  {isAcceptedStatus && appliedCoupon && discountAmount > 0 && (
                    <>
                      <div className="flex justify-between text-red-500">
                        <span className="font-bold">-10%</span>
                        <span className="font-bold">
                          -{discountAmount.toFixed(2)}{" "}
                          {locale === "ar" ? "ر.س" : "SAR"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          {t("coupon.code") || "كود الكوبون"}: {appliedCoupon}
                        </span>
                        <span>
                          {t("coupon.saved") || "وفرت"}:{" "}
                          {discountAmount.toFixed(2)}{" "}
                          {locale === "ar" ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold text-lg text-[#22336C]">
                      {isAcceptedStatus
                        ? t("confirmReservation.finalAmount") ||
                          "المبلغ المطلوب"
                        : t("total")}
                      :
                    </span>
                    <span className="font-extrabold text-2xl text-[#4D5EDB]">
                      {isAcceptedStatus ? finalPrice.toFixed(2) : originalPrice}{" "}
                      {locale === "ar" ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes - Only for accepted status */}
            {isAcceptedStatus && onConfirm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-[#22336C] mb-2">
                  {t("confirmReservation.notes") || "ملاحظات"}:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>
                    {t("confirmReservation.note1") ||
                      "سيتم إرسال إشعار للدفع عبر البريد الإلكتروني."}
                  </li>
                  <li>
                    {t("confirmReservation.note2") ||
                      "لا يمكن استرداد المبلغ المدفوع لأي سبب."}
                  </li>
                  <li>
                    {t("confirmReservation.note3") ||
                      "نرجو التأكد من صحة المعلومات قبل متابعة عملية الدفع."}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Fixed Footer with Pay Now Button - Only for accepted status */}
          {isAcceptedStatus && onConfirm && (
            <div className="border-t bg-white px-6 py-4  bottom-0 z-10">
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="w-full bg-gradient-to-r from-[#4D5EDB] to-[#22336C] text-white py-6 text-lg font-bold hover:opacity-90"
              >
                {isConfirming ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  t("confirmReservation.payNow") || "ادفع الآن"
                )}
              </Button>
            </div>
          )}

          {/* Custom Scrollbar Styles */}
          <style jsx global>{`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #4d5edb #f7f8fa;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              background: #f7f8fa;
              border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #4d5edb;
              border-radius: 6px;
              min-height: 40px;
              transition: background 0.2s;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #22336c;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f7f8fa;
              border-radius: 6px;
            }
          `}</style>
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
    data?.data
      ?.slice()
      .sort((a: any, b: any) => b.id - a.id)
      .map((booking: any) => {
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

        // For hourly enrollments, use day_string if available, otherwise use enrollment_date
        const isHourly = booking.enrollment_type === "hour";
        const dateToUse =
          isHourly && booking.day_string
            ? booking.day_string
            : booking.enrollment_date || booking.starting_date;

        return {
          id: booking.id,
          status: booking.status,
          childName: childrenNames || booking.parent_name || "",
          className: booking.center_name,
          branch: booking.branch_name,
          program: programName,
          startDay: dateToUse
            ? new Date(dateToUse).toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })
            : "",
          endDay: dateToUse
            ? new Date(dateToUse).toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })
            : "",
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

  // Filter bookings based on selected status
  const filteredBookings =
    selectedStatusFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === selectedStatusFilter);

  // Get all unique statuses for filter options
  const allStatuses = Array.from(new Set(bookings.map((b) => b.status)));

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

  // Renew booking handler - opens ReservationForm in dialog
  const handleRenew = (booking: any) => {
    setRenewBooking(booking);
    setShowRenewDialog(true);
  };

  // Handle renew dialog close
  const handleRenewDialogClose = () => {
    setShowRenewDialog(false);
    setRenewBooking(null);
    // Refetch enrollments after dialog closes (in case a new booking was created)
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    }, 500);
  };

  // Confirm reservation handler
  const confirmReservation = async (booking: any, couponCode?: string) => {
    try {
      // Prepare payment payload - only send enrollment_id and coupon_code if exists
      const paymentPayload: {
        enrollment_id: number;
        coupon_code?: string;
      } = {
        enrollment_id: booking.id,
      };

      // Add coupon code if provided - ensure it's trimmed and uppercased
      if (couponCode && couponCode.trim()) {
        paymentPayload.coupon_code = couponCode.trim().toUpperCase();
      }

      console.log("Confirm reservation - Payment payload:", paymentPayload);

      // Call payment service
      const response = await paymentService.payOrder(paymentPayload);

      // Log the response
      console.log("Confirm reservation - Payment response:", response);

      // Redirect to Moyasar payment page if payment URL is available
      const paymentUrl =
        response?.payment_url || response?.url || response?.redirect_url;

      if (paymentUrl) {
        console.log("Redirecting to Moyasar payment URL:", paymentUrl);
        // Redirect to Moyasar for payment
        window.location.href = paymentUrl;
      } else {
        console.error("No payment URL in response:", response);
        toastError(
          "Payment URL not received. Please contact support or try again."
        );
      }
    } catch (e: any) {
      console.error("Confirm reservation error:", e);
      const errorMessage =
        e?.response?.data?.message || e?.message || "Failed to process payment";
      toastError(errorMessage);
      throw e;
    }
  };

  // Prepare filter options: "all" + all unique statuses
  const filterOptions = [
    { value: "all", label: t("filterAll") },
    ...allStatuses.map((status) => ({
      value: status,
      label: STATUS_MAP[status] || status,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Status Filter Buttons */}
      {/* Header with Filter and Reload */}
      <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-y-4 gap-x-8">
        <FilterButtons
          filters={filterOptions}
          activeFilter={selectedStatusFilter}
          onFilterChange={setSelectedStatusFilter}
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["enrollments"] })
          }
          className="shrink-0"
          disabled={isFetching}
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filtered Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t("noBookingsForStatus")}
        </div>
      ) : (
        filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onShowDetails={() => {
              setSelectedBooking(booking);
              setShowDetails(true);
            }}
            onCancel={() => handleCancel(booking)}
            onRenew={() => handleRenew(booking)}
            onConfirmReservation={() => {
              setSelectedBooking(booking);
              setShowDetails(true);
            }}
            cancellingId={cancellingId}
            renewingId={renewingId}
          />
        ))
      )}
      <InvoiceDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        booking={selectedBooking}
        onConfirm={
          selectedBooking?.status === "accepted"
            ? confirmReservation
            : undefined
        }
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
      {/* Renew Booking Dialog */}
      {renewBooking && (
        <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="text-center w-full">
                {t("actions.renew")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-4">
              <ReservationForm
                nurseryName={
                  renewBooking.originalData?.center_name ||
                  renewBooking.className ||
                  "nursery"
                }
                selectedProgram={renewBooking.program || ""}
                locale={locale as "ar" | "en"}
                selectedBranch={
                  renewBooking.center_branch_id || renewBooking.branch_id
                }
                isDialogMode={true}
                onClose={handleRenewDialogClose}
                preSelectedPlanId={renewBooking.branch_price_id}
                showOnlySelectedPlan={true}
              />
            </div>
            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #4d5edb #f7f8fa;
              }
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                background: #f7f8fa;
                border-radius: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #4d5edb;
                border-radius: 6px;
                min-height: 40px;
                transition: background 0.2s;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #22336c;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f7f8fa;
                border-radius: 6px;
              }
            `}</style>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export { Bookings };
