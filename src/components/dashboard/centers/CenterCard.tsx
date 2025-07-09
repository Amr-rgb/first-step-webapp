"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CenterCardType } from "@/hooks/useBranches";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";

const CenterCard = ({ center }: { center: CenterCardType }) => {
  const t = useTranslations("dashboard.admin.center");
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Accept center mutation
  const acceptMutation = useMutation({
    mutationFn: () => adminService.acceptCenter(center.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centers"] });
      toast.success(t("centerAccepted"));
    },
    onError: () => {
      toast.error(t("errorAcceptingCenter"));
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  // Reject center mutation
  const rejectMutation = useMutation({
    mutationFn: () => adminService.rejectCenter(center.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centers"] });
      toast.success(t("centerRejected"));
    },
    onError: () => {
      toast.error(t("errorRejectingCenter"));
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const handleAccept = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    acceptMutation.mutate();
  };

  const handleReject = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    rejectMutation.mutate();
  };

  const isPending = center.status === "pending";
  const isRejected = center.status === "canceled";

  return (
    <div className="relative bg-sidebar border-b border-light-gray p-6 flex flex-col lg:flex-row gap-8">
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              center.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : center.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {t(`status.${center.status}`)}
          </span>
          {(isPending || isRejected) && (
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-lg">
              {isPending && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3"
                >
                  {isProcessing && rejectMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : null}
                  {t("reject")}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAccept}
                disabled={isProcessing}
                className="text-green-600 hover:bg-green-50 h-8 px-3"
              >
                {isProcessing && acceptMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : null}
                {isRejected ? t("accept") : t("accept")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <div className="flex items-start gap-4">
          <Image
            className="size-20 object-center object-cover rounded-full bg-primary-blue/20"
            src={center.logo || "/assets/logos/instagram-logo.png"}
            width={81.66}
            height={80}
            alt="Nursery Logo"
          />
          <div className="flex flex-col gap-2 lg:gap-4">
            <p className="font-bold text-primary text-xl">{center.name}</p>
            <span className="font-medium text-mid-gray flex gap-1">
              <span>{t("table.address")}:</span>
              <span>{center.address || "-"}</span>
            </span>
            <span className="font-medium text-mid-gray flex gap-1">
              <span>{t("table.children")}:</span>
              <span>{center.childrenCount ?? "-"}</span>
            </span>
            <span className="font-medium text-mid-gray flex gap-1">
              <span>{t("table.bookings")}:</span>
              <span>{center.bookingsCount ?? "-"}</span>
            </span>
          </div>
        </div>
        <div className="flex gap-5 lg:gap-x-10">
          <Button asChild size={"sm"}>
            <Link href={`centers/${center.id}`}>{t("actions.view")}</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div>
          <p className="mb-1 font-medium text-primary text-xl">
            {t("table.acceptedAges")}
          </p>
          <div className="flex flex-col gap-y-1 font-medium text-mid-gray">
            {center.acceptedAges.length > 0 ? (
              Array.isArray(center.acceptedAges) &&
              center.acceptedAges.map((age) => <span key={age}>{age}</span>)
            ) : (
              <span>-</span>
            )}
          </div>
        </div>
        <div>
          <p className="mb-1 font-medium text-primary text-xl">
            {t("branches")}
          </p>
          <div className="flex flex-col gap-y-1 font-medium text-mid-gray">
            {center.branches.length > 0 ? (
              center.branches.map((branch) => (
                <span key={branch.id}>
                  {branch.name || branch.nursery_name_branch}
                </span>
              ))
            ) : (
              <span>-</span>
            )}
          </div>
        </div>
      </div>

      {/* <Button
        variant={"ghost"}
        size={"icon"}
        className="absolute p-5 top-4 right-4 rtl:right-auto rtl:left-4"
      >
        <Trash2 className="size-5 text-destructive" />
      </Button> */}
    </div>
  );
};

export default CenterCard;
