"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import { Button } from "@/components/ui/button";
import AdRequestForm from "@/components/forms/dashboard/adblog-request/AdRequestForm";
import { AdRequestFormData } from "@/lib/schemas";

const AdminAds = () => {
  const queryClient = useQueryClient();

  const t = useTranslations("dashboard.admin.advertisement.adminAds");
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminAdvertisements"],
    queryFn: adminService.getAdvertisements,
  });

  const deleteMutation = useMutation({
    mutationFn: (adId: string) => adminService.deleteAdvertisement(adId),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["adminAdvertisements"] });
    },
    onError: () => {
      toast.error(t("deleteError"));
    },
  });

  // Add Advertisement button at the top
  const addButton = (
    <div className="mb-4 flex justify-end">
      <Button asChild size="sm">
        <Link href="/dashboard/admin/advertisement/add">
          {t("addNewAd")}
        </Link>
      </Button>
    </div>
  );

  if (isLoading) return <div>{t("loading")}</div>;
  if (error)
    return <div className="text-red-500">{t("errorLoading")}</div>;
  if (!data?.data?.length)
    return (
      <>
        {addButton}
        <div>{t("noAds")}</div>
      </>
    );

  const buttons = (
    formData: AdRequestFormData,
    isValid: boolean,
    adId: string
  ) => (
    <>
      <Button asChild size={"sm"}>
        <Link href={`advertisement/${adId}/edit`}>{t("editAd")}</Link>
      </Button>
      <Button
        onClick={(e) => {
          e.preventDefault();
          deleteMutation.mutate(adId);
        }}
        size={"sm"}
        variant={"outline"}
        className="!border-destructive text-destructive"
      >
        {t("deleteAd")}
      </Button>
    </>
  );

  return (
    <div className="flex flex-col gap-y-6">
      {addButton}
      {data.data.map((item: any) => (
        <AdRequestForm
          key={item.id}
          initialData={{
            title: { ar: item.title.ar, en: item.title.en },
            description: { ar: item.description.ar, en: item.description.en },
            image: item.image,
            start_date: new Date(item.publish_date),
            end_date: new Date(item.end_date),
          }}
          mode="show"
        >
          {(formData, isValid) => buttons(formData, isValid, item.id)}
        </AdRequestForm>
      ))}
    </div>
  );
};

export default AdminAds;
