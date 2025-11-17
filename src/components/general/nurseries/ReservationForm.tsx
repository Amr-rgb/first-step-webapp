"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import Image from "next/image";
import { UserPlus, X } from "lucide-react";
import {
  paymentService,
  nurseryService,
  parentService,
  enrollmentService,
} from "@/services/api";
import { useAuthUser, useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/lib/toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ReservationFormProps {
  nurseryName: string;
  selectedProgram: string;
  locale: "ar" | "en";
  selectedBranch?: string;
  selectedPlan?: string;
  // New props for dialog mode and renewal
  isDialogMode?: boolean;
  onClose?: () => void;
  preSelectedPlanId?: number | string;
  showOnlySelectedPlan?: boolean;
}

interface FormData {
  program: string;
  fromTime: string;
  toTime: string;
  numberOfHours: string;
  bookingDate: string;
  selectedChildren: string[];
}

type PlanType = "monthly" | "weekly" | "daily" | "hourly";

interface Plan {
  id: number;
  type: PlanType;
  name: string;
  price: string;
  planId: number;
}

interface ApiPlan {
  id: number;
  title: string;
  start_age: number;
  end_age: number;
  count: number;
  enrollment_type: string;
  price_amount: number;
}

// Default plans with fallback plan IDs
const defaultPlans: { ar: Plan[]; en: Plan[] } = {
  ar: [
    { id: 1, type: "monthly", name: "شهري", price: "50 ر.س", planId: 1 },
    { id: 2, type: "weekly", name: "أسبوعي", price: "50 ر.س", planId: 2 },
    { id: 3, type: "daily", name: "يومي", price: "50 ر.س", planId: 3 },
    { id: 4, type: "hourly", name: "بالساعة", price: "50 ر.س", planId: 4 },
  ],
  en: [
    { id: 1, type: "monthly", name: "Monthly", price: "50 SAR", planId: 1 },
    { id: 2, type: "weekly", name: "Weekly", price: "50 SAR", planId: 2 },
    { id: 3, type: "daily", name: "Daily", price: "50 SAR", planId: 3 },
    { id: 4, type: "hourly", name: "Hourly", price: "50 SAR", planId: 4 },
  ],
};

const timeOptions = [
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "24:00",
];

const mockChildren = [
  { id: "1", name: "أحمد", nameEn: "Ahmed", gender: "boy" },
  { id: "2", name: "فاطمة", nameEn: "Fatima", gender: "girl" },
  { id: "3", name: "محمد", nameEn: "Mohammed", gender: "boy" },
  { id: "4", name: "عائشة", nameEn: "Aisha", gender: "girl" },
];

const ReservationForm = ({
  nurseryName,
  selectedProgram,
  locale,
  selectedBranch,
  selectedPlan,
  isDialogMode = false,
  onClose,
  preSelectedPlanId,
  showOnlySelectedPlan = false,
}: ReservationFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
  const authUser = typeof window !== "undefined" ? useAuthUser() : null;
  const isWorldOfLearningJunior =
    nurseryName &&
    (nurseryName.toLowerCase().includes("world-of-learning-junior") ||
      nurseryName.toLowerCase().includes("world-of-learning"));

  // Fetch branches for the nursery
  const { data: branches = [], isLoading: loadingBranches } = useQuery({
    queryKey: ["branches", nurseryName],
    queryFn: () => nurseryService.getBranchesByNursery(nurseryName),
    enabled: !!nurseryName,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch plans for the selected branch
  const { data: apiPlans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ["branch-plans", selectedBranch],
    queryFn: () => nurseryService.getBranchPricing(selectedBranch!),
    enabled: !!selectedBranch && selectedBranch !== "",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Convert API plans to plans format
  const createPlanList = (): Plan[] => {
    if (apiPlans.length > 0) {
      return apiPlans.map((apiPlan: ApiPlan) => ({
        id: apiPlan.id,
        type: apiPlan.enrollment_type as PlanType,
        name: apiPlan.title,
        price: `${apiPlan.price_amount} ${locale === "ar" ? "ر.س" : "SAR"}`,
        planId: apiPlan.id,
      }));
    }
    // Only return default plans if no branch is selected or no API data
    if (!selectedBranch || selectedBranch === "") {
      return defaultPlans[locale];
    }
    return [];
  };

  const planList = createPlanList();

  // Helper to match plan by id or name (case-insensitive)
  function findSelectedPlan(
    planList: Plan[],
    plan: string | number
  ): Plan | undefined {
    return planList.find((p) => {
      if (typeof plan === "number") {
        return p.id === plan;
      } else if (typeof plan === "string") {
        return (
          p.id.toString() === plan ||
          p.type === plan ||
          p.name === plan ||
          (typeof p.name === "string" &&
            p.name.toLowerCase() === plan.toLowerCase())
        );
      }
      return false;
    });
  }

  // Set default plan to first in list if not found, or use preSelectedPlanId
  const [selectedPlanId, setSelectedPlanId] = useState<string | number>(
    preSelectedPlanId
      ? preSelectedPlanId
      : selectedPlan && findSelectedPlan(planList, selectedPlan)
      ? findSelectedPlan(planList, selectedPlan)!.id
      : selectedProgram && findSelectedPlan(planList, selectedProgram)
      ? findSelectedPlan(planList, selectedProgram)!.id
      : planList[0]?.id ?? 4 // Default to hourly if not found
  );

  // Debug logging
  console.log("Plan list:", planList);
  console.log(
    "Selected plan ID:",
    selectedPlanId,
    "Type:",
    typeof selectedPlanId
  );
  console.log("Selected plan from URL:", selectedPlan);
  console.log("Selected program from URL:", selectedProgram);

  // Update selected plan when planList changes (after API data loads) - only on initial load
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    if (planList.length > 0 && !hasInitialized) {
      const foundPlan = preSelectedPlanId
        ? preSelectedPlanId
        : selectedPlan && findSelectedPlan(planList, selectedPlan)
        ? findSelectedPlan(planList, selectedPlan)!.id
        : selectedProgram && findSelectedPlan(planList, selectedProgram)
        ? findSelectedPlan(planList, selectedProgram)!.id
        : planList[0]?.id;

      if (foundPlan && foundPlan !== selectedPlanId) {
        console.log(
          "Initial plan selection from",
          selectedPlanId,
          "to",
          foundPlan
        );
        setSelectedPlanId(foundPlan);
      }
      setHasInitialized(true);
    }
  }, [
    planList,
    selectedPlan,
    selectedProgram,
    hasInitialized,
    selectedPlanId,
    preSelectedPlanId,
  ]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Coupon state
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  // Show success if redirected from payment
  const [submitSuccess, setSubmitSuccess] = useState(
    typeof window !== "undefined" && searchParams?.get("payment") === "success"
  );

  // Restore auth state after payment redirect
  useEffect(() => {
    if (submitSuccess && typeof window !== "undefined") {
      try {
        // Try to restore auth from localStorage
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          if (authData?.state?.token && authData?.state?.user) {
            // Restore auth state
            useAuthStore
              .getState()
              .setUserToken(authData.state.user, authData.state.token);
          }
        }
      } catch (e) {
        console.error("Error restoring auth after payment:", e);
      }
    }
  }, [submitSuccess]);

  // Fetch parent's children (only if authenticated and not on success page)
  const {
    data: realChildren = [],
    isLoading: isChildrenLoading,
    error: childrenError,
  } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => parentService.getChildren(),
    enabled: !submitSuccess && !!authUser, // Don't fetch on success page
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleChildSelect = (id: string) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  // Coupon handlers
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toastError(
        locale === "ar"
          ? "يرجى إدخال كود الكوبون"
          : "Please enter a coupon code"
      );
      return;
    }

    setIsApplyingCoupon(true);
    try {
      // TODO: Replace with actual API call to validate coupon
      // For now, simulate a 10% discount
      const selectedPlanObjLocal = findSelectedPlan(planList, selectedPlanId);
      const numericPrice = selectedPlanObjLocal
        ? parseFloat(selectedPlanObjLocal.price.replace(/[^\d.]/g, ""))
        : 0;
      const numberOfChildren = selectedChildren.length || 0;
      const total = numericPrice * numberOfChildren;
      const discount = total * 0.1;
      setCouponDiscount(discount);
      setAppliedCoupon(couponCode);
      toastSuccess(
        locale === "ar"
          ? "تم تطبيق الكوبون بنجاح"
          : "Coupon applied successfully"
      );
    } catch (error: any) {
      toastError(
        error?.message ||
          (locale === "ar" ? "فشل في تطبيق الكوبون" : "Failed to apply coupon")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Get the selected plan and IDs
    const selectedPlanObjLocal = findSelectedPlan(planList, selectedPlanId);
    const planId = selectedPlanObjLocal?.planId;
    if (!planId) {
      toastError(
        locale === "ar" ? "لم يتم اختيار خطة" : "No plan selected",
        locale === "ar" ? "يرجى اختيار خطة" : "Please choose a plan"
      );
      setIsSubmitting(false);
      return;
    }
    if (!selectedBranch || selectedBranch === "") {
      toastError(
        locale === "ar" ? "لم يتم اختيار فرع" : "No branch selected",
        locale === "ar" ? "يرجى اختيار فرع" : "Please choose a branch"
      );
      setIsSubmitting(false);
      return;
    }

    const phone =
      (authUser as any)?.phone || (authUser as any)?.user?.phone || "";

    console.log("Selected plan:", findSelectedPlan(planList, selectedPlanId));
    console.log("Selected plan ID:", planId);

    try {
      // 1) Create enrollment first
      const enrollmentPayload: any = {
        center_branch_id: Number(selectedBranch),
        branch_price_id: Number(planId),
        parent_phone: phone,
        children: selectedChildren.map((id) => Number(id)),
      };

      // Add coupon code if applied
      if (appliedCoupon) {
        enrollmentPayload.coupon_code = appliedCoupon;
      }

      if (selectedApiPlan?.enrollment_type === "hour") {
        // Require day_string and starting_time
        // const dayString = bookingDate
        //   ? new Date(bookingDate).toLocaleDateString("en-US", {
        //       weekday: "long",
        //     })
        //   : undefined;
        enrollmentPayload.day_string = bookingDate;
        enrollmentPayload.starting_time = fromTime || "09:00";
      } else if (bookingDate) {
        // For day/week/month/year types require starting_date
        enrollmentPayload.starting_date = bookingDate;
      }

      await enrollmentService.createEnrollment(enrollmentPayload);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      toastSuccess(
        locale === "ar"
          ? "تم إرسال طلب الحجز بنجاح!"
          : "Reservation Request Sent Successfully!"
      );

      // If in dialog mode, close the dialog after success
      if (isDialogMode && onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Payment error details:", err);
      setIsSubmitting(false);

      // More specific error handling
      const errorTitle = locale === "ar" ? "خطأ في الحجز" : "Booking Error";
      let errorDescription =
        locale === "ar"
          ? "فشل إرسال طلب الحجز. يرجى المحاولة مرة أخرى."
          : "Failed to submit reservation request. Please try again.";

      if (err?.data?.error) {
        errorDescription = err.data.error;
      } else if (err?.error) {
        errorDescription = err.error;
      }

      toastError(errorTitle, errorDescription);
    }
  };

  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  const selectedPlanObj = findSelectedPlan(planList, selectedPlanId);

  // Get the corresponding API plan for duration and type info
  const selectedApiPlan = apiPlans.find(
    (plan: ApiPlan) => plan.id === selectedPlanId
  );

  // Generate time options based on plan type
  const generateTimeOptions = () => {
    if (!selectedApiPlan) return timeOptions;

    const { enrollment_type } = selectedApiPlan;

    switch (enrollment_type) {
      case "hour":
        // For hourly plans, show hour options
        return timeOptions;
      case "day":
        // For daily plans, show day options (1-30 days)
        return Array.from(
          { length: 30 },
          (_, i) => `${i + 1} ${locale === "ar" ? "يوم" : "Day"}`
        );
      case "week":
        // For weekly plans, show week options (1-4 weeks)
        return Array.from(
          { length: 4 },
          (_, i) => `${i + 1} ${locale === "ar" ? "أسبوع" : "Week"}`
        );
      case "month":
        // For monthly plans, show month options (1-12 months)
        return Array.from(
          { length: 12 },
          (_, i) => `${i + 1} ${locale === "ar" ? "شهر" : "Month"}`
        );
      default:
        return timeOptions;
    }
  };

  const dynamicTimeOptions = generateTimeOptions();

  // Auto-select plan duration when plan changes
  useEffect(() => {
    if (selectedApiPlan) {
      const { enrollment_type, count } = selectedApiPlan;

      switch (enrollment_type) {
        case "hour":
          // For hourly plans, set default time range
          setFromTime("08:00");
          setToTime("16:00");
          break;
        case "day":
          // For daily plans, set time range format
          setFromTime(`1 ${locale === "ar" ? "يوم" : "Day"}`);
          setToTime(`${count} ${locale === "ar" ? "يوم" : "Day"}`);
          break;
        case "week":
          // For weekly plans, set time range format
          setFromTime(`1 ${locale === "ar" ? "أسبوع" : "Week"}`);
          setToTime(`${count} ${locale === "ar" ? "أسبوع" : "Week"}`);
          break;
        case "month":
          // For monthly plans, set time range format
          setFromTime(`1 ${locale === "ar" ? "شهر" : "Month"}`);
          setToTime(`${count} ${locale === "ar" ? "شهر" : "Month"}`);
          break;
        default:
          setFromTime("");
          setToTime("");
      }
    } else {
      setFromTime("");
      setToTime("");
    }
  }, [selectedPlanId, selectedApiPlan, locale]);

  if (submitSuccess) {
    // Construct URLs
    const nurserySlug = nurseryName.toLowerCase().replace(/\s+/g, "-");
    const reservationDetailsUrl = `/${locale}/(website)/nurseries/${nurserySlug}/reservation`;
    const dashboardReservationsUrl = `/${locale}/dashboard/parent/bookings`;
    return (
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6 flex justify-center">
          <Image
            src="/assets/illustrations/success.png"
            alt="Success"
            width={160}
            height={160}
            className="mx-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-[#22336C] mb-4">
          {locale === "ar"
            ? "تم إرسال طلب الحجز بنجاح!"
            : "Reservation Request Sent Successfully!"}
        </h2>
        <p className="text-gray-600 mb-6">
          {locale === "ar"
            ? "سنتواصل معك قريباً لتأكيد تفاصيل الحجز."
            : "We will contact you soon to confirm the reservation details."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-6 py-2 font-bold rounded-lg transition w-full sm:w-auto
              bg-[#4D5EDB] text-white shadow hover:bg-[#3646a5] focus:outline-none focus:ring-2 focus:ring-[#4D5EDB] focus:ring-offset-2"
          >
            {locale === "ar" ? "إرسال طلب آخر" : "Submit Another Request"}
          </button>
          <button
            onClick={() => {
              // Check if user is authenticated before redirecting
              const isAuthenticated = authUser && typeof window !== "undefined";

              if (!isAuthenticated) {
                // If not authenticated, try to restore from localStorage/cookies
                try {
                  const authStorage = localStorage.getItem("auth-storage");
                  if (authStorage) {
                    const authData = JSON.parse(authStorage);
                    if (authData?.state?.token) {
                      // Token exists, use full page reload to restore session
                      window.location.href = dashboardReservationsUrl;
                      return;
                    }
                  }
                } catch (e) {
                  console.error("Error checking auth:", e);
                }

                // If still not authenticated, redirect to login first
                const loginUrl = `/${locale}/(website)/(auth)/sign-in?redirect=${encodeURIComponent(
                  dashboardReservationsUrl
                )}`;
                window.location.href = loginUrl;
              } else {
                // User is authenticated, navigate normally
                // Use window.location.href for full page reload to ensure session is preserved
                window.location.href = dashboardReservationsUrl;
              }
            }}
            className="px-6 py-2 font-bold rounded-lg transition w-full sm:w-auto
              border-2 border-[#4D5EDB] text-[#4D5EDB] bg-white hover:bg-[#f7f8fa] hover:border-[#22336C] hover:text-[#22336C] focus:outline-none focus:ring-2 focus:ring-[#4D5EDB] focus:ring-offset-2"
          >
            {locale === "ar"
              ? "حجوزاتي في لوحة التحكم"
              : "Go to My Reservations"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.form
        id={isDialogMode ? "reservation-form" : undefined}
        onSubmit={handleSubmit}
        dir={dir}
        className={`space-y-8 ${isDialogMode ? "pb-4" : ""}`}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      >
      {/* Plan Selection */}
      <motion.div
        className={`flex gap-4 mb-6 ${
          showOnlySelectedPlan
            ? "justify-center items-center"
            : planList.length > 4
            ? "overflow-x-auto pb-2 custom-scrollbar justify-start"
            : "flex-row justify-center items-center"
        }`}
        style={{
          maxWidth: showOnlySelectedPlan ? "100%" : planList.length > 4 ? "100%" : "32rem",
          margin: "0 auto",
          paddingLeft: showOnlySelectedPlan ? 0 : planList.length > 4 ? 8 : 0,
          paddingRight: showOnlySelectedPlan ? 0 : planList.length > 4 ? 8 : 0,
          paddingTop: 8,
          paddingBottom: 8,
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.4,
          type: "spring",
          stiffness: 60,
        }}
      >
        {(showOnlySelectedPlan
          ? planList.filter((p) => p.id === selectedPlanId)
          : planList
        ).map((p) => {
          const selected =
            selectedPlanId === p.id ||
            p.type === selectedPlanId ||
            p.name === selectedPlanId ||
            (typeof p.name === "string" &&
              typeof selectedPlanId === "string" &&
              p.name.toLowerCase() === selectedPlanId.toLowerCase());

          console.log(
            `Plan ${p.id}: selected=${selected}, selectedPlanId=${selectedPlanId}, p.id=${p.id}`
          );

          return (
            <button
              key={p.id}
              type="button"
              className={`flex flex-col items-center py-3 px-4 rounded-xl border-2 transition font-bold text-base ${
                showOnlySelectedPlan ? "" : planList.length > 4 ? "min-w-[120px] flex-shrink-0" : "flex-1"
              }
                ${
                  selected
                    ? "bg-[#4D5EDB] text-white border-[#4D5EDB] shadow border-dashed outline-dashed outline-2 outline-[#4D5EDB]"
                    : "bg-[#F7F8FA] text-gray-700 border-gray-300 border-solid focus:outline-none"
                }
                ${showOnlySelectedPlan ? "cursor-default" : ""}
              `}
              onClick={() => {
                if (showOnlySelectedPlan) return;
                console.log(
                  "Plan clicked:",
                  p.id,
                  "Current selected:",
                  selectedPlanId
                );
                setSelectedPlanId(p.id);
              }}
              disabled={showOnlySelectedPlan}
              tabIndex={showOnlySelectedPlan ? -1 : 0}
            >
              <span
                className={`text-lg font-extrabold mb-1 ${
                  selected ? "text-white" : "text-[#4D5EDB]"
                }`}
              >
                {p.price}
              </span>
              <span className="w-full h-px bg-[#DADADA] mb-1" />
              <span
                className={`text-base font-bold ${
                  selected ? "text-white" : "text-[#22336C]"
                }`}
              >
                {p.name}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Time Selection */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.15,
          duration: 0.4,
          type: "spring",
          stiffness: 60,
        }}
      >
        <label className="block font-bold mb-2 text-[#22336C] text-center">
          {selectedApiPlan?.enrollment_type === "hour"
            ? locale === "ar"
              ? "عدد الساعات"
              : "Number of Hours"
            : selectedApiPlan?.enrollment_type === "day"
            ? locale === "ar"
              ? "عدد الأيام"
              : "Number of Days"
            : selectedApiPlan?.enrollment_type === "week"
            ? locale === "ar"
              ? "عدد الأسابيع"
              : "Number of Weeks"
            : selectedApiPlan?.enrollment_type === "month"
            ? locale === "ar"
              ? "عدد الأشهر"
              : "Number of Months"
            : locale === "ar"
            ? "المدة"
            : "Duration"}
        </label>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto px-2 pb-2">
            {dynamicTimeOptions.map((t, idx) => {
              const isSelected = t === fromTime || t === toTime;
              const isInRange =
                fromTime &&
                toTime &&
                dynamicTimeOptions.indexOf(t) >
                  dynamicTimeOptions.indexOf(fromTime) &&
                dynamicTimeOptions.indexOf(t) <
                  dynamicTimeOptions.indexOf(toTime);
              return (
                <button
                  key={t}
                  type="button"
                  className={`px-3 py-1 rounded-full border-2 text-sm font-bold transition
                    ${
                      isSelected
                        ? "bg-[#4D5EDB] text-white border-[#4D5EDB]"
                        : isInRange
                        ? "bg-[#E6E9F8] text-[#22336C] border-[#B6BEE6]"
                        : "bg-white text-[#22336C] border-gray-300"
                    }
                    focus:outline-none focus:ring-2 focus:ring-[#4D5EDB]`}
                  style={{ minWidth: 56 }}
                  disabled
                  aria-pressed={isSelected || isInRange ? true : false}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {fromTime && toTime
              ? `${locale === "ar" ? "من" : "From"} ${fromTime} ${
                  locale === "ar" ? "إلى" : "to"
                } ${toTime}`
              : selectedApiPlan?.enrollment_type === "hour"
              ? locale === "ar"
                ? "المدة المحددة تلقائياً حسب الخطة"
                : "Duration automatically set based on plan"
              : locale === "ar"
              ? "المدة المحددة تلقائياً حسب الخطة"
              : "Duration automatically set based on plan"}
          </div>
        </div>
      </motion.div>

      {/* Date Picker */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.4,
          type: "spring",
          stiffness: 60,
        }}
      >
        <label className="block font-bold mb-2 text-[#22336C] text-center">
          {locale === "ar" ? "تاريخ الحجز" : "Booking Date"}
        </label>
        <div className="relative max-w-xs mx-auto">
          <input
            type="date"
            className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-[#4D5EDB]"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
            style={isRTL ? { textAlign: "right" } : {}}
          />
        </div>
      </motion.div>

      {/* Child Selection (Rectangles, Grayscale by Default, Color on Select) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.25,
          duration: 0.4,
          type: "spring",
          stiffness: 60,
        }}
      >
        <label className="block font-bold mb-2 text-[#22336C] text-center">
          {locale === "ar" ? "اختر طفل أو أكثر" : "Select One or More Children"}
        </label>
        <div
          className="flex gap-4 justify-start overflow-x-auto pb-2 custom-scrollbar"
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {isChildrenLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="rounded-lg bg-gray-200 animate-pulse min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4" />
                <div className="w-16 h-4 bg-gray-300 rounded mb-2" />
                <div className="w-8 h-3 bg-gray-300 rounded" />
              </motion.div>
            ))}

          {!isChildrenLoading && childrenError && (
            <div
              onClick={() =>
                router.push(`/${locale}/dashboard/parent/children`)
              }
              className="flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 bg-blue-50 border-blue-300 mx-auto cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <span className="text-sm text-blue-700 font-bold text-center mt-1">
                {locale === "ar"
                  ? "لا يوجد لديك أطفال"
                  : "You have no children"}
              </span>
            </div>
          )}

          {!isChildrenLoading &&
            !childrenError &&
            realChildren &&
            realChildren.length > 0 &&
            realChildren.map((child: any, idx: number) => {
              const idStr = (
                child.id ??
                child.child_id ??
                child._id ??
                `${idx}`
              ).toString();
              const gender = (child.gender || child.sex || "")
                .toString()
                .toLowerCase();
              const nameAr = child.child_name || child.name || child.nameAr;
              const nameEn =
                child.nameEn || child.name_en || child.name || nameAr;
              return (
                <motion.button
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 60,
                  }}
                  type="button"
                  key={idStr}
                  onClick={() => handleChildSelect(idStr)}
                  className={`flex flex-col items-center p-2 rounded-lg border-2 transition min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 justify-start
                    ${
                      selectedChildren.includes(idStr)
                        ? "border-[#4D5EDB] shadow"
                        : "border-gray-300"
                    } focus:outline-none bg-white hover:shadow-lg`}
                  style={{ flex: "0 0 auto", marginRight: 12 }}
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center mb-2 mt-2 transition-all duration-200`}
                  >
                    <Image
                      src={
                        gender === "boy" || gender === "male"
                          ? "/assets/illustrations/boy.png"
                          : "/assets/illustrations/girl.png"
                      }
                      alt={(nameAr || nameEn || "Child").toString()}
                      width={64}
                      height={64}
                      style={{
                        objectFit: "contain",
                        filter: selectedChildren.includes(idStr)
                          ? "none"
                          : "grayscale(100%) brightness(0.8)",
                        transform: selectedChildren.includes(idStr)
                          ? "scale(1.1)"
                          : "scale(1)",
                        transition: "all 0.2s",
                      }}
                    />
                  </div>
                  <span
                    className={`font-bold text-sm text-center mt-1 ${
                      selectedChildren.includes(idStr)
                        ? "text-[#22336C]"
                        : "text-gray-600"
                    }`}
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical" as any,
                      WebkitLineClamp: 2 as any,
                      overflow: "hidden",
                      wordBreak: "break-word",
                      lineHeight: 1.1,
                    }}
                  >
                    {locale === "ar" ? nameAr || nameEn : nameEn || nameAr}
                  </span>
                  {/* {selectedChildren.includes(idStr) && (
                    <span className="mt-1 text-[#4D5EDB] text-xs font-bold">
                      ✓
                    </span>
                  )} */}
                </motion.button>
              );
            })}

          {!isChildrenLoading &&
            !childrenError &&
            realChildren &&
            realChildren.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4 min-w-full text-center">
                <Image
                  src="/assets/illustrations/empty.png"
                  alt="No children"
                  width={120}
                  height={120}
                  className="mb-4 opacity-50"
                />
                <h3 className="text-lg font-bold text-[#22336C] mb-2">
                  {locale === "ar"
                    ? "لا يوجد أطفال مسجلون"
                    : "No Children Found"}
                </h3>
                <p className="text-sm text-gray-600 max-w-md">
                  {locale === "ar"
                    ? "يجب تسجيل طفل واحد على الأقل قبل إجراء الحجز. يرجى الذهاب إلى صفحة الأطفال لإضافة طفل جديد."
                    : "You need to register at least one child before making a reservation. Please go to the children page to add a new child."}
                </p>
                <Button
                  type="button"
                  onClick={() =>
                    router.push(`/${locale}/dashboard/parent/children`)
                  }
                  className="mt-4 bg-[#4D5EDB] hover:bg-[#3646a5] text-white"
                >
                  {locale === "ar" ? "إضافة طفل جديد" : "Add New Child"}
                </Button>
              </div>
            )}
        </div>
      </motion.div>

      {/* Booking Summary Section */}
      <motion.div
        className="max-w-md mx-auto bg-white rounded-xl shadow p-6 mb-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.25,
          duration: 0.4,
          type: "spring",
          stiffness: 60,
        }}
      >
        <h3 className="font-bold text-lg text-[#22336C] mb-4 text-center">
          {locale === "ar" ? "تفاصيل الحجز" : "Booking Summary"}
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>{locale === "ar" ? "الخطة" : "Plan"}</span>
            <span>{selectedPlanObj ? selectedPlanObj.name : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>{locale === "ar" ? "الوقت" : "Time"}</span>
            <span>
              {fromTime} - {toTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              {locale === "ar" ? "عدد الأطفال" : "Number of children"}
            </span>
            <span>{selectedChildren.length}</span>
          </div>
          <div className="flex justify-between">
            <span>{locale === "ar" ? "التاريخ" : "Date"}</span>
            <span>{bookingDate ? bookingDate : "--"}</span>
          </div>
        </div>
        <div className="border-t mt-4 pt-4">
          {selectedChildren.length > 0 && selectedPlanObj && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {locale === "ar"
                  ? "سعر الخطة × عدد الأطفال"
                  : "Plan price × Children"}
              </span>
              <span className="text-sm text-gray-700">
                {(() => {
                  // Extract numeric value from price string (e.g., "50 SAR" -> 50)
                  const numericPrice = parseFloat(
                    selectedPlanObj.price.replace(/[^\d.]/g, "")
                  );
                  const numberOfChildren = selectedChildren.length;
                  const unitPrice = numericPrice || 0;
                  return `${unitPrice} × ${numberOfChildren}`;
                })()}
              </span>
            </div>
          )}
          {appliedCoupon && couponDiscount > 0 && (
            <>
              <div className="flex justify-between text-red-500 mb-2">
                <span className="font-bold">-10%</span>
                <span className="font-bold">
                  -{couponDiscount.toFixed(2)} {locale === "ar" ? "ر.س" : "SAR"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  {locale === "ar" ? "كود الكوبون" : "Coupon Code"}:{" "}
                  {appliedCoupon}
                </span>
                <span>
                  {locale === "ar" ? "وفرت" : "Saved"}:{" "}
                  {couponDiscount.toFixed(2)} {locale === "ar" ? "ر.س" : "SAR"}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-bold text-[#22336C] text-base">
              {locale === "ar" ? "السعر الإجمالي" : "Total"}
            </span>
            <span className="font-extrabold text-2xl text-[#4D5EDB]">
              {(() => {
                if (!selectedPlanObj) return "-";

                // Extract numeric value from price string (e.g., "50 SAR" -> 50)
                const numericPrice = parseFloat(
                  selectedPlanObj.price.replace(/[^\d.]/g, "")
                );
                const numberOfChildren = selectedChildren.length || 0;
                const total = numericPrice * numberOfChildren;
                const finalTotal = total - couponDiscount;

                // Extract currency from price string
                const currency = locale === "ar" ? "ر.س" : "SAR";

                return `${finalTotal.toFixed(2)} ${currency}`;
              })()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Coupon Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.4,
          type: "spring",
          stiffness: 60,
        }}
        className="max-w-md mx-auto bg-white rounded-xl shadow p-6 mb-4"
      >
        <label className="text-primary-blue font-bold text-sm block mb-2">
          {locale === "ar" ? "كوبون الخصم" : "Discount Coupon"}:
        </label>
        {appliedCoupon ? (
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-purple-700 font-bold flex-1">
              {appliedCoupon}
            </span>
            <button
              type="button"
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
                locale === "ar"
                  ? "أدخل كود الكوبون (مثال: night15)"
                  : "Enter coupon code (e.g., night15)"
              }
              className="flex-1 h-9"
            />
            <Button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon || !couponCode.trim()}
              className="px-4 h-9"
            >
              {isApplyingCoupon ? (
                <LoadingSpinner size="sm" />
              ) : locale === "ar" ? (
                "جرب الكوبون"
              ) : (
                "Try Coupon"
              )}
            </Button>
          </div>
        )}
        <p className={`text-xs text-blue-400 flex items-center gap-1 mt-1 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
          {locale === "ar"
            ? "لا يعمل الكوبون في هذه الخطوة ويفعل عند الدفع بعد الموافقة على طلب الحجز"
            : "The coupon does not work at this step and is activated upon payment after approval of the booking request"}
          <span className="w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center text-[10px]">
            ?
          </span>
        </p>
      </motion.div>

      {/* Notice Paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.4,
          type: "spring",
          stiffness: 60,
        }}
        className="text-xs text-gray-400 text-center max-w-lg mx-auto"
      >
        {locale === "ar"
          ? "تأكيد الحجز يعني الموافقة على الشروط والأحكام وسياسة الخصوصية الخاصة بنا."
          : "Confirming the booking means you accept the terms and conditions and our privacy policy."}
      </motion.div>

      {/* Submit Button - Inside form for non-dialog mode */}
      {!isDialogMode && (
        <motion.button
          type="submit"
          disabled={isSubmitting || !bookingDate || selectedChildren.length === 0}
          className="w-full bg-[#4D5EDB] hover:bg-[#3646a5] text-white rounded-lg px-6 py-3 font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.35,
            duration: 0.4,
            type: "spring",
            stiffness: 60,
          }}
        >
          {isSubmitting
            ? locale === "ar"
              ? "جاري الإرسال..."
              : "Submitting..."
            : locale === "ar"
            ? "قم بتأكيد الحجز الآن"
            : "Confirm Booking Now"}
        </motion.button>
      )}
      {/* Custom Scrollbar Styles - must be inside the component */}
      {!isDialogMode && (
        <style jsx global>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4d5edb #f7f8fa;
          }
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
            background: #f7f8fa;
            border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4d5edb;
            border-radius: 6px;
            min-width: 40px;
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
      )}
    </motion.form>
      {/* Fixed Submit Button for Dialog Mode */}
      {isDialogMode && (
        <div className="sticky bottom-0 bg-white border-t pt-4 mt-4 -mx-6 px-6 pb-4 z-10">
          <motion.button
            type="submit"
            form="reservation-form"
            disabled={isSubmitting || !bookingDate || selectedChildren.length === 0}
            className="w-full bg-[#4D5EDB] hover:bg-[#3646a5] text-white rounded-lg px-6 py-3 font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.4,
              type: "spring",
              stiffness: 60,
            }}
          >
            {isSubmitting
              ? locale === "ar"
                ? "جاري الإرسال..."
                : "Submitting..."
              : locale === "ar"
              ? "قم بتأكيد الحجز الآن"
              : "Confirm Booking Now"}
          </motion.button>
        </div>
      )}
    </>
  );
};

export default ReservationForm;
