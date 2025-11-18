"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FilterButtons } from "@/components/common/FilterButtons";
import CouponCard from "./CouponCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type FilterType = "all" | "active" | "not-started" | "paused" | "expired";

interface Coupon {
  id: string;
  couponName: string;
  discountPercentage: number;
  discountValue: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  status: FilterType;
}

// Mock data - replace with actual API call
const mockCoupons: Coupon[] = [
  {
    id: "1",
    couponName: "ME15",
    discountPercentage: 15,
    discountValue: 120,
    startDate: "السبت 20 / 5 / 2025",
    endDate: "الخميس 26 / 5 / 2025",
    usageCount: 10,
    status: "active",
  },
  {
    id: "2",
    couponName: "ME15",
    discountPercentage: 15,
    discountValue: 120,
    startDate: "السبت 20 / 5 / 2025",
    endDate: "الخميس 26 / 5 / 2025",
    usageCount: 10,
    status: "not-started",
  },
  {
    id: "3",
    couponName: "ME15",
    discountPercentage: 15,
    discountValue: 120,
    startDate: "السبت 20 / 5 / 2025",
    endDate: "الخميس 26 / 5 / 2025",
    usageCount: 10,
    status: "paused",
  },
  {
    id: "4",
    couponName: "ME15",
    discountPercentage: 15,
    discountValue: 120,
    startDate: "السبت 20 / 5 / 2025",
    endDate: "الخميس 26 / 5 / 2025",
    usageCount: 10,
    status: "expired",
  },
];

export default function Coupons() {
  const t = useTranslations("dashboard.coupons");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { value: "all" as FilterType, label: t("filters.all") },
    { value: "active" as FilterType, label: t("filters.active") },
    { value: "not-started" as FilterType, label: t("filters.notStarted") },
    { value: "paused" as FilterType, label: t("filters.paused") },
    { value: "expired" as FilterType, label: t("filters.expired") },
  ];

  // Count coupons by status
  const countByStatus = {
    all: mockCoupons.length,
    active: mockCoupons.filter((c) => c.status === "active").length,
    "not-started": mockCoupons.filter((c) => c.status === "not-started").length,
    paused: mockCoupons.filter((c) => c.status === "paused").length,
    expired: mockCoupons.filter((c) => c.status === "expired").length,
  };

  // Add counts to filter labels
  const filtersWithCounts = filters.map((filter) => ({
    ...filter,
    label: `${filter.label} (${countByStatus[filter.value]})`,
  }));

  // Filter coupons based on active filter and search
  const filteredCoupons = mockCoupons.filter((coupon) => {
    const matchesFilter =
      activeFilter === "all" || coupon.status === activeFilter;
    const matchesSearch =
      !searchQuery ||
      coupon.couponName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Section: Button and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button className="w-full sm:w-auto">
          {t("requestAddCoupon")}
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
          <div className="py-12 text-center text-gray-500">
            {t("noCouponsFound")}
          </div>
        )}
      </div>
    </div>
  );
}

