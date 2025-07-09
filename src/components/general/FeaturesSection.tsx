import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

const FeaturesSection = () => {
  const t = useTranslations("HomePage.Features");

  const features = [
    {
      title: t("childManagement.title"),
      description: t("childManagement.description"),
    },
    {
      title: t("directChat.title"),
      description: t("directChat.description"),
    },
    {
      title: t("taskOrganization.title"),
      description: t("taskOrganization.description"),
    },
    {
      title: t("professionalProfile.title"),
      description: t("professionalProfile.description"),
    },
    {
      title: t("dashboard.title"),
      description: t("dashboard.description"),
    },
    {
      title: t("bookingManagement.title"),
      description: t("bookingManagement.description"),
    },
    {
      title: t("adSpace.title"),
      description: t("adSpace.description"),
      comingSoon: true,
    },
  ];

  return (
    <section className="container px-4 mx-auto py-16">
      <div className="mx-auto">
        <h2 className="text-primary-blue text-center mb-12">{t("title")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-3xl py-6 px-6 lg:px-10 2xl:px-20 bg-gradient-to-b from-white to-secondary-mint-green/24">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-x-2">
              <div className="aspect-square size-9 bg-secondary-mint-green rounded-full flex items-center justify-center">
                <Check className="size-6 text-white" />
              </div>

              <div className="flex flex-col gap-y-2">
                <h3 className="heading-4 font-medium text-primary-blue">
                  <span>{feature.title}</span>{" "}
                  {feature.comingSoon && (
                    <span className="text-secondary-burgundy">
                      ({t("comingSoon")})
                    </span>
                  )}
                </h3>
                <p className="text-mid-gray flex-grow">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
