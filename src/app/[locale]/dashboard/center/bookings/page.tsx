import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import Numbers from "@/components/dashboard/center-bookings/Numbers";
import MonthlyAreaComparison from "@/components/charts/MonthlyAreaComparison";
import Bookings from "@/components/dashboard/center-bookings/Bookings";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "dashboard/center/bookings");
}

export default async function CenterDashboardBookings() {
  const t = await getTranslations("dashboard.charts.bookings");

  const rows = [
    {
      value: 3620,
      valueLabel: t("valueLabel"),
      trend: "up" as const,
      data: [{ v: 8 }, { v: 10 }, { v: 12 }, { v: 17 }, { v: 13 }, { v: 15 }],
    },
    {
      value: 3620,
      valueLabel: t("valueLabel"),
      trend: "down" as const,
      data: [{ v: 18 }, { v: 12 }, { v: 15 }, { v: 10 }, { v: 7 }, { v: 9 }],
    },
    {
      value: 3620,
      valueLabel: t("valueLabel"),
      trend: "up" as const,
      data: [{ v: 7 }, { v: 10 }, { v: 13 }, { v: 12 }, { v: 15 }, { v: 17 }],
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4">
        <Numbers />

        <MonthlyAreaComparison title={t("title")} rows={rows} />
      </div>

      <div className="mt-6">
        <Bookings />
      </div>
    </div>
  );
}
