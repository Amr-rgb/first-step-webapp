"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import AdDetailsWrapper from "@/components/dashboard/advertisement/AdDetailsWrapper";
import { AdRequestFormData } from "@/lib/schemas";
import { adminService } from "@/services/dashboardApi";

export default function AdvertisementDetails({
  params,
}: {
  params: Promise<{ adId: string }>;
}) {
  const { adId } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["advertisement", adId],
    queryFn: () => adminService.getAdvertisement(adId),
    enabled: !!adId,
  });

  const t = useTranslations("dashboard.admin.advertisement.details");
  
  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("errorLoading")}</div>;
  if (!data) return null;

  // Map API response to AdRequestFormData
  const initialValues: AdRequestFormData = {
    title: data.title,
    description: data.description,
    image: data.image,
    start_date: data.publish_date,
    end_date: data.end_date,
  };

  return (
    <div>
      <AdDetailsWrapper adId={adId} initialValues={initialValues} mode="show" />
    </div>
  );
}
