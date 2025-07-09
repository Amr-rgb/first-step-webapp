"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdRequestForm from "@/components/forms/dashboard/adblog-request/AdRequestForm";
import { AdRequestFormData } from "@/lib/schemas";
import { adminService } from "@/services/dashboardApi";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type AdType = "accepted" | "pending" | "rejected";

// just show and edit
const AdDetailsWrapper = ({
  adId,
  initialValues,
  mode,
  adType,
}: {
  adId: string;
  initialValues: AdRequestFormData;
  mode: "add" | "show";
  adType?: AdType;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.admin.advertisement.adDetails");

  const editMutation = useMutation({
    mutationFn: (data: Partial<AdRequestFormData>) => {
      // Transform the data structure to match the API's expected format
      const transformedData = {
        titleAr: data.title?.ar,
        titleEn: data.title?.en,
        descriptionAr: data.description?.ar,
        descriptionEn: data.description?.en,
        image: data.image[0],
        publish_date: data.start_date?.toISOString().split("T")[0],
        end_date: data.end_date?.toISOString().split("T")[0],
      };
      return adminService.updateAdvertisement(adId, transformedData);
    },
    onSuccess: () => {
      toast.success(t("updateSuccess"));
    },
    onError: (error) => {
      toast.error(t("updateError"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteAdvertisement(adId),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      router.push(`/dashboard/admin/advertisement`);
    },
    onError: () => {
      toast.error(t("deleteError"));
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => adminService.approveCenterAd(adId),
    onSuccess: () => {
      toast.success(t("acceptSuccess"));
      queryClient.invalidateQueries({ queryKey: ["centerAds"] });
    },
    onError: () => {
      toast.error(t("acceptError"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminService.rejectCenterAd(adId),
    onSuccess: () => {
      toast.success(t("rejectSuccess"));
      queryClient.invalidateQueries({ queryKey: ["centerAds"] });
    },
    onError: () => {
      toast.error(t("rejectError"));
    },
  });

  const editHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    data: AdRequestFormData,
    dirtyFields: string[]
  ) => {
    e.preventDefault();
    const payload: Partial<AdRequestFormData> = {};
    dirtyFields.forEach((field) => {
      // @ts-ignore
      payload[field] = data[field];
    });
    editMutation.mutate(payload);
  };

  const rejectHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    rejectMutation.mutate();
  };

  const acceptHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    acceptMutation.mutate();
  };

  const deleteHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteMutation.mutate();
  };

  const adTypeButtons = (
    adType: AdType,
    data: AdRequestFormData,
    isValid: boolean
  ) => {
    switch (adType) {
      case "accepted":
        return (
          <>
            {/* <Button asChild size={"sm"}>
              <Link href={`${adId}/edit`}>{t("editAd")}</Link>
            </Button> */}
            <Button
              onClick={deleteHandler}
              size={"sm"}
              variant={"outline"}
              className="!border-destructive text-destructive"
              disabled={deleteMutation.status === "pending"}
            >
              {deleteMutation.status === "pending"
                ? t("deleting")
                : t("deleteAd")}
            </Button>
          </>
        );
      case "pending":
        return (
          <>
            <Button
              onClick={acceptHandler}
              size={"sm"}
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending ? t("accepting") : t("acceptAd")}
            </Button>
            <Button
              onClick={rejectHandler}
              size={"sm"}
              variant={"outline"}
              className="!border-destructive text-destructive"
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? t("rejecting") : t("rejectAd")}
            </Button>
          </>
        );
      case "rejected":
        return (
          <>
            <Button onClick={acceptHandler} size={"sm"}>
              {t("acceptAd")}
            </Button>
            {/* <Button
              asChild
              size={"sm"}
              variant={"outline"}
              className="!border-light-gray text-mid-gray"
            >
              <Link href={`${adId}/edit`}>{t("editAd")}</Link>
            </Button> */}
          </>
        );
      default:
        return null;
    }
  };

  const buttons = (
    data: AdRequestFormData,
    isValid: boolean,
    dirtyFields: string[]
  ) => {
    if (mode === "add") {
      return (
        <>
          <Button
            onClick={(e) => editHandler(e, data, dirtyFields)}
            size={"sm"}
            disabled={
              dirtyFields.length === 0 || editMutation.status === "pending"
            }
          >
            {editMutation.status === "pending" ? t("updating") : t("editAd")}
          </Button>
          <Button
            onClick={deleteHandler}
            size={"sm"}
            variant={"outline"}
            className="!border-destructive text-destructive"
            disabled={deleteMutation.status === "pending"}
          >
            {deleteMutation.status === "pending"
              ? t("deleting")
              : t("deleteAd")}
          </Button>
        </>
      );
    } else if (mode === "show") {
      return adTypeButtons(adType || "accepted", data, isValid);
    }
  };

  return (
    <div>
      <AdRequestForm initialData={initialValues} mode={mode}>
        {(data, isValid, isSubmitting, dirtyFields) =>
          buttons(data, isValid, dirtyFields)
        }
      </AdRequestForm>
    </div>
  );
};

export default AdDetailsWrapper;
