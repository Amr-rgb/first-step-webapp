"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

const AppAd = () => {
  const t = useTranslations("HomePage.AppAd");

  return (
    <section className="blue-gradient text-white overflow-hidden py-12">
      <div className="relative container mx-auto px-4 flex flex-col-reverse lg:flex-row justify-center items-center gap-12 lg:gap-0">
        <div className="z-20 grow flex flex-col justify-center items-center lg:items-start gap-y-4 text-center rtl:lg:text-right ltr:lg:text-left">
          <h2 className="heading-3">{t("title")}</h2>
          <p className="heading-4 font-medium">{t("description")}</p>

          <div className="text-center rtl:lg:text-right ltr:lg:text-left w-full md:w-auto">
            <p className="font-medium mb-3">{t("download")}</p>

            <div className="flex gap-3 justify-center md:justify-end">
              <Link href="#" className="inline-block">
                <Image
                  src="/assets/store/googleplay.png"
                  alt="Get it on Google Play"
                  width={207}
                  height={60}
                />
              </Link>
              <Link href="#" className="inline-block">
                <Image
                  src="/assets/store/appstore.png"
                  alt="Download on the App Store"
                  width={207}
                  height={60}
                />
              </Link>
            </div>
          </div>
        </div>

        <Image
          className="z-20 rtl:2xl:ml-16 ltr:2xl:mr-16"
          src="/assets/screens/app-mockup.png"
          width={560}
          height={420}
          alt="App Mockup"
        />

        <Image
          className="select-none pointer-events-none absolute -top-20 lg:top-auto rtl:lg:-left-16 ltr:lg:-right-24 ltr:rotate-x-180 z-10"
          src="/assets/backgrounds/app-ad-pattern.svg"
          width={967.47}
          height={752.06}
          alt=""
        />
      </div>
    </section>
  );
};

export default AppAd;
