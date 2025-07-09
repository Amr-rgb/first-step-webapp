"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import AdDetailsWrapper from "@/components/dashboard/advertisement/AdDetailsWrapper";
import { AdRequestFormData } from "@/lib/schemas";

export default function CenterAdvertisementsPage({
  params,
}: {
  params: Promise<{ centerId: string }>;
}) {
  const { centerId } = use(params);
  const { data, isLoading, error } = useQuery({
    queryKey: ["centerAds", centerId],
    queryFn: () => adminService.getOneCenterAds(centerId),
  });

  const t = useTranslations("dashboard.admin.advertisement.center");
  
  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("errorLoading")}</div>;

  // Defensive: handle empty or missing ads
  const ads = data?.ads || [];

  // Helper to map backend ad to AdRequestFormData
  const mapAdToFormData = (ad: any): AdRequestFormData => ({
    title: {
      ar: ad.title.ar || "",
      en: ad.title.en || "",
    },
    description: {
      ar: ad.description.ar || "",
      en: ad.description.en || "",
    },
    image: ad.image,
    start_date: ad.publish_date ? new Date(ad.publish_date) : new Date(),
    end_date: ad.end_date ? new Date(ad.end_date) : new Date(),
  });

  return (
    <div className="space-y-4">
      <h1 className="heading-4 text-primary font-medium text-center">
        {t("pageTitle")}
      </h1>
      <div className="flex flex-col gap-y-12">
        <div className="space-y-4">
          <p className="heading-4 text-primary font-medium">
            {t("pendingAds")}
          </p>
          <div className="flex flex-col gap-y-6 lg:px-5 xl:px-9">
            {ads
              .filter((ad: any) => ad.status === "pending")
              .map((ad: any) => (
                <AdDetailsWrapper
                  key={ad.id}
                  adId={ad.id.toString()}
                  initialValues={mapAdToFormData(ad)}
                  mode="show"
                  adType="pending"
                />
              ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="heading-4 text-primary font-medium">{t("acceptedAds")}</p>
          <div className="flex flex-col gap-y-6 lg:px-5 xl:px-9">
            {ads
              .filter((ad: any) => ad.status === "approved")
              .map((ad: any) => (
                <AdDetailsWrapper
                  key={ad.id}
                  adId={ad.id.toString()}
                  initialValues={mapAdToFormData(ad)}
                  mode="show"
                  adType="accepted"
                />
              ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="heading-4 text-primary font-medium">{t("rejectedAds")}</p>
          <div className="flex flex-col gap-y-6 lg:px-5 xl:px-9">
            {ads
              .filter((ad: any) => ad.status === "rejected")
              .map((ad: any) => (
                <AdDetailsWrapper
                  key={ad.id}
                  adId={ad.id.toString()}
                  initialValues={mapAdToFormData(ad)}
                  mode="show"
                  adType="rejected"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
