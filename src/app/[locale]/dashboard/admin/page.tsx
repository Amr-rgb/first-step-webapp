"use client";

import Numbers from "@/components/dashboard/center-bookings/Numbers";
import MonthlyAreaComparison from "@/components/charts/MonthlyAreaComparison";
import TopBookings from "@/components/dashboard/admin-bookings/TopBooking";
import MonthlyRevenueChart from "@/components/charts/MonthlyRevenueChart";
import { useTranslations } from "next-intl";

const CARDS = [
  {
    title: "cards.children",
    icon: (
      <svg
        width={48}
        height={49}
        viewBox="0 0 48 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M45 24.5a21.001 21.001 0 1 1-42.002 0A21.001 21.001 0 0 1 45 24.5"
          stroke="#83CBAA"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 31.5c1.983 1.47 4.398 2.333 7 2.333s5.017-.863 7-2.333m-6.417-28a5.25 5.25 0 1 0 3.5 9.163m-9.333 7.87c-.5-.443-1.104-.7-1.75-.7s-1.25.257-1.75.7m17.5 0c-.5-.443-1.104-.7-1.75-.7s-1.25.257-1.75.7"
          stroke="#83CBAA"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "cards.centers",
    icon: (
      <svg
        width={48}
        height={49}
        viewBox="0 0 48 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M44 44.5H4"
          stroke="#83CBAA"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          opacity={0.5}
          d="M42 44.5v-32c0-3.772 0-5.656-1.172-6.828S37.772 4.5 34 4.5h-4c-3.772 0-5.656 0-6.828 1.172-.944.942-1.128 2.348-1.164 4.828"
          stroke="#83CBAA"
          strokeWidth={2}
        />
        <path
          d="M30 44.5v-26c0-3.772 0-5.656-1.172-6.828S25.772 10.5 22 10.5h-8c-3.772 0-5.656 0-6.828 1.172S6 14.728 6 18.5v26"
          stroke="#83CBAA"
          strokeWidth={2}
        />
        <path
          d="M18 44.5v-6"
          stroke="#83CBAA"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          opacity={0.5}
          d="M12 16.5h12m-12 6h12m-12 6h12"
          stroke="#83CBAA"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "cards.parents",
    icon: (
      <svg
        width={48}
        height={49}
        viewBox="0 0 48 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M35.51 28.5a4.5 4.5 0 0 1 4.496 4.5v1.15c0 1.788-.64 3.518-1.8 4.876-3.14 3.666-7.914 5.476-14.206 5.476s-11.064-1.81-14.196-5.48a7.5 7.5 0 0 1-1.796-4.868v-1.156a4.5 4.5 0 0 1 4.498-4.498zm0 3H12.504a1.5 1.5 0 0 0-1.5 1.5v1.154c0 1.07.384 2.106 1.08 2.92 2.506 2.938 6.44 4.428 11.914 4.428 5.478 0 9.412-1.49 11.926-4.426a4.5 4.5 0 0 0 1.08-2.926v-1.152A1.5 1.5 0 0 0 35.51 31.5M24 4.51a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14"
          fill="#83CBAA"
        />
      </svg>
    ),
  },
  {
    title: "cards.firstStepAds",
    icon: (
      <svg
        width={50}
        height={49}
        viewBox="0 0 50 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.5 4.5a11.58 11.58 0 0 0-10.568 6.842q-.192.434-.392.863l-.143.278q-.105.172-.268.295a1.1 1.1 0 0 1-.378.122c-.076.015-.232.021-.883.021a7.369 7.369 0 0 0 0 14.737h1.415l2.105-2.105h-3.52a5.263 5.263 0 1 1 0-10.527h.114c.476 0 .87 0 1.183-.063.38-.076.754-.19 1.108-.42.353-.228.61-.523.838-.839.122-.168.231-.387.33-.596q.156-.334.406-.892l.005-.01a9.475 9.475 0 0 1 17.296 0l.005.012q.25.555.406.89c.099.209.208.426.33.596.226.316.485.61.838.84.354.23.729.343 1.108.421.313.063.707.063 1.183.061h.114a5.263 5.263 0 1 1 0 10.527h-3.52l2.105 2.105h1.415a7.369 7.369 0 0 0 0-14.737c-.65 0-.807-.006-.88-.021a1.1 1.1 0 0 1-.38-.124q-.162-.121-.269-.295l-.034-.057-.109-.22a49 49 0 0 1-.392-.862A11.58 11.58 0 0 0 24.5 4.5"
          fill="#83CBAA"
        />
        <path
          d="m24.5 24.5-.745-.745.745-.743.746.743zm1.053 18.947a1.053 1.053 0 0 1-2.105 0zM15.334 32.176l8.421-8.421 1.49 1.49-8.42 8.421zm9.912-8.421 8.42 8.42-1.49 1.491-8.421-8.42zm.307.745v18.947h-2.105V24.5z"
          fill="#83CBAA"
        />
      </svg>
    ),
  },
  {
    title: "cards.centerAds",
    icon: (
      <svg
        width={50}
        height={49}
        viewBox="0 0 50 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.5 4.5a11.58 11.58 0 0 0-10.568 6.842q-.192.434-.392.863l-.143.278q-.105.172-.268.295a1.1 1.1 0 0 1-.378.122c-.076.015-.232.021-.883.021a7.369 7.369 0 0 0 0 14.737h1.415l2.105-2.105h-3.52a5.263 5.263 0 1 1 0-10.527h.114c.476 0 .87 0 1.183-.063.38-.076.754-.19 1.108-.42.353-.228.61-.523.838-.839.122-.168.231-.387.33-.596q.156-.334.406-.892l.005-.01a9.475 9.475 0 0 1 17.296 0l.005.012q.25.555.406.89c.099.209.208.426.33.596.226.316.485.61.838.84.354.23.729.343 1.108.421.313.063.707.063 1.183.061h.114a5.263 5.263 0 1 1 0 10.527h-3.52l2.105 2.105h1.415a7.369 7.369 0 0 0 0-14.737c-.65 0-.807-.006-.88-.021a1.1 1.1 0 0 1-.38-.124q-.162-.121-.269-.295l-.034-.057-.109-.22a49 49 0 0 1-.392-.862A11.58 11.58 0 0 0 24.5 4.5"
          fill="#83CBAA"
        />
        <path
          d="m24.5 24.5-.745-.745.745-.743.746.743zm1.053 18.947a1.053 1.053 0 0 1-2.105 0zM15.334 32.176l8.421-8.421 1.49 1.49-8.42 8.421zm9.912-8.421 8.42 8.42-1.49 1.491-8.421-8.42zm.307.745v18.947h-2.105V24.5z"
          fill="#83CBAA"
        />
      </svg>
    ),
  },
];

import { useAdminStats } from "@/hooks/useAdminStats";

export default function AdminDashboardHome() {
  const { stats, isLoading } = useAdminStats();
  const t = useTranslations("dashboard.admin");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg font-medium">
          {t("loading")}
        </span>
      </div>
    );
  }

  const getMonthData = (value: number, isUp: boolean) => {
    const baseValues = [8, 10, 12, 17, 13, 15];
    if (isUp) {
      return baseValues.map((v) => ({ v: v + Math.floor(Math.random() * 5) }));
    } else {
      return baseValues.map((v) => ({ v: v - Math.floor(Math.random() * 5) }));
    }
  };

  const months = Object.keys(stats?.enrollments_over_time || {}).sort();
  const lastThreeMonths = months.slice(-3);

  const rows = lastThreeMonths.map((month, index) => {
    const currentValue = stats?.enrollments_over_time?.[month] || 0;
    const previousValue =
      stats?.enrollments_over_time?.[months[months.length - 4 + index]] || 0;
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
      <div className="flex flex-wrap gap-5 xl:gap-20 text-center">
        {CARDS.map((card, index) => {
          let value = 0;
          switch (index) {
            case 0:
              value = stats?.total_children || 0;
              break;
            case 1:
              value = stats?.total_centers || 0;
              break;
            case 2:
              value = stats?.total_parent || 0;
              break;
            case 3:
              value = stats?.ads_for_first_step || 0;
              break;
            case 4:
              value = stats?.ads_for_centers || 0;
              break;
          }
          return (
            <div
              key={card.title}
              className="w-full flex-1 flex flex-col items-center p-6 rounded-3xl shadow-[0_0_2px_rgba(0,0,0,.08)]"
            >
              {card.icon}
              <span className="mt-4 mb-2 text-secondary-mint-green font-bold text-4xl lg:text-5xl">
                {value}
              </span>
              <span className="text-xl lg:text-2xl text-primary font-bold">
                {t(card.title)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4">
        <Numbers />

        <MonthlyAreaComparison
          title={t("charts.bookingsComparison")}
          rows={rows}
        />
      </div>

      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4">
        <div className="w-full flex-1 min-w-3xs">
          <MonthlyRevenueChart />
        </div>
        <div className="w-full flex-1">
          <TopBookings />
        </div>
      </div>
    </div>
  );
}
