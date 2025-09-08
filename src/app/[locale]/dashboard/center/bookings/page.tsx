"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { useTranslations } from "next-intl";
import { useHasRole } from "@/store/authStore";
import { useCenterStats } from "@/hooks/useCenterStats";
import Numbers from "@/components/dashboard/center-bookings/Numbers";
import MonthlyAreaComparison from "@/components/charts/MonthlyAreaComparison";
import Bookings from "@/components/dashboard/center-bookings/Bookings";

export default function CenterDashboardBookings() {
  const meta = usePageMetadata();

  const t = useTranslations("dashboard.charts");
  const tBookings = useTranslations("dashboard.charts.bookings");
  const isCenter = useHasRole("center");
  const { stats, isLoading } = useCenterStats(isCenter ? "center" : "branch");

  if (isLoading) {
    return <p>loading...</p>;
  }

  // Build bookingsRows from total_revenue_for_the_lates_5_months
  type RevenueItem = { month: string; total_paid: number | null };
  const revenueArr = (
    (stats.total_revenue_for_the_lates_5_months || []) as RevenueItem[]
  )
    .slice()
    .sort((a: RevenueItem, b: RevenueItem) => a.month.localeCompare(b.month));
  const lastThreeRevenue = revenueArr.slice(-3).reverse();

  const bookingsRows = lastThreeRevenue.map(
    (item: RevenueItem, idx: number, arr: RevenueItem[]) => {
      const value = item.total_paid ?? 0;
      const valueLabel = t("center.comparison.valueLabel");
      // Find previous month in the sorted array
      const prev = revenueArr.findIndex(
        (r: RevenueItem) => r.month === item.month
      );
      const previousValue = prev > 0 ? revenueArr[prev - 1].total_paid ?? 0 : 0;
      const isUp = value > previousValue;
      return {
        value,
        valueLabel,
        trend: isUp ? ("up" as const) : ("down" as const),
        data: getMonthData(value, isUp),
      };
    }
  );

  function getMonthData(value: number, isUp: boolean) {
    const baseValues = [8, 10, 12, 17, 13, 15];
    if (isUp) {
      return baseValues.map((v) => ({ v: v + Math.floor(Math.random() * 5) }));
    } else {
      return baseValues.map((v) => ({ v: v - Math.floor(Math.random() * 5) }));
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4">
        <Numbers />

        <MonthlyAreaComparison title={tBookings("title")} rows={bookingsRows} />
      </div>

      <div className="mt-6">
        <Bookings />
      </div>
    </div>
  );
}
