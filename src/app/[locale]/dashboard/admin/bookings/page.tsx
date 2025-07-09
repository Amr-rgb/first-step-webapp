"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import Numbers from "@/components/dashboard/center-bookings/Numbers";
import MonthlyAreaComparison from "@/components/charts/MonthlyAreaComparison";
import TopBookings from "@/components/dashboard/admin-bookings/TopBooking";
import Bookings from "@/components/dashboard/admin-bookings/Bookings";
import { useTranslations } from "next-intl";

export default function BookingsPage() {
  const t = useTranslations("dashboard.admin");
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: adminService.getAdminStatistics,
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  const getMonthData = (value: number, isUp: boolean) => {
    const baseValues = [8, 10, 12, 17, 13, 15];
    if (isUp) {
      return baseValues.map((v) => ({ v: v + Math.floor(Math.random() * 5) }));
    } else {
      return baseValues.map((v) => ({ v: v - Math.floor(Math.random() * 5) }));
    }
  };

  const months = Object.keys(stats.enrollments_over_time || {}).sort();
  const lastThreeMonths = months.slice(-3);

  const rows = lastThreeMonths.map((month, index) => {
    const currentValue = stats.enrollments_over_time?.[month] || 0;
    const previousValue =
      stats.enrollments_over_time?.[months[months.length - 4 + index]] || 0;
    const isUp = currentValue > previousValue;

    return {
      value: currentValue,
      valueLabel: t("charts.enrollments"),
      trend: isUp ? ("up" as const) : ("down" as const),
      data: getMonthData(currentValue, isUp),
    };
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4">
        <Numbers />

        <MonthlyAreaComparison
          title={t("charts.bookingsComparison")}
          rows={rows}
        />
      </div>

      <div className="mt-6">
        <TopBookings />
      </div>

      <div className="mt-6">
        <Bookings />
      </div>
    </div>
  );
}
