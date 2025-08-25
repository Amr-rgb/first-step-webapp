"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCenterPlans } from "@/hooks/useCenterPlans";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { useEffect, useState } from "react";
import { paymentService } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { DataTable } from "@/components/tables/DataTable";
import {
  Subscription,
  useSubscriptionsColumns,
} from "@/components/tables/data/subscriptions";
import { useQuery } from "@tanstack/react-query";
import { centerService } from "@/services/dashboardApi";

export default function CenterBillingPage() {
  const locale = useLocale();
  const { plans, loading, error } = useCenterPlans();

  const t = useTranslations("HomePage.Subscription.dashboard");
  const tBase = useTranslations("HomePage.Subscription");
  const tTable = useTranslations("dashboard.tables.subscriptions");

  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

  const { setSubscriptionRequired } = useSubscriptionStore.getState();

  // Ensure hooks order stays consistent across renders
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("payment") === "success") {
        alert(t("success.message"));
        setSubscriptionRequired(false);
      }
    }
  }, [t, setSubscriptionRequired]);

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("errorLoading")}</div>;

  // Find the active plan
  const activePlan = plans.find((plan) => plan.auth_user_status === "active");
  const otherPlans = plans.filter((plan) => plan.auth_user_status !== "active");

  const handlePayment = async (planId: number) => {
    setIsSubmitting(planId);
    try {
      const isAuthenticated = useAuthStore.getState().isAuthenticated();
      if (!isAuthenticated) {
        setIsSubmitting(null);
        alert("Please log in to subscribe to a plan.");
        return;
      }

      const data = await paymentService.centerSubscribe(planId);
      setIsSubmitting(null);

      if (data.success && data.payment_url) {
        window.location.href = data.payment_url as string;
      } else {
        alert(
          `Payment initiation failed: ${
            data?.message || "Invalid response from server"
          }`
        );
      }
    } catch (err: any) {
      setIsSubmitting(null);
      let errorMessage =
        "Payment initiation failed. Please check your connection and try again.";
      if (err?.status === 401)
        errorMessage = "Authentication required. Please log in again.";
      else if (err?.status === 403)
        errorMessage = "You don't have permission to perform this action.";
      else if (err?.status === 422)
        errorMessage =
          "Invalid request. Please check your input and try again.";
      else if (err?.status === 500)
        errorMessage = "Server error. Please try again later.";
      else if (err?.status === 0 || !err?.status)
        errorMessage = "Network error. Please check your internet connection.";
      else if (err?.message) errorMessage = err.message;
      alert(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-8">
      {/* Current Subscription */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="heading-4 text-primary">
              {t("currentSubscription")}
            </CardTitle>
            <div className="font-medium text-gray mt-1">
              {t("subscriptionDescription")}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-2">
            <div className="w-fit space-y-2">
              <div className="flex gap-2">
                <span className="font-bold text-primary">
                  {t("subscriptionStatus")}
                </span>
                <Badge variant="secondary" className="bg-success text-white">
                  {t("statusActive")}
                </Badge>
              </div>
              <div className="text-mid-gray flex gap-2">
                <span className="font-bold text-primary">{t("startDate")}</span>
                <span>
                  {activePlan
                    ? format(
                        new Date(activePlan.created_at),
                        "EEEE - yyyy/M/d",
                        {
                          locale: locale === "ar" ? arSA : enUS,
                        }
                      )
                    : "-"}
                </span>
              </div>
            </div>
            <div className="w-fit space-y-2">
              <div className="flex gap-2">
                <span className="font-bold text-primary">
                  {t("subscriptionType")}
                </span>
                <span>
                  {activePlan ? (
                    <span className="text-mid-gray">{activePlan.name}</span>
                  ) : (
                    <span>-</span>
                  )}
                </span>
              </div>
              <div className="text-mid-gray flex gap-2">
                <span className="font-bold text-primary">{t("endDate")}</span>
                <span>
                  {activePlan
                    ? format(
                        new Date(activePlan.published_at),
                        "EEEE - yyyy/M/d",
                        {
                          locale: locale === "ar" ? arSA : enUS,
                        }
                      )
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <Button
            size="long"
            className="mt-4 w-full mx-auto"
            onClick={() => activePlan && handlePayment(activePlan.id)}
            disabled={!activePlan || isSubmitting !== null}
          >
            {isSubmitting === activePlan?.id ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {tBase("plans.processing")}
              </div>
            ) : (
              t("renewButton")
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Other Plans */}
      <div className="space-y-4">
        <div className="text-gray font-medium mb-2">{t("otherPlans")}</div>
        {otherPlans.map((plan) => (
          <Card
            key={plan.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between p-4"
          >
            <div className="flex-1">
              <div className="heading-4 text-primary mb-1">{plan.name}</div>
              <div className="text-2xl lg:text-4xl font-bold text-mid-gray mb-2">
                {plan.price} <span className="sar">$</span>
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                size="long"
                className="w-full md:w-auto"
                onClick={() => handlePayment(plan.id)}
                disabled={isSubmitting === plan.id}
              >
                {isSubmitting === plan.id ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {tBase("plans.processing")}
                  </div>
                ) : (
                  t("subscribeButton")
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Subscriptions History Table */}
      <div className="space-y-4">
        <div className="text-gray font-medium mb-2">{tTable("title")}</div>
        <SubscriptionsTable />
      </div>
    </div>
  );
}

function SubscriptionsTable() {
  const columns = useSubscriptionsColumns();
  const { data = [], isLoading } = useQuery<Subscription[]>({
    queryKey: ["center", "subscriptions-log"],
    queryFn: async () => {
      const res: any = await centerService.getSubscriptionsLog();
      const mapDurationToType = (duration: number): string => {
        if (duration >= 12) return "annual";
        if (duration >= 6) return "semiAnnual";
        return "quarterly";
      };
      return res.data.map((item: any) => ({
        id: item.id,
        type: mapDurationToType(Number(item.duration)),
        startDate: item.start_of_subscription,
        endDate: item.end_of_subscription,
        paymentMethod: "Moyasser",
        amount: Number(item.total),
        status: item.status,
      }));
    },
  });

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
