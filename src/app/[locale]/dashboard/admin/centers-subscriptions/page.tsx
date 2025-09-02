"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/services/dashboardApi";

interface Subscription {
  id: number;
  name: string;
  nursery_name: string;
  logo: string;
  total: string;
  plan: string;
  duration: number;
  start_of_subscription: string;
  end_of_subscription: string;
  status: "active" | "expired" | string;
  address: string;
  neighborhood: string;
  city: {
    name: {
      en: string;
      ar: string;
    };
  };
}

export default function CentersSubscriptionsLog() {
  const meta = usePageMetadata();

  const t = useTranslations("dashboard.admin.subscriptions");

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<{ data: Subscription[] }>({
    queryKey: ["centers-subscriptions-log"],
    queryFn: () => adminService.getCentersSubscriptionsLog(),
  });

  const subscriptions = response?.data || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-destructive">
        {t("error")}
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        {t("noRecords")}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-6">
      {subscriptions.map((subscription) => (
        <CenterSubscriptionCard
          key={subscription.id}
          subscription={subscription}
        />
      ))}
    </div>
  );
}

interface CenterSubscriptionCardProps {
  subscription: Subscription;
}

function CenterSubscriptionCard({ subscription }: CenterSubscriptionCardProps) {
  const locale = useLocale();
  const t = useTranslations("dashboard.admin.subscriptions");
  const isActive = subscription.status === "active";

  // Format the address
  const formattedAddress = [
    subscription.address,
    subscription.neighborhood,
    subscription.city?.name[locale as "ar" | "en"],
  ]
    .filter(Boolean)
    .join("، ");

  const mapDurationToType = (duration: number): string => {
    if (duration >= 12) return "annual";
    if (duration >= 6) return "semiAnnual";
    return "quarterly";
  };

  const planKey = mapDurationToType(subscription.duration);

  return (
    <Card className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4">
      <CardHeader className="flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-row items-center gap-4">
          <Image
            className="size-20 object-center object-cover rounded-full bg-primary-blue/20"
            src={subscription.logo || "/assets/logos/logo.svg"}
            width={80}
            height={80}
            alt="Nursery Logo"
          />

          <div>
            <CardTitle className="text-primary text-lg">
              {subscription.name || subscription.nursery_name}
            </CardTitle>
            <p className="text-gray text-sm">
              {t("address")} {formattedAddress}
            </p>
          </div>
        </div>

        {/* {isActive ? (
          <Button
            size="long"
            variant="outline"
            className="mt-4 !border-destructive !text-destructive w-full md:w-auto"
          >
            {t("cancelSubscription")}
          </Button>
        ) : (
          <Button size="long" className="mt-4 w-full md:w-auto">
            {t("sendPaymentReminder")}
          </Button>
        )} */}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="font-bold text-primary">
              {t("subscriptionType")}
            </span>
            <span>{t(`planTypes.${planKey}`)}</span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <span className="font-bold text-primary">
            {t("subscriptionStatus")}
          </span>
          <Badge
            className={
              isActive ? "bg-success text-white" : "bg-destructive text-white"
            }
          >
            {t(`status.${isActive ? "active" : "expired"}`)}
          </Badge>
        </div>

        <div className="flex gap-2 text-mid-gray">
          <span className="font-bold text-primary">{t("startDate")}</span>
          <span>
            {format(
              new Date(subscription.start_of_subscription),
              "EEEE - yyyy/M/d",
              {
                locale: locale === "ar" ? arSA : enUS,
              }
            )}
          </span>
        </div>
        <div className="flex gap-2 text-mid-gray">
          <span className="font-bold text-primary">{t("endDate")}</span>
          <span>
            {format(
              new Date(subscription.end_of_subscription),
              "EEEE - yyyy/M/d",
              {
                locale: locale === "ar" ? arSA : enUS,
              }
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
