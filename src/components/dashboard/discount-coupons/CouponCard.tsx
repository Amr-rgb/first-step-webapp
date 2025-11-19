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
        isRTL
          ? "rounded-tl-lg rounded-bl-lg rounded-tr-none rounded-br-none"
          : "rounded-tr-lg rounded-br-lg rounded-tl-none rounded-bl-none"
      )}
      style={{ height: "220px" }}
    >
      {/* Left Status Tab */}
      <div
        className="relative flex min-w-[60px] items-center justify-center px-2"
        style={{ backgroundColor: config.bgColor }}
      >
        {/* Top semi-circle cutout - half on colored side */}
        <div
          className={cn(
            "absolute -top-2 h-6 w-6 rounded-[50px] bg-white border-b-2 border-primary-blue",
            isRTL
              ? "-left-3 border-l-2 -rotate-45"
              : "-right-3 border-r-2  rotate-45"
          )}
        />

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
        {/* Bottom semi-circle cutout - half on white side */}
        <div
          className={cn(
            "absolute -bottom-2 z-10 h-6 w-6  rounded-[50px] bg-white border-t-2 border-primary-blue",
            isRTL
              ? "-right-3 border-r-2 -rotate-45"
              : "-left-3 border-l-2 rotate-45"
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
      <div className="flex flex-1 flex-col gap-4 p-6 md:flex-row md:justify-between items-center">
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
          <div>
            <span className="text-sm font-bold text-gray-700">
              {t("activatedBranches")}:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {activatedBranches
                ? Array.isArray(activatedBranches)
                  ? activatedBranches.join(", ")
                  : activatedBranches
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
