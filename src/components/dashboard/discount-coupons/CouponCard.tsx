"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

interface CouponCardProps {
  couponName: string;
  discountPercentage: number;
  discountValue: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  status: "active" | "not-started" | "paused" | "expired";
  activatedBranches?: string | string[];
}

export default function CouponCard({
  couponName,
  discountPercentage,
  discountValue,
  startDate,
  endDate,
  usageCount,
  status,
  activatedBranches,
}: CouponCardProps) {
  const t = useTranslations("dashboard.coupons");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const statusConfig = {
    active: {
      label: t("filters.active"),
      bgColor: "#47B881",
      textColor: "text-white",
    },
    "not-started": {
      label: t("filters.notStarted"),
      bgColor: "#FFAD0D",
      textColor: "text-white",
    },
    paused: {
      label: t("filters.paused"),
      bgColor: "#CACACA",
      textColor: "text-white",
    },
    expired: {
      label: t("filters.expired"),
      bgColor: "#F64C4C",
      textColor: "text-white",
    },
  };

  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        "relative flex overflow-visible border-2 border-primary-blue bg-white shadow-sm",
        "min-h-[220px] md:h-[220px]",
        isRTL
          ? "rounded-tl-lg rounded-bl-lg rounded-tr-none rounded-br-none"
          : "rounded-tr-lg rounded-br-lg rounded-tl-none rounded-bl-none"
      )}
    >
      {/* Left Status Tab */}
      <div
        className={cn(
          "relative flex items-center justify-center px-1 sm:px-2",
          "min-w-[40px] sm:min-w-[50px] md:min-w-[60px]"
        )}
        style={{ backgroundColor: config?.bgColor }}
      >
        {/* Top semi-circle cutout - half on colored side */}
        <div
          className={cn(
            "absolute -top-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[50px] bg-white border-b-2 border-primary-blue",
            isRTL
              ? "-left-2 sm:-left-2.5 md:-left-3 border-l-2 -rotate-45"
              : "-right-2 sm:-right-2.5 md:-right-3 border-r-2  rotate-45"
          )}
        />

        <span
          className={cn(
            "relative z-10 whitespace-nowrap text-xs sm:text-sm font-bold",
            config?.textColor
          )}
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {config?.label}
        </span>
      </div>

      {/* Dashed Line Separator with cutouts */}
      <div className="relative flex h-full w-0 flex-col items-center justify-center">
        {/* Bottom semi-circle cutout - half on white side */}
        <div
          className={cn(
            "absolute -bottom-2 z-10 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[50px] bg-white border-t-2 border-primary-blue",
            isRTL
              ? "-right-2 sm:-right-2.5 md:-right-3 border-r-2 -rotate-45"
              : "-left-2 sm:-left-2.5 md:-left-3 border-l-2 rotate-45"
          )}
        />

        {/* Dashed vertical line */}
        <div className="absolute left-0 top-0 h-full w-1 flex items-center justify-center">
          <img
            src="/assets/svgs/dashed-ticket-line.svg"
            alt=""
            className="h-full"
            style={{ width: "4px", objectFit: "fill" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6">
        {/* Small Screen: Two Column Layout (Labels | Values) */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 sm:gap-y-2 lg:hidden">
          {/* Labels Column */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <div className="text-xs sm:text-sm font-bold text-gray-700">
              {t("couponName")}:
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700">
              {t("discountPercentage")}:
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700">
              {t("discountValue")}:
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700">
              {t("startDate")}:
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700">
              {t("endDate")}:
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700">
              {t("usageCount")}:
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-700">
              {t("activatedBranches")}:
            </div>
          </div>
          {/* Values Column */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <div className="text-xs sm:text-sm text-gray-900 wrap-break">
              {couponName}
            </div>
            <div className="text-xs sm:text-sm text-gray-900">
              % {discountPercentage}
            </div>
            <div className="text-xs sm:text-sm text-gray-900">
              {discountValue} {t("currency")}
            </div>
            <div className="text-xs sm:text-sm text-gray-900 wrap-break">
              {startDate}
            </div>
            <div className="text-xs sm:text-sm text-gray-900 wrap-break">
              {endDate}
            </div>
            <div className="text-xs sm:text-sm text-gray-900">
              {usageCount} {t("times")}
            </div>
            <div className="text-xs sm:text-sm text-gray-900 wrap-break">
              {activatedBranches
                ? Array.isArray(activatedBranches)
                  ? activatedBranches.join(", ")
                  : activatedBranches
                : "-"}
            </div>
          </div>
        </div>

        {/* Medium+ Screen: Restructured Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-x-4 lg:gap-y-3 lg:items-start w-full">
          {/* First Row */}
          <div className="text-sm font-bold text-gray-700">
            {t("couponName")}:
          </div>
          <div className="text-sm text-gray-900 wrap-break">{couponName}</div>
          <div className="text-sm font-bold text-gray-700">
            {t("startDate")}:
          </div>
          <div className="text-sm text-gray-900 wrap-break">{startDate}</div>

          {/* Second Row */}
          <div className="text-sm font-bold text-gray-700">
            {t("discountPercentage")}:
          </div>
          <div className="text-sm text-gray-900">% {discountPercentage}</div>
          <div className="text-sm font-bold text-gray-700">{t("endDate")}:</div>
          <div className="text-sm text-gray-900 wrap-break">{endDate}</div>

          {/* Third Row */}
          <div className="text-sm font-bold text-gray-700">
            {t("discountValue")}:
          </div>
          <div className="text-sm text-gray-900">
            {discountValue} {t("currency")}
          </div>
          <div className="text-sm font-bold text-gray-700">
            {t("usageCount")}:
          </div>
          <div className="text-sm text-gray-900">
            {usageCount} {t("times")}
          </div>

          {/* Fourth Row - Branches takes full remaining width */}
          <div className="text-sm font-bold text-gray-700">
            {t("activatedBranches")}:
          </div>
          <div className="lg:col-span-3 text-sm text-gray-900 wrap-break">
            {activatedBranches
              ? Array.isArray(activatedBranches)
                ? activatedBranches.join(", ")
                : activatedBranches
              : "-"}
          </div>
        </div>
      </div>
    </Card>
  );
}
