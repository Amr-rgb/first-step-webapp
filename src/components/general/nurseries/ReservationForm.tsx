"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  UserPlus,
  X,
  AlertCircle,
  CheckCircle2,
  Ticket,
  CalendarCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/general/DatePicker";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { getBranchPricingAction } from "@/actions/nurseryActions";
import { parentService as dashboardParentService } from "@/services/dashboardApi";
import { parentService, enrollmentService } from "@/services/api";
import { applyPromoCodeAction } from "@/actions/promoCodeActions";
import { ApplyPromoCodeResponse } from "@/services/dashboardApi";
import { useAuthUser, useAuthStore } from "@/store/authStore";
import { toastSuccess, toastError } from "@/lib/toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
import ProgramCard from "@/app/[locale]/(website)/nurseries/[name]/_components/ProgramCard";
import { dashboardIcons } from "@/components/general/icons";

// --- Types & Interfaces ---

interface ReservationFormProps {
  nurseryName: string;
  selectedProgram: string;
  locale: "ar" | "en";
  selectedBranch?: string;
  selectedPlan?: string;
  isDialogMode?: boolean;
  onClose?: () => void;
  preSelectedPlanId?: number | string;
  showOnlySelectedPlan?: boolean;
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
  start_age: number | { type: string; age: number };
  end_age: number | { type: string; age: number };
  count: number;
  enrollment_type: string;
  price_amount: number;
}

// --- Constants ---

const TIME_OPTIONS = [
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

// --- Sub-Components ---

const NotesSection = ({ locale }: { locale: "ar" | "en" }) => {
  const t = useTranslations("reservationForm.labels");
  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="text-base font-normal text-primary mb-2">{t("notes")}</h4>
      <ul className="font-medium text-mid-gray list-disc list-inside">
        <li>{t("note1")}</li>
        <li>{t("note2")}</li>
        <li>{t("note3")}</li>
      </ul>
    </div>
  );
};

const SuccessView = ({
  locale,
  onClose,
  onDashboard,
}: {
  locale: "ar" | "en";
  onClose: () => void;
  onDashboard: () => void;
}) => {
  const t = useTranslations("reservationForm.success");
  const tLabels = useTranslations("reservationForm.labels");

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
      <h2 className="text-2xl font-bold text-primary mb-4">
        {tLabels("successTitle")}
      </h2>
      <p className="text-gray-600 mb-6">{tLabels("successDesc")}</p>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">
        <button
          onClick={onClose}
          className="px-6 py-2 font-bold rounded-lg transition w-full sm:w-auto
            bg-primary text-white shadow hover:bg-[#3646a5] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {tLabels("submitAnother")}
        </button>
        <button
          onClick={onDashboard}
          className="px-6 py-2 font-bold rounded-lg transition w-full sm:w-auto
            border-2 border-primary text-primary bg-white hover:bg-[#f7f8fa] hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {tLabels("goToReservations")}
        </button>
      </div>
    </motion.div>
  );
};

const PlanSelection = ({
  plans,
  selectedPlanId,
  onSelect,
  showOnlySelected,
  locale,
}: {
  plans: Plan[];
  selectedPlanId: string | number;
  onSelect: (id: string | number) => void;
  showOnlySelected: boolean;
  locale: "ar" | "en";
}) => {
  const t = useTranslations("reservationForm.labels");
  const visiblePlans = showOnlySelected
    ? plans.filter(
        (p) => p.id === selectedPlanId || p.planId === selectedPlanId,
      )
    : plans;

  if (showOnlySelected && visiblePlans.length > 0) {
    const p = visiblePlans[0];
    return (
      <div>
        <p className="font-bold mb-6 text-primary text-base">{t("program")}</p>
        <ProgramCard
          title={p.name}
          durationLabel={p.name}
          price={parseFloat(p.price.replace(/[^\d.]/g, "") || "0")}
          isSelected={true}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "flex gap-4 mb-6",
        showOnlySelected
          ? "justify-center items-center"
          : "overflow-x-auto pb-2 custom-scrollbar justify-start",
        plans.length <= 4 &&
          !showOnlySelected &&
          "flex-row justify-center items-center",
      )}
      style={{
        maxWidth: showOnlySelected || plans.length > 4 ? "100%" : "48rem",
        margin: "0 auto",
        padding: showOnlySelected ? "8px 0" : "8px 8px",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 60 }}
    >
      {visiblePlans.map((p) => {
        const isSelected =
          selectedPlanId === p.id || selectedPlanId === p.planId;

        return (
          <button
            key={p.id}
            type="button"
            onClick={() => !showOnlySelected && onSelect(p.id)}
            disabled={showOnlySelected}
            className={cn(
              "flex flex-col items-center py-3 px-4 rounded-xl border-2 transition font-bold text-base",
              showOnlySelected
                ? ""
                : plans.length > 4
                  ? "min-w-[120px] shrink-0"
                  : "flex-1",
              isSelected
                ? "bg-primary text-white border-primary shadow border-dashed outline-dashed outline-2 outline-primary"
                : "bg-[#F7F8FA] text-gray-700 border-gray-300 border-solid focus:outline-none",
              showOnlySelected && "cursor-default",
            )}
            tabIndex={showOnlySelected ? -1 : 0}
          >
            <span
              className={cn(
                "text-lg font-extrabold mb-1",
                isSelected ? "text-white" : "text-primary",
              )}
            >
              {p.price}
            </span>
            <span className="w-full h-px bg-[#DADADA] mb-1" />
            <span
              className={cn(
                "text-base font-bold",
                isSelected ? "text-white" : "text-primary",
              )}
            >
              {p.name}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
};

const TimeSelection = ({
  enrollmentType,
  fromTime,
  toTime,
  timeOptions,
  locale,
}: {
  enrollmentType?: string;
  fromTime: string;
  toTime: string;
  timeOptions: string[];
  locale: "ar" | "en";
}) => {
  const t = useTranslations("reservationForm.labels");

  const label = useMemo(() => {
    switch (enrollmentType) {
      case "hour":
        return t("numberOfHours");
      case "day":
        return t("numberOfDays");
      case "week":
        return t("numberOfWeeks");
      case "month":
        return t("numberOfMonths");
      default:
        return t("duration");
    }
  }, [enrollmentType, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4, type: "spring", stiffness: 60 }}
    >
      <label className="block font-bold mb-2 text-primary text-center">
        {label}
      </label>
      <div className="flex flex-col items-center gap-2 max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto px-2 pb-2">
          {timeOptions.map((t) => {
            const isSelected = t === fromTime || t === toTime;
            const isInRange = !!(
              fromTime &&
              toTime &&
              timeOptions.indexOf(t) > timeOptions.indexOf(fromTime) &&
              timeOptions.indexOf(t) < timeOptions.indexOf(toTime)
            );

            return (
              <button
                key={t}
                type="button"
                className={cn(
                  "px-3 py-1 rounded-full border-2 text-sm font-bold transition",
                  isSelected
                    ? "bg-primary text-white border-primary"
                    : isInRange
                      ? "bg-[#E6E9F8] text-primary border-[#B6BEE6]"
                      : "bg-white text-primary border-gray-300",
                  "focus:outline-none focus:ring-2 focus:ring-primary",
                )}
                style={{ minWidth: 56 }}
                disabled
                aria-pressed={isSelected || isInRange}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {fromTime && toTime
            ? t("timeRange", { start: fromTime, end: toTime })
            : t("autoDuration")}
        </div>
      </div>
    </motion.div>
  );
};

const ChildSelection = ({
  children,
  selectedIds,
  onSelect,
  isLoading,
  error,
  locale,
  router,
}: {
  children: any[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  isLoading: boolean;
  error: any;
  locale: "ar" | "en";
  router: any;
}) => {
  const t = useTranslations("reservationForm.labels");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4, type: "spring", stiffness: 60 }}
    >
      <p className="font-bold mb-6 text-primary">{t("selectChildren")}</p>
      <div
        className="flex gap-4 justify-start overflow-x-auto pb-2 custom-scrollbar max-w-3xl mx-auto"
        style={{
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <motion.div
              key={idx}
              className="rounded-lg bg-gray-200 animate-pulse min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 flex flex-col items-center justify-center shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-4" />
              <div className="w-16 h-4 bg-gray-300 rounded mb-2" />
              <div className="w-8 h-3 bg-gray-300 rounded" />
            </motion.div>
          ))}

        {!isLoading && error && (
          <div
            onClick={() => router.push(`/${locale}/dashboard/parent/children`)}
            className="flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 bg-blue-50 border-blue-300 mx-auto cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all shrink-0"
          >
            <div className="w-16 h-16 flex items-center justify-center mb-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <span className="text-sm text-blue-700 font-bold text-center mt-1">
              {t("youHaveNoChildren")}
            </span>
          </div>
        )}

        {!isLoading &&
          !error &&
          children &&
          children.length > 0 &&
          children.map((child: any, idx: number) => {
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
            const displayName =
              locale === "ar" ? nameAr || nameEn : nameEn || nameAr;

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
                onClick={() => onSelect(idStr)}
                className={cn(
                  "flex flex-col items-center p-2 rounded-lg border-2 transition min-w-[110px] w-24 h-32 md:min-w-[120px] md:w-28 md:h-36 justify-start shrink-0",
                  selectedIds.includes(idStr)
                    ? "border-primary shadow bg-white"
                    : "border-gray-300 bg-white",
                  "focus:outline-none hover:shadow-lg",
                )}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-2 mt-2 transition-all duration-200">
                  <Image
                    src={
                      gender === "boy" || gender === "male"
                        ? "/assets/illustrations/boy.png"
                        : "/assets/illustrations/girl.png"
                    }
                    alt={(displayName || "Child").toString()}
                    width={64}
                    height={64}
                    style={{
                      objectFit: "contain",
                      filter: selectedIds.includes(idStr)
                        ? "none"
                        : "grayscale(100%) brightness(0.8)",
                      transform: selectedIds.includes(idStr)
                        ? "scale(1.1)"
                        : "scale(1)",
                      transition: "all 0.2s",
                    }}
                  />
                </div>
                <span
                  className={cn(
                    "font-bold text-sm text-center mt-1 line-clamp-2 w-full",
                    selectedIds.includes(idStr)
                      ? "text-primary"
                      : "text-gray-600",
                  )}
                >
                  {displayName}
                </span>
              </motion.button>
            );
          })}

        {!isLoading && !error && children && children.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 min-w-full text-center">
            <Image
              src="/assets/illustrations/empty.png"
              alt="No children"
              width={120}
              height={120}
              className="mb-4 opacity-50"
            />
            <h3 className="text-lg font-bold text-primary mb-2">
              {t("noChildren")}
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              {t("noChildrenDesc")}
            </p>
            <Button
              type="button"
              onClick={() =>
                router.push(`/${locale}/dashboard/parent/children`)
              }
              className="mt-4 bg-primary hover:bg-[#3646a5] text-white"
            >
              {t("addNewChild")}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CouponSection = ({
  couponCode,
  setCouponCode,
  onApply,
  onRemove,
  isApplying,
  promoDetails,
  error,
  locale,
}: {
  couponCode: string;
  setCouponCode: (code: string) => void;
  onApply: () => void;
  onRemove: () => void;
  isApplying: boolean;
  promoDetails: ApplyPromoCodeResponse | null;
  error: string | null;
  locale: "ar" | "en";
}) => {
  const t = useTranslations("reservationForm");
  const tErrors = useTranslations("reservationForm.errors");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, type: "spring", stiffness: 60 }}
      className="max-w-2xl mx-auto mb-4"
    >
      <p className="text-primary font-bold mb-3">
        {t("labels.discountCoupon")}:
      </p>

      {promoDetails ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-purple-50 rounded-lg border border-purple-200 p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-1.5 rounded-full">
                <CheckCircle2 size={16} className="text-purple-600" />
              </div>
              <div>
                <span className="text-purple-700 font-bold block leading-none">
                  {promoDetails.promo_code}
                </span>
                <span className="text-purple-600 text-xs mt-0.5 block">
                  {t("success.couponApplied")}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-purple-100 pt-2 mt-2">
            <span className="text-purple-800">{t("summary.saved")}</span>
            <span className="font-bold text-purple-800">
              {promoDetails.discount} {locale === "ar" ? "ر.س" : "SAR"}
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 relative">
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={
                locale === "ar"
                  ? "أدخل الكود (مثال: SUMMER20)"
                  : "Enter code (e.g. SUMMER20)"
              }
              className={cn(
                "flex-1 h-10 transition-all",
                error
                  ? "border-red-300 focus-visible:ring-red-200 bg-red-50"
                  : "",
              )}
            />
            <Button
              type="button"
              onClick={onApply}
              disabled={isApplying || !couponCode.trim()}
              className={cn(
                "px-4 h-10 min-w-[100px]",
                isApplying ? "bg-opacity-80" : "",
              )}
            >
              {isApplying ? (
                <LoadingSpinner size="sm" />
              ) : (
                t("labels.tryCoupon")
              )}
            </Button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1.5 text-red-500 text-xs mt-1 px-1"
              >
                <AlertCircle size={12} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <p
        className={cn(
          "text-[10px] text-gray-400 flex items-start gap-1 mt-3 leading-tight",
          locale === "ar" ? "text-right" : "text-left",
        )}
      >
        <AlertCircle size={10} className="mt-0.5 shrink-0" />
        {t("labels.paymentNotice")}
      </p>
    </motion.div>
  );
};

const BookingSummary = ({
  locale,
  planName,
  fromTime,
  toTime,
  childrenCount,
  date,
  price,
  promoDetails,
  couponProps,
}: {
  locale: "ar" | "en";
  planName: string;
  fromTime: string;
  toTime: string;
  childrenCount: number;
  date: string;
  price: string;
  promoDetails: ApplyPromoCodeResponse | null;
  couponProps: {
    couponCode: string;
    setCouponCode: (code: string) => void;
    onApply: () => void;
    onRemove: () => void;
    isApplying: boolean;
    error: string | null;
  };
}) => {
  const t = useTranslations("reservationForm.summary");
  const tLabels = useTranslations("reservationForm.labels");

  const numericPrice = parseFloat(price.replace(/[^\d.]/g, "") || "0");
  const subtotal = numericPrice * childrenCount;

  // Calculate final total based on whether promo is applied
  const finalTotal = promoDetails ? promoDetails.final_amount : subtotal;
  const currency = locale === "ar" ? "ر.س" : "SAR";

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-base text-primary mb-4">
        {tLabels("bookingSummary")}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-base">
          <span className="text-mid-gray font-medium">
            {tLabels("program")}
          </span>
          <span className="text-mid-gray font-medium">{planName || "-"}</span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="text-mid-gray font-medium">
            {tLabels("startTime")}
          </span>
          <span className="text-mid-gray font-medium" dir="ltr">
            {date
              ? format(new Date(date), "EEEE yyyy/MM/dd", {
                  locale: locale === "ar" ? ar : undefined,
                })
              : "-"}{" "}
            {fromTime}
          </span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="text-mid-gray font-medium">
            {tLabels("duration")}
          </span>
          <span className="text-mid-gray font-medium">{toTime || "-"}</span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="text-mid-gray font-medium">
            {tLabels("paymentMethod")}
          </span>
          <span className="text-mid-gray font-medium">
            {tLabels("paymentMayser")}
          </span>
        </div>
        <div className="flex justify-between items-center text-base pt-3 border-t border-dashed border-gray-200">
          <span className="text-mid-gray font-medium">
            {tLabels("required")}
          </span>
          <span className="text-mid-gray font-bold">
            {subtotal} {currency}
          </span>
        </div>

        {/* Coupon Entry Section */}
        <div className="pb-2">
          {!promoDetails ? (
            <>
              <p className="text-mid-gray font-medium mb-3">
                {tLabels("discountCoupon")}
              </p>
              <div className="flex gap-2 items-center">
                <Input
                  value={couponProps.couponCode}
                  onChange={(e) => couponProps.setCouponCode(e.target.value)}
                  placeholder={
                    locale === "ar" ? "مثال: night15" : "Example: night15"
                  }
                  className={cn(
                    "flex-1 h-12 rounded-xl text-center border-gray-200 focus-visible:ring-primary/20",
                    couponProps.error ? "border-red-300 bg-red-50" : "",
                  )}
                />

                <Button
                  type="button"
                  size="sm"
                  onClick={couponProps.onApply}
                  disabled={
                    couponProps.isApplying || !couponProps.couponCode.trim()
                  }
                >
                  {couponProps.isApplying ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    tLabels("tryCoupon")
                  )}
                </Button>
              </div>
              {couponProps.error && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  {couponProps.error}
                </p>
              )}
              <p className="text-[12px] text-info flex items-center justify-center gap-1 mt-4 leading-tight font-medium">
                <Ticket size={14} className="shrink-0" />
                {tLabels("paymentNotice")}
              </p>
            </>
          ) : (
            <div className="flex justify-between items-center text-base">
              <span className="text-mid-gray font-medium">
                {tLabels("discountCoupon")}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-info font-bold">
                  {promoDetails.promo_code}
                </span>
                <button
                  type="button"
                  onClick={couponProps.onRemove}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-secondary-mint-green mt-6 pt-4 space-y-4">
        {promoDetails && (
          <div className="flex justify-between items-center text-base">
            <span className="text-mid-gray font-medium">
              {tLabels("discount")}
            </span>
            <span className="text-mid-gray font-medium">
              {promoDetails.discount} {currency}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="font-bold text-primary">
            {tLabels("totalAfterDiscount")}
          </span>
          <span className="font-extrabold text-2xl text-primary">
            {finalTotal > 0 ? finalTotal.toFixed(0) : "0"}{" "}
            <span className="text-sm font-medium">{currency}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

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
  const t = useTranslations("reservationForm");
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
  const authUser = typeof window !== "undefined" ? useAuthUser() : null;

  // -- State --
  const [selectedPlanId, setSelectedPlanId] = useState<string | number>(
    preSelectedPlanId || 4,
  );
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Coupon State using API definition
  const [couponCode, setCouponCode] = useState<string>("");
  const [promoDetails, setPromoDetails] =
    useState<ApplyPromoCodeResponse | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [submitSuccess, setSubmitSuccess] = useState(
    typeof window !== "undefined" && searchParams?.get("payment") === "success",
  );

  // -- Queries --
  const { data: apiPlans = [] } = useQuery({
    queryKey: ["branch-plans", selectedBranch],
    queryFn: () => getBranchPricingAction(selectedBranch!),
    enabled: !!selectedBranch && selectedBranch !== "",
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: realChildren = [],
    isLoading: isChildrenLoading,
    error: childrenError,
  } = useQuery({
    queryKey: ["parent-children"],
    queryFn: () => dashboardParentService.getParentChildren(),
    enabled: !submitSuccess && !!authUser,
    staleTime: 5 * 60 * 1000,
  });

  // Debug logging for children data
  useEffect(() => {
    console.log("[ReservationForm] Children query state:", {
      isLoading: isChildrenLoading,
      hasError: !!childrenError,
      error: childrenError,
      childrenCount: realChildren?.length,
      children: realChildren,
      authUser: !!authUser,
      submitSuccess,
      queryEnabled: !submitSuccess && !!authUser,
    });
  }, [realChildren, isChildrenLoading, childrenError, authUser, submitSuccess]);

  // -- Derived Data --
  const defaultPlans: Plan[] = useMemo(() => {
    const currency = locale === "ar" ? "ر.س" : "SAR";
    return [
      {
        id: 1,
        type: "monthly",
        name: t("plans.monthly"),
        price: `50 ${currency}`,
        planId: 1,
      },
      {
        id: 2,
        type: "weekly",
        name: t("plans.weekly"),
        price: `50 ${currency}`,
        planId: 2,
      },
      {
        id: 3,
        type: "daily",
        name: t("plans.daily"),
        price: `50 ${currency}`,
        planId: 3,
      },
      {
        id: 4,
        type: "hourly",
        name: t("plans.hourly"),
        price: `50 ${currency}`,
        planId: 4,
      },
    ];
  }, [locale, t]);

  const planList: Plan[] = useMemo(() => {
    if (apiPlans.length > 0) {
      return apiPlans.map((apiPlan: ApiPlan) => ({
        id: apiPlan.id,
        type: apiPlan.enrollment_type as PlanType,
        name: apiPlan.title,
        price: `${apiPlan.price_amount} ${locale === "ar" ? "ر.س" : "SAR"}`,
        planId: apiPlan.id,
      }));
    }
    if (!selectedBranch) return defaultPlans;
    return [];
  }, [apiPlans, selectedBranch, defaultPlans, locale]);

  const selectedPlanObj = useMemo(
    () =>
      planList.find(
        (p) => p.id === selectedPlanId || p.planId === selectedPlanId,
      ),
    [planList, selectedPlanId],
  );

  const selectedApiPlan = useMemo(
    () => apiPlans.find((plan: ApiPlan) => plan.id === selectedPlanId),
    [apiPlans, selectedPlanId],
  );

  const dynamicTimeOptions = useMemo(() => {
    if (!selectedApiPlan) return TIME_OPTIONS;
    const { enrollment_type } = selectedApiPlan;

    const getUnitLabel = (count: number, type: string) => {
      let unitKey = type;
      if (locale === "ar") {
        if (count >= 3 && count <= 10) {
          unitKey = `${type}s`;
        }
      } else if (count > 1) {
        unitKey = `${type}s`;
      }
      return t(`units.${unitKey as any}`);
    };

    switch (enrollment_type) {
      case "hour":
        return TIME_OPTIONS;
      case "day":
        return Array.from(
          { length: 30 },
          (_, i) => `${i + 1} ${getUnitLabel(i + 1, "day")}`,
        );
      case "week":
        return Array.from(
          { length: 4 },
          (_, i) => `${i + 1} ${getUnitLabel(i + 1, "week")}`,
        );
      case "month":
        return Array.from(
          { length: 12 },
          (_, i) => `${i + 1} ${getUnitLabel(i + 1, "month")}`,
        );
      default:
        return TIME_OPTIONS;
    }
  }, [selectedApiPlan, t, locale]);

  // -- Effects --

  // Initial Plan Selection Logic
  useEffect(() => {
    if (planList.length > 0 && !hasInitialized) {
      let foundPlanId = selectedPlanId;
      const queryPlanId = searchParams?.get("plan");

      const findIdByNameOrType = (val: string) => {
        const found = planList.find(
          (p) =>
            p.name === val ||
            p.type === val ||
            p.name.toLowerCase() === val.toLowerCase(),
        );
        return found?.id;
      };

      if (queryPlanId) {
        const planFromQuery = planList.find(
          (p) =>
            p.id === Number(queryPlanId) || p.planId === Number(queryPlanId),
        );
        if (planFromQuery) foundPlanId = planFromQuery.id;
      } else if (preSelectedPlanId) {
        foundPlanId = preSelectedPlanId;
      } else if (selectedPlan) {
        foundPlanId = findIdByNameOrType(selectedPlan) || foundPlanId;
      } else if (selectedProgram) {
        foundPlanId = findIdByNameOrType(selectedProgram) || foundPlanId;
      } else if (!selectedPlanId && planList[0]) {
        foundPlanId = planList[0].id;
      }

      if (foundPlanId && foundPlanId !== selectedPlanId) {
        setSelectedPlanId(foundPlanId);
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
    searchParams,
  ]);

  // Auto-set time options based on plan
  useEffect(() => {
    if (selectedApiPlan) {
      const { enrollment_type, count } = selectedApiPlan;

      const getLabel = (c: number, type: string) => {
        let unitKey = type;
        if (locale === "ar") {
          if (c >= 3 && c <= 10) {
            unitKey = `${type}s`;
          }
        } else if (c > 1) {
          unitKey = `${type}s`;
        }
        return t(`units.${unitKey as any}`);
      };

      switch (enrollment_type) {
        case "hour":
          setFromTime("08:00");
          setToTime("16:00");
          break;
        case "day":
          setFromTime(`1 ${getLabel(1, "day")}`);
          setToTime(`${count} ${getLabel(count, "day")}`);
          break;
        case "week":
          setFromTime(`1 ${getLabel(1, "week")}`);
          setToTime(`${count} ${getLabel(count, "week")}`);
          break;
        case "month":
          setFromTime(`1 ${getLabel(1, "month")}`);
          setToTime(`${count} ${getLabel(count, "month")}`);
          break;
        case "year":
          setFromTime(`1 ${getLabel(1, "year")}`);
          setToTime(`${count} ${getLabel(count, "year")}`);
          break;
        default:
          setFromTime("");
          setToTime("");
      }
    } else {
      setFromTime("");
      setToTime("");
    }
  }, [selectedPlanId, selectedApiPlan, locale, t]);

  // Restore Auth after success redirect
  useEffect(() => {
    if (submitSuccess && typeof window !== "undefined") {
      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          if (authData?.state?.token && authData?.state?.user) {
            useAuthStore
              .getState()
              .setUserToken(authData.state.user, authData.state.token);
          }
        }
      } catch (e) {
        console.error("Error restoring auth:", e);
      }
    }
  }, [submitSuccess]);

  // -- Handlers --

  const handleApplyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError(t("errors.enterCoupon"));
      return;
    }
    if (!selectedBranch) {
      toastError(t("errors.selectBranch"));
      return;
    }
    if (!selectedPlanId) {
      toastError(t("errors.selectPlan"));
      return;
    }
    if (selectedChildren.length === 0) {
      setCouponError(t("errors.selectChild"));
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const response = await applyPromoCodeAction({
        branch_price_id: Number(selectedPlanId),
        branch_id: Number(selectedBranch),
        promo_code: couponCode.trim().toUpperCase(),
        child_count: selectedChildren.length,
      });

      setPromoDetails(response);
      toastSuccess(t("success.couponApplied"));
    } catch (error: any) {
      console.error("Coupon error:", error);
      let errorMessage = t("errors.failedToApply");

      const hasValidationErrors =
        error?.errors && Object.keys(error.errors).length > 0;

      if (error?.message?.toLowerCase().includes("usage limit")) {
        errorMessage = t("errors.usageLimit");
      } else if (error?.message?.toLowerCase().includes("expired")) {
        errorMessage = t("errors.expiredCoupon");
      } else if (
        error?.message?.toLowerCase().includes("invalid") ||
        error?.message?.toLowerCase().includes("not found") ||
        error?.status === 404
      ) {
        errorMessage = t("errors.invalidCoupon");
      } else if (hasValidationErrors) {
        if (error.errors.child_count) {
          errorMessage = t("errors.childCountRequired");
        } else {
          errorMessage = t("errors.invalidData");
        }
      } else {
        errorMessage = error?.message || errorMessage;
      }
      setCouponError(errorMessage);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setPromoDetails(null);
    setCouponCode("");
    setCouponError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("[ReservationForm] Form submission started");
    console.log("[ReservationForm] Selected children:", selectedChildren);
    console.log("[ReservationForm] Selected plan:", selectedPlanObj);
    console.log("[ReservationForm] Selected branch:", selectedBranch);
    console.log("[ReservationForm] Auth user:", authUser);

    const planId = selectedPlanObj?.planId;
    if (!planId) {
      console.error("[ReservationForm] No plan selected");
      toastError(t("errors.noPlanSelected"));
      setIsSubmitting(false);
      return;
    }
    if (!selectedBranch) {
      console.error("[ReservationForm] No branch selected");
      toastError(t("errors.noBranchSelected"));
      setIsSubmitting(false);
      return;
    }

    const phone =
      (authUser as any)?.phone || (authUser as any)?.user?.phone || "";
    console.log("[ReservationForm] Parent phone:", phone);

    try {
      const enrollmentPayload: any = {
        center_branch_id: Number(selectedBranch),
        branch_price_id: Number(planId),
        parent_phone: phone,
        children: selectedChildren.map((id) => Number(id)),
      };

      if (promoDetails && promoDetails.promo_code) {
        enrollmentPayload.title = promoDetails.promo_code;
      }

      if (selectedApiPlan?.enrollment_type === "hour") {
        enrollmentPayload.day_string = bookingDate;
        enrollmentPayload.starting_time = fromTime || "09:00";
      } else if (bookingDate) {
        enrollmentPayload.starting_date = bookingDate;
      }

      console.log("[ReservationForm] Enrollment payload:", enrollmentPayload);

      const result =
        await enrollmentService.createEnrollment(enrollmentPayload);
      console.log("[ReservationForm] Enrollment created successfully:", result);

      setIsSubmitting(false);
      setSubmitSuccess(true);
      toastSuccess(t("success.bookingSent"));

      if (isDialogMode && onClose) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (err: any) {
      console.error("[ReservationForm] Booking error:", err);
      console.error("[ReservationForm] Error details:", {
        message: err?.message,
        data: err?.data,
        error: err?.error,
        status: err?.status,
        errors: err?.errors,
      });
      setIsSubmitting(false);

      const errorTitle = t("errors.bookingError");
      let errorDescription = t("errors.submissionFailed");

      if (err?.data?.error) errorDescription = err.data.error;
      else if (err?.error) errorDescription = err.error;
      else if (err?.message) errorDescription = err.message;

      toastError(errorTitle, errorDescription);
    }
  };

  const handleDashboardRedirect = () => {
    const dashboardReservationsUrl = `/${locale}/dashboard/parent/bookings`;
    const loginUrl = `/${locale}/(website)/(auth)/sign-in?redirect=${encodeURIComponent(
      dashboardReservationsUrl,
    )}`;

    if (authUser) {
      router.push(dashboardReservationsUrl);
    } else {
      // Try to recover session or redirect to login
      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          if (authData?.state?.token) {
            router.push(dashboardReservationsUrl);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      router.push(loginUrl);
    }
  };

  // -- Render --

  if (submitSuccess) {
    return (
      <SuccessView
        locale={locale}
        onClose={() => setSubmitSuccess(false)}
        onDashboard={handleDashboardRedirect}
      />
    );
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <>
      <motion.form
        id={isDialogMode ? "reservation-form" : undefined}
        onSubmit={handleSubmit}
        dir={dir}
        className={cn("space-y-8", isDialogMode && "pb-4")}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      >
        {/* Notice */}
        {!isDialogMode && (
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
            {t("labels.termsNotice")}
          </motion.div>
        )}

        {/* Layout Grid */}
        <div
          className={cn(
            isDialogMode ? "lg:grid lg:grid-cols-12 lg:gap-12" : "",
          )}
        >
          {/* Left Column (Sidebar-like in RTL) */}
          {isDialogMode && (
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <BookingSummary
                locale={locale}
                planName={selectedPlanObj?.name || ""}
                fromTime={fromTime}
                toTime={toTime}
                childrenCount={selectedChildren.length}
                date={bookingDate}
                price={selectedPlanObj?.price || ""}
                promoDetails={promoDetails}
                couponProps={{
                  couponCode,
                  setCouponCode,
                  onApply: handleApplyCoupon,
                  onRemove: handleRemoveCoupon,
                  isApplying: isApplyingCoupon,
                  error: couponError,
                }}
              />

              <NotesSection locale={locale} />
            </div>
          )}

          {/* Right Column (Main Form) */}
          <div
            className={cn(
              isDialogMode
                ? "lg:col-span-6 order-2 lg:order-1 space-y-6"
                : "space-y-6",
            )}
          >
            <PlanSelection
              plans={planList}
              selectedPlanId={selectedPlanId}
              onSelect={setSelectedPlanId}
              showOnlySelected={showOnlySelectedPlan}
              locale={locale}
            />

            {/* Time Selection - visible if needed or for duration feedback
            <TimeSelection
              enrollmentType={selectedApiPlan?.enrollment_type}
              fromTime={fromTime}
              toTime={toTime}
              timeOptions={dynamicTimeOptions}
              locale={locale}
            /> */}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <label className="block mb-2 text-base text-mid-gray">
                {t("labels.startTime")}
              </label>
              <DatePicker
                standalone
                allowFuture
                value={bookingDate ? new Date(bookingDate) : undefined}
                onChange={(date) =>
                  setBookingDate(date ? format(date, "yyyy-MM-dd") : "")
                }
                disabled={(date: Date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </motion.div>

            <ChildSelection
              children={realChildren}
              isLoading={isChildrenLoading}
              error={childrenError}
              selectedIds={selectedChildren}
              onSelect={(id) =>
                setSelectedChildren((prev) =>
                  prev.includes(id)
                    ? prev.filter((c) => c !== id)
                    : [...prev, id],
                )
              }
              locale={locale}
              router={router}
            />
          </div>
        </div>

        {/* Submit Button (Non-Dialog) */}
        {!isDialogMode && (
          <Button
            type="submit"
            size="sm"
            disabled={
              isSubmitting || !bookingDate || selectedChildren.length === 0
            }
          >
            {isSubmitting ? t("labels.submitting") : t("labels.confirmBooking")}
          </Button>
        )}
      </motion.form>

      {/* Submit Button (Dialog Mode) */}
      {isDialogMode && (
        <div className="sticky bottom-0 bg-white border-t pt-4 mt-8 -mx-6 px-6 pb-4 z-20">
          <Button
            size="sm"
            type="submit"
            form="reservation-form"
            className="w-full"
            disabled={
              isSubmitting || !bookingDate || selectedChildren.length === 0
            }
          >
            {isSubmitting ? t("labels.submitting") : t("labels.confirmBooking")}
          </Button>
        </div>
      )}
    </>
  );
};

export default ReservationForm;
