"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import ReportShow from "@/components/forms/dashboard/center-reports/ReportShow";
import { Skeleton } from "@/components/ui/skeleton";
import { centerService } from "@/services/dashboardApi";

const ReportShowSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4 lg:gap-6 xl:gap-9">
      {/* Activities */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Behavior */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Meals */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Nap Time */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2 md:col-span-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default function DailyReportDetails({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const meta = usePageMetadata();

  const { reportId } = use(params);
  const t = useTranslations("dashboard.center-reports.report");

  const {
    data: report,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["daily-report", reportId],
    queryFn: () => centerService.getDailyReport(reportId),
  });

  if (isLoading) {
    return (
      <div className="lg:p-4 space-y-6">
        <p className="heading-4 text-primary text-center">{t("title")}</p>
        <ReportShowSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:p-4 space-y-6">
        <p className="heading-4 text-primary text-center">{t("title")}</p>
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-red-500 text-lg">{t("error")}</p>
          <button
            onClick={() => refetch()}
            className="cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:p-4 space-y-6">
      <p className="heading-4 text-primary text-center">{t("title")}</p>

      <ReportShow
        initialValues={{
          activities: report?.data?.activities || "",
          behavior: report?.data?.behavior || "",
          meals: report?.data?.meals || "",
          napTime: report?.data?.nap_time || "",
          additionalNotes: report?.data?.notes || "",
          recipients: [],
        }}
      />
    </div>
  );
}
