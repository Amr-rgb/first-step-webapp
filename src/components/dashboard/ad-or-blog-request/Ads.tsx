"use client";

import { Ad, useAdsColumns } from "@/components/tables/data/ads";
import { DataTable } from "@/components/tables/DataTable";
import { useLocale, useTranslations } from "next-intl";
import { centerService } from "@/services/dashboardApi";
import { toastError } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import EmptyState from "@/components/common/EmptyState";

const Ads = () => {
  const locale = useLocale();
  const t = useTranslations("dashboard");
  const tableT = useTranslations("dashboard.tables.ads");
  const columns = useAdsColumns();

  const {
    data: ads = [],
    isLoading,
    error,
  } = useQuery<Ad[]>({
    queryKey: ["ads"],
    queryFn: async () => {
      const response = await centerService.getAds();
      return response.map((ad: any) => ({
        id: ad.id,
        type: "paid",
        startDate: ad.publish_date,
        endDate: ad.end_date,
        title: ad.title[locale],
        amount: ad.status === "approved" ? 0 : 0, // Amount only if approved
        reservationStatus:
          ad.status === "approved"
            ? "confirmed"
            : ad.status === "pending"
            ? "waitingForPayment"
            : "rejected",
      }));
    },
  });

  // Handle errors using useEffect
  useEffect(() => {
    if (error) {
      toastError(tableT("error.title"), tableT("error.description"));
      console.error("Error fetching ads:", error);
    }
  }, [error, tableT]);

  // Show empty state if no ads
  if (!isLoading && ads.length === 0) {
    return (
      <EmptyState
        icon="📢"
        size="lg"
        primaryAction={{
          label: "Request Ad",
          onClick: () => {
            window.location.href =
              "/dashboard/center/ad-or-blog-request/ad-request";
          },
        }}
        translationKey="dashboard.emptyStates.ads"
      />
    );
  }

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={ads} isLoading={isLoading} />
    </div>
  );
};

export default Ads;
