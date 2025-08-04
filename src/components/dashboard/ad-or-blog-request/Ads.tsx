"use client";

import { Ad, useAdsColumns } from "@/components/tables/data/ads";
import { DataTable } from "@/components/tables/DataTable";
import { useTranslations } from "next-intl";
import { centerService } from "@/services/dashboardApi";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Ads = () => {
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
        branch: ad.branch_id, // Since branch name is not provided in the response
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
      toast(tableT("error.title"), {
        description: tableT("error.description"),
      });
      console.error("Error fetching ads:", error);
    }
  }, [error, tableT]);

  return (
    <div className="mt-6">
      <DataTable columns={columns} data={ads} isLoading={isLoading} />
    </div>
  );
};

export default Ads;
