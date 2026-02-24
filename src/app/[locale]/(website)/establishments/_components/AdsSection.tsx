"use client";

import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getCenterAdsAction } from "@/actions/nurseryActions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "./SectionHeader";

interface AdsSectionProps {
  centerId: string;
  tNamespace?: string;
}

const AdsSection = ({ centerId, tNamespace = "nurseryDetails" }: AdsSectionProps) => {
  const t = useTranslations(`${tNamespace}.ads` as any);
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { data: ads, isLoading } = useQuery({
    queryKey: ["center-ads", centerId],
    queryFn: () => getCenterAdsAction(centerId),
    select: (data: any[]) => data.filter((ad: any) => ad.status === "approved"),
  });

  return (
    <section id="ads" className="py-0 scroll-mt-20">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader title={t("title")} />

        {ads && ads.length > 1 && (
          <div className="flex items-center gap-2">
            <CarouselPrevious
              useChevron
              className="static translate-y-0 translate-x-0 w-6 h-6 border-2 border-secondary-mint-green! text-secondary-mint-green shadow-none disabled:border-light-gray! disabled:text-light-gray"
            />
            <CarouselNext
              useChevron
              className="static translate-y-0 translate-x-0 w-6 h-6 border-2 border-secondary-mint-green! text-secondary-mint-green shadow-none disabled:border-light-gray! disabled:text-light-gray"
            />
          </div>
        )}
      </div>

      <div className="rounded-3xl overflow-hidden">
        {isLoading ? (
          <Skeleton className="w-full aspect-1440/680 rounded-2xl" />
        ) : ads && ads.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              direction: isRtl ? "rtl" : "ltr",
            }}
            className="w-full"
          >
            <CarouselContent>
              {ads.map((ad: any) => (
                <CarouselItem key={ad.id} className="basis-full">
                  <div className="relative aspect-1440/680 w-full rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm">
                    <Image
                      src={ad.image}
                      alt={ad.title?.[locale] || ad.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="relative aspect-1440/680 w-full rounded-2xl overflow-hidden bg-linear-to-b from-white via-secondary-mint-green/12 to-secondary-mint-green/24 border border-secondary-mint-green/10 flex flex-col items-center justify-center p-8 text-center group">
            <div className="absolute ltr:left-0 rtl:right-0 bottom-0 w-48 h-48 sm:w-64 sm:h-64 ltr:-translate-x-4 rtl:translate-x-4 translate-y-4 pointer-events-none select-none">
              <Image
                src="/assets/illustrations/offer-alert.png"
                alt="ads alert"
                fill
                className="object-contain"
              />
            </div>

            <p className="text-xl sm:text-2xl font-bold text-primary/60 max-w-md leading-relaxed z-10 relative">
              {t("placeholder")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdsSection;
