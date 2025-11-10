import Image from "next/image";
import { useTranslations } from "next-intl";

const Headline = () => {
  const t = useTranslations("headline");

  return (
    <section className="flex items-center justify-center gap-x-2 md:gap-x-14 py-8">
      <Image
        className="ltr:order-3 rotate-180 rotate-y-180 rotate-z-180"
        src="/assets/logos/logo.svg"
        alt="First Step Logo"
        width={96.13}
        height={120}
      />

      <p className="ltr:order-2 font-medium text-lg md:text-2xl lg:text-3xl xl:text-4xl text-secondary-orange text-center">
        <span>{t("slogan")}</span>
        <span className="block">
          {t.rich("brandStatement", {
            brandName: (chunks) => (
              <span className="font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                {chunks}
              </span>
            ),
          })}
        </span>
      </p>

      <Image
        className="ltr:order-1"
        src="/assets/logos/logo.svg"
        alt="First Step Logo"
        width={96.13}
        height={120}
      />
    </section>
  );
};

export default Headline;
