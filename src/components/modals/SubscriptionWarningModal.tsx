"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Info } from "lucide-react";

interface SubscriptionWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: any;
  planName?: string;
}

export function SubscriptionWarningModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  planName,
}: SubscriptionWarningModalProps) {
  const t = useTranslations("HomePage.Subscription.warning");
  const locale = useLocale();

  // Check if current plan is still active
  const isPlanActive = () => {
    if (user?.subscription_status === "free") {
      // For free trial, check if it hasn't expired
      const freeTrialEndDate = new Date(user?.free_trail_end_date || 0);
      return freeTrialEndDate > new Date();
    } else {
      // For paid subscriptions, check if it hasn't expired
      const subscriptionEndDate = new Date(user?.subscription_end_date || 0);
      return subscriptionEndDate > new Date();
    }
  };

  const getEndDate = () => {
    if (user?.subscription_status === "free") {
      return user?.free_trail_end_date;
    }
    return user?.subscription_end_date;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "EEEE - yyyy/M/d", {
      locale: locale === "ar" ? arSA : enUS,
    });
  };

  const isActive = isPlanActive();

  if (!isActive) {
    // If plan is not active, don't show warning - proceed with payment
    onConfirm();
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {t("title") || "Active Subscription Detected"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {t("description") ||
              "You currently have an active subscription. Subscribing to a new plan will replace your current subscription."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Info className="h-4 w-4 text-gray-500" />
            <div className="text-sm text-gray-700">
              <span className="font-medium">
                {t("currentPlan") || "Current Plan:"}
              </span>{" "}
              {planName ||
                (user?.subscription_status === "free"
                  ? t("freeTrial") || "Free Trial"
                  : t("activeSubscription") || "Active Subscription")}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="text-sm text-gray-700">
              <span className="font-medium">
                {t("expiresOn") || "Expires on:"}
              </span>{" "}
              {formatDate(getEndDate())}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              {t("note") ||
                "Note: Your new subscription will start immediately and replace the current one. Any remaining time on your current plan will be forfeited."}
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-warning hover:bg-warning/90 text-white"
          >
            {t("continue") || "Continue with New Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
