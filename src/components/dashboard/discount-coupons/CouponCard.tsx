"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CouponCardProps {
  couponName: string;
  discountPercentage: number;
  discountValue: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  status: "active" | "not-started" | "paused" | "expired";
}

const statusConfig = {
  active: {
    label: "نشط",
    bgColor: "bg-green-500",
    textColor: "text-white",
  },
  "not-started": {
    label: "لم يبدأ بعد",
    bgColor: "bg-orange-500",
    textColor: "text-white",
  },
  paused: {
    label: "موقوف",
    bgColor: "bg-gray-500",
    textColor: "text-white",
  },
  expired: {
    label: "منتهي",
    bgColor: "bg-red-500",
    textColor: "text-white",
  },
};

export default function CouponCard({
  couponName,
  discountPercentage,
  discountValue,
  startDate,
  endDate,
  usageCount,
  status,
}: CouponCardProps) {
  const t = useTranslations("dashboard.coupons");
  const config = statusConfig[status];

  return (
    <Card className="relative flex overflow-visible rounded-lg border-2 border-primary-blue bg-white shadow-sm">
      {/* Left Status Tab */}
      <div
        className={cn(
          "relative flex min-w-[60px] items-center justify-center px-2",
          config.bgColor
        )}
      >
        {/* Top semi-circle cutout - half on colored side */}
        <div className="absolute -right-3 top-0 h-6 w-6 rounded-full bg-white" />

        {/* Bottom semi-circle cutout - half on colored side */}
        <div className="absolute -right-3 bottom-0 h-6 w-6 rounded-full bg-white" />

        <span
          className={cn(
            "relative z-10 whitespace-nowrap text-sm font-bold",
            config.textColor
          )}
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {config.label}
        </span>
      </div>

      {/* Dashed Line Separator with cutouts */}
      <div className="relative flex h-full w-0 flex-col items-center justify-center">
        {/* Top semi-circle cutout - half on white side */}
        <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-white" />

        {/* Bottom semi-circle cutout - half on white side */}
        <div className="absolute -left-3 bottom-0 h-6 w-6 rounded-full bg-white" />

        {/* Dashed vertical line */}
        <div className="absolute left-0 top-0 h-full w-px border-l-2 border-dashed border-gray-400" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-6 md:flex-row md:justify-between">
        {/* Right Column - Coupon Details */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-sm font-bold text-gray-700">
              {t("couponName")}:{" "}
            </span>
            <span className="text-sm text-gray-900">{couponName}</span>
          </div>
          <div>
            <span className="text-sm font-bold text-gray-700">
              {t("discountPercentage")}:{" "}
            </span>
            <span className="text-sm text-gray-900">
              % {discountPercentage}
            </span>
          </div>
          <div>
            <span className="text-sm font-bold text-gray-700">
              {t("discountValue")}:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {discountValue} {t("currency")}
            </span>
          </div>
        </div>

        {/* Left Column - Date and Usage */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-sm font-bold text-gray-700">
              {t("startDate")}:{" "}
            </span>
            <span className="text-sm text-gray-900">{startDate}</span>
          </div>
          <div>
            <span className="text-sm font-bold text-gray-700">
              {t("endDate")}:{" "}
            </span>
            <span className="text-sm text-gray-900">{endDate}</span>
          </div>
          <div>
            <span className="text-sm font-bold text-gray-700">
              {t("usageCount")}:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {usageCount} {t("times")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
