"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FilterButtons } from "@/components/common/FilterButtons";
import CouponCard from "./CouponCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { centerService } from "@/services/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { toastSuccess, toastError } from "@/lib/toast";

type FilterType = "all" | "active" | "not-started" | "paused" | "expired";

type CouponStatus = "active" | "not-started" | "paused" | "expired";

interface PromocodeApiResponse {
  id: number;
  title: string;
  description: string;
  percentage: string;
  start_date: string;
  end_date: string;
  max_number_of_usage: number;
  kind_of_child: string;
  status: string;
  color: string;
  amount: string;
  center_id: number | null;
  branch_id: number | null;
  paid_enrollments_count: number;
  centers: Array<{ id: number; name: string }>;
  branches: Array<{ id: number; name: string; center_id: number }>;
  is_global: boolean;
  scope_type: string;
  created_at: string;
  updated_at: string;
}

interface Coupon {
  id: string;
  couponName: string;
  discountPercentage: number;
  discountValue: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  status: CouponStatus;
}

export default function Coupons() {
  const t = useTranslations("dashboard.coupons");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch promocodes from API
  const {
    data: promocodesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["center-promocodes"],
    queryFn: () => centerService.getPromocodes(),
  });

  // Request new promocode mutation
  const requestPromocodeMutation = useMutation({
    mutationFn: () => centerService.requestNewPromocode(),
    onSuccess: () => {
      toastSuccess(
        t("requestSuccess") || "Request submitted successfully",
        t("requestSuccessDescription") ||
          "Your request for a new promocode has been submitted. We will review it shortly."
      );
    },
    onError: (error: any) => {
      toastError(
        t("requestError") || "Request failed",
        error?.message ||
          t("requestErrorDescription") ||
          "Failed to submit your request. Please try again later."
      );
    },
  });

  // Transform promocodes API data to coupon format
  const coupons: Coupon[] = useMemo(() => {
    if (!promocodesResponse?.data) return [];

    const promocodes: PromocodeApiResponse[] = promocodesResponse.data;

    return promocodes.map((promo) => {
      // Map API status to component status
      let status: CouponStatus = "expired";
      const apiStatus = promo.status.toLowerCase();
      
      if (apiStatus === "active") {
        status = "active";
      } else if (apiStatus === "not-started" || apiStatus === "not_started") {
        status = "not-started";
      } else if (apiStatus === "paused") {
        status = "paused";
      } else {
        status = "expired";
      }

      // Format dates
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
      };

      return {
        id: promo.id.toString(),
        couponName: promo.title,
        discountPercentage: parseFloat(promo.percentage),
        discountValue: parseFloat(promo.amount),
        startDate: formatDate(promo.start_date),
        endDate: formatDate(promo.end_date),
        usageCount: promo.paid_enrollments_count,
        status,
      };
    });
  }, [promocodesResponse, locale]);

  const filters = [
    { value: "all" as FilterType, label: t("filters.all") },
    { value: "active" as FilterType, label: t("filters.active") },
    { value: "not-started" as FilterType, label: t("filters.notStarted") },
    { value: "paused" as FilterType, label: t("filters.paused") },
    { value: "expired" as FilterType, label: t("filters.expired") },
  ];

  // Count coupons by status
  const countByStatus = useMemo(() => {
    return {
      all: coupons.length,
      active: coupons.filter((c) => c.status === "active").length,
      "not-started": coupons.filter((c) => c.status === "not-started").length,
      paused: coupons.filter((c) => c.status === "paused").length,
      expired: coupons.filter((c) => c.status === "expired").length,
    };
  }, [coupons]);

  // Add counts to filter labels
  const filtersWithCounts = filters.map((filter) => ({
    ...filter,
    label: `${filter.label} (${countByStatus[filter.value]})`,
  }));

  // Filter coupons based on active filter and search
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesFilter =
        activeFilter === "all" || coupon.status === activeFilter;
      const matchesSearch =
        !searchQuery ||
        coupon.couponName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [coupons, activeFilter, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Top Section: Button and Search on Same Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-full sm:w-[300px]" />
        </div>

        {/* Filter Buttons */}
        <div className="w-full">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>

        {/* Coupon Cards Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[220px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="py-12 text-center text-red-500">
          {error instanceof Error
            ? error.message
            : "Failed to load promocodes"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section: Button and Search on Same Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          className="w-full sm:w-auto"
          onClick={() => requestPromocodeMutation.mutate()}
          disabled={requestPromocodeMutation.isPending}
        >
          {requestPromocodeMutation.isPending
            ? t("requesting") || "Requesting..."
            : t("requestAddCoupon")}
        </Button>
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="w-full">
        <FilterButtons
          filters={filtersWithCounts}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Coupon Cards */}
      <div className="space-y-4">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              couponName={coupon.couponName}
              discountPercentage={coupon.discountPercentage}
              discountValue={coupon.discountValue}
              startDate={coupon.startDate}
              endDate={coupon.endDate}
              usageCount={coupon.usageCount}
              status={coupon.status}
            />
          ))
        ) : (
          <EmptyState
            icon="🎫"
            size="lg"
            translationKey="dashboard.coupons.noCouponsFound"
          />
        )}
      </div>
    </div>
  );
}
