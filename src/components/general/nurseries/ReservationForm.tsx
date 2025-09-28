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
import { paymentService, nurseryService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface ReservationFormProps {
  nurseryName: string;
  selectedProgram: string;
  locale: "ar" | "en";
  selectedBranch?: string;
  selectedPlan?: string;
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
}: ReservationFormProps) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
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

  // Set default plan to first in list if not found
  const [selectedPlanId, setSelectedPlanId] = useState<string | number>(
    selectedPlan && findSelectedPlan(planList, selectedPlan)
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
      const foundPlan =
        selectedPlan && findSelectedPlan(planList, selectedPlan)
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
  }, [planList, selectedPlan, selectedProgram, hasInitialized, selectedPlanId]);
  const [fromTime, setFromTime] = useState("03:00");
  const [toTime, setToTime] = useState("07:00");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Show success if redirected from payment
  const [submitSuccess, setSubmitSuccess] = useState(
    typeof window !== "undefined" && searchParams?.get("payment") === "success"
  );

  const handleChildSelect = (id: string) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Get the selected plan ID
    const planId = findSelectedPlan(planList, selectedPlanId)?.planId;
    if (!planId) {
      alert("No plan selected. Please choose a plan.");
      setIsSubmitting(false);
      return;
    }

    console.log("Selected plan:", findSelectedPlan(planList, selectedPlanId));
    console.log("Selected plan ID:", planId);

    try {
      const data = await paymentService.parentSubscribe(planId);
      setIsSubmitting(false);
      if (data.success && data.payment_url) {
        // Redirect to Moyasar payment page, but after payment, Moyasar should redirect back to our reservation page with ?payment=success
        // To achieve this, we need to set the return_url in the backend/payment API to point to our reservation page with ?payment=success
        // For now, we open the payment page, and after payment, the user will be redirected back with ?payment=success
        window.location.href = data.payment_url;
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment error details:", err);
      setIsSubmitting(false);

      // More specific error handling
      if (err?.data?.message) {
        alert(`Payment error: ${err.data.message}`);
      } else if (err?.message) {
        alert(`Payment error: ${err.message}`);
      } else {
        alert("Payment initiation failed. Please try again.");
      }
    }
  };

  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";

  const selectedPlanObj = findSelectedPlan(planList, selectedPlanId);

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
        <div className="mb-6">
          <Image
            src="/assets/illustrations/success.png"
            alt="Success"
            width={100}
            height={100}
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
            onClick={() => router.push(reservationDetailsUrl)}
            className="px-6 py-2 font-bold rounded-lg transition w-full sm:w-auto
              bg-[#4D5EDB] text-white shadow hover:bg-[#3646a5] focus:outline-none focus:ring-2 focus:ring-[#4D5EDB] focus:ring-offset-2"
          >
            {locale === "ar" ? "تفاصيل الحجز" : "View Reservation Details"}
          </button>
          <button
            onClick={() => router.push(dashboardReservationsUrl)}
            className="px-6 py-2 font-bold rounded-lg transition w-full sm:w-auto
              border-2 border-[#4D5EDB] text-[#4D5EDB] bg-white hover:bg-[#f7f8fa] hover:border-[#22336C] hover:text-[#22336C] focus:outline-none focus:ring-2 focus:ring-[#4D5EDB] focus:ring-offset-2"
          >
            {locale === "ar"
              ? "حجوزاتي في لوحة التحكم"
              : "Go to My Reservations"}
          </button>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="px-6 py-2 font-bold rounded-lg transition w-full sm:w-auto
              bg-gray-100 text-[#22336C] hover:bg-gray-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4D5EDB] focus:ring-offset-2"
          >
            {locale === "ar" ? "إرسال طلب آخر" : "Submit Another Request"}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      dir={dir}
      className="space-y-8"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
    >
      {/* Plan Selection */}
      <motion.div
        className={`flex items-center gap-4 max-w-2xl mx-auto mb-6 ${
          planList.length > 4
            ? "overflow-x-auto pb-2 custom-scrollbar"
            : "flex-row"
        }`}
        style={{
          maxWidth: planList.length > 4 ? "100%" : "32rem",
          paddingLeft: planList.length > 4 ? 8 : 0,
          paddingRight: planList.length > 4 ? 8 : 0,
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
        {planList.map((p) => {
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
              className={`flex flex-col items-center py-3 px-4 rounded-xl border-2 transition font-bold text-base mb-2 ${
                planList.length > 4 ? "min-w-[120px] flex-shrink-0" : "flex-1"
              }
                ${
                  selected
                    ? "bg-[#4D5EDB] text-white border-[#4D5EDB] shadow border-dashed outline-dashed outline-2 outline-[#4D5EDB]"
                    : "bg-[#F7F8FA] text-gray-700 border-gray-300 border-solid focus:outline-none"
                }
              `}
              onClick={() => {
                console.log(
                  "Plan clicked:",
                  p.id,
                  "Current selected:",
                  selectedPlanId
                );
                setSelectedPlanId(p.id);
              }}
              tabIndex={0}
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
          {locale === "ar" ? "عدد الساعات" : "Number of Hours"}
        </label>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto px-2 pb-2">
            {timeOptions.map((t, idx) => {
              const isSelected = t === fromTime || t === toTime;
              const isInRange =
                fromTime &&
                toTime &&
                timeOptions.indexOf(t) > timeOptions.indexOf(fromTime) &&
                timeOptions.indexOf(t) < timeOptions.indexOf(toTime);
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
                  onClick={() => {
                    if (!fromTime || (fromTime && toTime)) {
                      setFromTime(t);
                      setToTime("");
                    } else if (fromTime && !toTime) {
                      if (
                        timeOptions.indexOf(t) > timeOptions.indexOf(fromTime)
                      ) {
                        setToTime(t);
                      } else {
                        setFromTime(t);
                      }
                    }
                  }}
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
              : locale === "ar"
              ? "اختر وقت البداية ثم النهاية"
              : "Select start time then end time"}
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
            className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 focus:ring-2 focus:ring-[#4D5EDB] pr-10"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
            style={isRTL ? { textAlign: "right" } : {}}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#4D5EDB"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
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
          {/* {isChildrenLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
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
              ))
            : (realChildren && realChildren.length > 0
                ? realChildren
                : mockChildren
              ).map((child, idx) => {
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
                    key={child.id}
                    onClick={() => handleChildSelect(child.id.toString())}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 transition min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 justify-start
                    ${
                      selectedChildren.includes(child.id.toString())
                        ? "border-[#4D5EDB] shadow"
                        : "border-gray-300"
                    } focus:outline-none bg-white hover:shadow-lg`}
                    style={{ flex: "0 0 auto", marginRight: 12 }}
                  >
                    <div
                      className={`w-16 h-16 flex items-center justify-center ${
                        selectedChildren.includes(child.id.toString())
                          ? "mb-0 mt-0"
                          : "mb-2 mt-2"
                      } transition-all duration-200`}
                      style={{
                        marginTop: selectedChildren.includes(
                          child.id.toString()
                        )
                          ? 0
                          : undefined,
                      }}
                    >
                      <Image
                        src={
                          child.gender === "boy"
                            ? "/assets/illustrations/boy.png"
                            : "/assets/illustrations/girl.png"
                        }
                        alt={child.child_name || child.nameEn}
                        width={64}
                        height={64}
                        style={{
                          objectFit: "contain",
                          filter: selectedChildren.includes(child.id.toString())
                            ? "none"
                            : "grayscale(100%) brightness(0.8)",
                          transform: selectedChildren.includes(
                            child.id.toString()
                          )
                            ? "scale(1.1)"
                            : "scale(1)",
                          transition: "all 0.2s",
                        }}
                      />
                    </div>
                    <span
                      className={`font-bold text-sm text-center mt-2 ${
                        selectedChildren.includes(child.id.toString())
                          ? "text-[#22336C]"
                          : "text-gray-600"
                      }`}
                    >
                      {child.child_name ||
                        child.name ||
                        (locale === "ar" ? child.name : child.nameEn)}
                    </span>
                    {selectedChildren.includes(child.id.toString()) && (
                      <span className="mt-1 text-[#4D5EDB] text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </motion.button>
                );
              })} */}
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
        <div className="border-t mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold text-[#22336C] text-base">
            {locale === "ar" ? "السعر الإجمالي" : "Total"}
          </span>
          <span className="font-extrabold text-2xl text-[#4D5EDB]">
            {selectedPlanObj ? selectedPlanObj.price : "-"}
          </span>
        </div>
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

      {/* Submit Button */}
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
      {/* Custom Scrollbar Styles - must be inside the component */}
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
    </motion.form>
  );
};

export default ReservationForm;
