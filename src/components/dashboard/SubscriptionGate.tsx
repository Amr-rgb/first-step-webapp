"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const SubscriptionGate = () => {
  const meta = usePageMetadata();

  const t = useTranslations("HomePage.Subscription.dashboard");

  return (
    <div className="pb-8 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
      <Image
        src="/assets/illustrations/billing.png"
        width={400}
        height={400}
        alt="subscribe now"
      />

      <p className="heading-4 font-normal text-destructive mb-6">
        {t("subscriptionRequiredMessage", {
          default:
            "لا يتوفر لديك فترة تجريبية. يرجى اختيار خطة اشتراك للمتابعة.",
        })}
      </p>
      <Link href="/dashboard/center/billing">
        <Button size="long" className="w-full">
          {t("goToBilling", { default: "الذهاب لخطط الاشتراك" })}
        </Button>
      </Link>
    </div>
  );
};

export default SubscriptionGate;
