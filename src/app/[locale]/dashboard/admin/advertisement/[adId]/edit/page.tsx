"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import AdDetailsWrapper from "@/components/dashboard/advertisement/AdDetailsWrapper";
import { AdRequestFormData } from "@/lib/schemas";
import { adminService } from "@/services/dashboardApi";

export default function AdvertisementEdit({
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

  const t = useTranslations("dashboard.admin.advertisement.edit");
  
  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("errorLoading")}</div>;
  if (!data) return null;

  // Map API response to AdRequestFormData
  const initialValues: AdRequestFormData = {
    title: data.title,
    description: data.description,
    image: data.image,
    start_date: new Date(data.publish_date),
    end_date: new Date(data.end_date),
  };

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="heading-4 font-bold text-primary max-w-[39.75rem] mx-auto">
          {t("pageTitle")}
        </h1>
      </div>

      <AdDetailsWrapper adId={adId} initialValues={initialValues} mode="add" />
    </div>
  );
}
