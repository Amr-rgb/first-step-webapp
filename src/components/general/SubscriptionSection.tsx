import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const SubscriptionSection = () => {
  const t = useTranslations("HomePage.Subscription");

  const plans = [
    {
      id: "annual",
      name: t("plans.annual.title"),
      price: "3,999",
      period: t("plans.annual.period"),
      features: [
        t("plans.features.allFeatures"),
        t("plans.features.support"),
        t("plans.features.updates"),
        t("plans.features.discount", { discount: "30%" }),
      ],
      buttonText: t("plans.select"),
    },
    {
      id: "semi-annual",
      name: t("plans.semiAnnual.title"),
      price: "2,599",
      period: t("plans.semiAnnual.period"),
      features: [
        t("plans.features.allFeatures"),
        t("plans.features.support"),
        t("plans.features.updates"),
        t("plans.features.discount", { discount: "15%" }),
      ],
      popular: true,
      buttonText: t("plans.select"),
    },
    {
      id: "quarterly",
      name: t("plans.quarterly.title"),
      price: "1,499",
      period: t("plans.quarterly.period"),
      features: [
        t("plans.features.allFeatures"),
        t("plans.features.support"),
        t("plans.features.updates"),
      ],
      buttonText: t("plans.select"),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 heading-3 text-primary-blue text-center">
          {t("title")}
        </h2>

        {/* Promo Banner */}
        <div className="relative bg-primary-blue rounded-2xl p-8 md:p-12 mb-16 overflow-hidden flex flex-col gap-5 md:flex-row items-center justify-between">
          <div className="relative z-10 max-w-3xl flex flex-col items-center text-center md:items-start md:text-left md:rtl:text-right">
            <h3 className="font-bold text-white mb-4">{t("banner.title")}</h3>
            <p className="text-xl text-blue-100 mb-6">{t("banner.subtitle")}</p>
            <p className="text-warning font-medium mb-6 flex items-center">
              <span className="animate-pulse">•</span>
              <span className="mr-2">{t("banner.limitedOffer")}</span>
            </p>
            <Button
              size="sm"
              className="bg-white hover:bg-white/90 text-primary rounded-xl w-full"
            >
              {t("banner.cta")}
            </Button>
          </div>

          {/* Decorative elements */}
          <Image
            src="/assets/illustrations/gifts.png"
            width={280}
            height={280}
            alt="gift"
          />
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative xl:px-10 py-10 lg:py-20 ${
                plan.popular
                  ? "mt-20 bg-primary-blue text-white rounded-5xl"
                  : "bg-white text-primary-blue rounded-xl shadow-[0_2px_80px_0_rgba(34,34,34,0.08)]"
              }`}
            >
              {plan.popular && (
                <>
                  <div className="z-20 absolute inset-0 bg-primary-blue rounded-5xl" />

                  <div className="z-10 w-full absolute bottom-[calc(100%-1.5rem)] right-0 bg-gradient-to-b from-white to-secondary-mint-green/24 text-primary heading-4 text-center font-bold px-4 pt-6 pb-12 rounded-t-5xl">
                    {t("plans.popular")}
                  </div>
                </>
              )}

              <div className="z-30 relative p-6 flex flex-col items-center gap-10">
                <p className="text-5xl lg:text-[4rem] 2xl:text-[5rem] font-extrabold">
                  <span>{plan.price}</span> <span className="sar">$</span>
                </p>

                <h3>{plan.name}</h3>

                <p className="font-medium">
                  + 12 % عمولة على كل حجز من خلال الموقع
                </p>

                <Button
                  size="sm"
                  className={cn(
                    "w-full rounded-xl",
                    plan.popular
                      ? "bg-white text-primary-blue hover:bg-white/90"
                      : ""
                  )}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
