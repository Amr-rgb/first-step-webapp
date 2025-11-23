"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "@/components/tables/data/center-bookings";
import { useReservationStatus } from "@/components/tables/data/shared/status";
import { Check, X, ChevronDown } from "lucide-react";
import { centerService } from "@/services/dashboardApi";
import { toastSuccess, toastError } from "@/lib/toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface BookingDetailsModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FrequencyType = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

export const BookingDetailsModal = ({
  booking,
  open,
  onOpenChange,
}: BookingDetailsModalProps) => {
  const t = useTranslations("dashboard.tables.center-bookings");
  const tBookings = useTranslations("dashboard.center-bookings");
  const { getStatusText, getStatusColorClass } = useReservationStatus();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedFrequency, setSelectedFrequency] =
    useState<FrequencyType>("monthly");

  const [branchId, setBranchId] = useState<string>("");
  const [selectedPricingId, setSelectedPricingId] = useState<number | null>(
    null
  );

  // Fetch branch pricing when modal opens and we have a branch
  const { data: pricingData, isLoading: isPricingLoading } = useQuery({
    queryKey: ["branchPricing", branchId],
    queryFn: () => centerService.getBranchPricing(branchId),
    enabled: open && !!branchId && !!booking,
  });

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
      toastSuccess(t("enrollmentResponseSuccess"));
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      onOpenChange(false);
    },
    onError: () => {
      toastError(t("enrollmentResponseError"));
    },
  });

  // Get enrollment type from booking
  const enrollmentType = booking?.type || "";

  // Set branch ID and selected pricing when booking changes
  useEffect(() => {
    if (booking) {
      if (booking.branchId) {
        setBranchId(booking.branchId.toString());
      }
      if (booking.branchPriceId) {
        setSelectedPricingId(booking.branchPriceId);
      }
    }
  }, [booking]);

  // Set initial frequency based on enrollment type
  useEffect(() => {
    if (enrollmentType) {
      const typeMap: Record<string, FrequencyType> = {
        hour: "hourly",
        day: "daily",
        week: "weekly",
        month: "monthly",
      };
      const freq = typeMap[enrollmentType] || "monthly";
      setSelectedFrequency(freq);
    }
  }, [enrollmentType]);

  // Set first child as selected when modal opens
  useEffect(() => {
    if (open && booking && booking.childs && booking.childs.length > 0) {
      // Get unique children
      const uniqueChildIds = Array.from(
        new Set(booking.childs.map((child) => child.id))
      );
      // Set first child as selected if none is selected
      if (!selectedChildId && uniqueChildIds.length > 0) {
        setSelectedChildId(uniqueChildIds[0]);
      }
    }
  }, [open, booking]);

  // Reset selected child when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedChildId("");
    }
  }, [open]);

  const frequencies: {
    value: FrequencyType;
    label: string;
    apiType: string;
  }[] = [
    {
      value: "hourly",
      label: tBookings("programTypes.hourly"),
      apiType: "hour",
    },
    { value: "daily", label: tBookings("programTypes.daily"), apiType: "day" },
    {
      value: "weekly",
      label: tBookings("programTypes.weekly"),
      apiType: "week",
    },
    {
      value: "monthly",
      label: tBookings("programTypes.monthly"),
      apiType: "month",
    },
    {
      value: "yearly",
      label: tBookings("programTypes.yearly"),
      apiType: "year",
    },
  ];

  // Filter pricing plans by selected frequency
  const filteredPricingPlans =
    pricingData?.data?.filter((plan: any) => {
      const currentFreq = frequencies.find(
        (f) => f.value === selectedFrequency
      );
      return plan.enrollment_type === currentFreq?.apiType;
    }) || [];

  // Format date to Arabic format: "السبت 20 / 5 / 2025"
  const formatArabicDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      // Parse the date (assuming format is YYYY-MM-DD)
      const date = parse(dateString, "yyyy-MM-dd", new Date());
      // Format: Day name + day / month / year
      const dayName = format(date, "EEEE", {
        locale: locale === "ar" ? ar : enUS,
      });
      const day = format(date, "d");
      const month = format(date, "M");
      const year = format(date, "yyyy");
      return `${dayName} ${day} / ${month} / ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  if (!booking) return null;

  // Group enrollments by child
  const childIdToGroup = new Map<
    string,
    { name: string; enrollments: typeof booking.childs }
  >();
  for (const entry of booking.childs) {
    const group = childIdToGroup.get(entry.id) ?? {
      name: entry.name,
      enrollments: [] as typeof booking.childs,
    };
    (group.enrollments as any).push(entry);
    childIdToGroup.set(entry.id, group);
  }

  const uniqueChildren = Array.from(childIdToGroup.entries()).map(
    ([childId, group]) => ({
      childId,
      name: group.name,
      enrollments: group.enrollments,
    })
  );

  const currentChildId = selectedChildId || uniqueChildren[0]?.childId || "";
  const currentChild = childIdToGroup.get(currentChildId);
  const currentEnrollment = currentChild?.enrollments[0];

  const status = currentEnrollment?.status || "-";
  const isPending = status === "pending";

  const handleResponse = (enrollmentId: string, responseStatus: string) => {
    enrollmentMutation.mutate({ enrollmentId, status: responseStatus });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90%] md:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            {tBookings("bookingDetails")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Child Info */}
          <div className="text-center text-primary font-medium space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span>{tBookings("child")}:</span>
              {uniqueChildren.length > 1 ? (
                <select
                  value={currentChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="px-3 py-1 rounded-lg border border-primary bg-white text-primary font-medium"
                >
                  {uniqueChildren.map((child) => (
                    <option key={child.childId} value={child.childId}>
                      {child.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{currentChild?.name}</span>
              )}
            </div>
            <p>
              {tBookings("parent")}: {booking.parentName}
            </p>
          </div>

          {/* Age and Branch Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Child Age */}
            <div className="relative">
              <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-right">
                {currentEnrollment?.age
                  ? `${currentEnrollment.age} ${tBookings("fields.years")}`
                  : "-"}
              </div>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Branch */}
            <div className="relative">
              <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-right">
                {currentEnrollment?.branch || "-"}
              </div>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Enrollment Details */}
          {/* <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">
                  {t("headers.branch")}
                </p>
                <p className="font-semibold text-primary">
                  {currentEnrollment?.branch}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {t("headers.startDate")}
                </p>
                <p className="font-semibold text-primary">
                  {currentEnrollment?.startDate}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {t("headers.type")}
                </p>
                <p className="font-semibold text-primary">
                  {frequencies.find((f) => f.value === selectedFrequency)
                    ?.label || currentEnrollment?.type}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {t("headers.amount")}
                </p>
                <p className="font-semibold text-primary">
                  {currentEnrollment?.amount} {t("currency")}
                </p>
              </div>
            </div>
          </div> */}

          {/* Frequency Buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            {frequencies.map((freq) => (
              <button
                key={freq.value}
                onClick={() => setSelectedFrequency(freq.value)}
                className={`px-6 py-2.5 rounded-lg border transition-all ${
                  selectedFrequency === freq.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>

          {/* Date Section */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {tBookings("fields.startDay")}
            </p>
            <div className="relative max-w-md mx-auto">
              <div className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-center">
                {currentEnrollment?.startDate
                  ? formatArabicDate(currentEnrollment.startDate)
                  : "-"}
              </div>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Pricing Plans */}
          {isPricingLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">جاري تحميل الخطط...</p>
            </div>
          ) : filteredPricingPlans.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {filteredPricingPlans.map((plan: any) => {
                const isSelected = selectedPricingId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`bg-white p-6 rounded-2xl text-center space-y-3 ${
                      isSelected
                        ? "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(131,203,170,0.12),rgba(131,203,170,0.24))]"
                        : "shadow-[0_2px_80px_rgba(34,34,34,0.08)]"
                    }`}
                  >
                    <h4
                      className="font-bold text-primary text-xl truncate"
                      title={plan.title}
                    >
                      {plan.title}
                    </h4>
                    <p className="text-base text-gray">
                      {plan.count}{" "}
                      {plan.enrollment_type === "hour"
                        ? plan.count > 1
                          ? tBookings("pricingCard.hours")
                          : tBookings("pricingCard.hour")
                        : plan.enrollment_type === "day"
                        ? plan.count > 1
                          ? tBookings("pricingCard.days")
                          : tBookings("pricingCard.day")
                        : plan.enrollment_type === "week"
                        ? plan.count > 1
                          ? tBookings("pricingCard.weeks")
                          : tBookings("pricingCard.week")
                        : plan.count > 1
                        ? tBookings("pricingCard.months")
                        : tBookings("pricingCard.month")}
                    </p>
                    <div className="flex items-center justify-center gap-1 overflow-hidden">
                      <span className="text-3xl font-bold text-primary truncate">
                        {parseFloat(plan.price_amount)}
                      </span>
                      <span className="text-2xl text-primary sar">$</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              {tBookings("noPricingPlans")}
            </div>
          )}

          {/* Action Buttons */}
          {isPending && currentEnrollment && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-12 text-base"
                onClick={() =>
                  handleResponse(currentEnrollment.enrollmentId, "rejected")
                }
                disabled={enrollmentMutation.isPending}
              >
                {enrollmentMutation.isPending
                  ? t("processing")
                  : tBookings("rejectBooking")}
              </Button>
              <Button
                className="flex-1 h-12 text-base"
                onClick={() =>
                  handleResponse(currentEnrollment.enrollmentId, "accepted")
                }
                disabled={enrollmentMutation.isPending}
              >
                {enrollmentMutation.isPending
                  ? t("processing")
                  : tBookings("acceptBooking")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
