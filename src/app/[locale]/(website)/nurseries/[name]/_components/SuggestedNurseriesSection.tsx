"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { nurseryService } from "@/services/api";
import NurseryCard from "@/components/general/nurseries/NurseryCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { NurseryResponse } from "@/types";

interface SuggestedNurseriesSectionProps {
  currentCenterId: string;
}

const SuggestedNurseriesSection = ({
  currentCenterId,
}: SuggestedNurseriesSectionProps) => {
  const t = useTranslations("nurseryDetails.suggestedNurseries");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";

  const { data: nurseries, isLoading } = useQuery({
    queryKey: ["suggested-nurseries", locale],
    queryFn: () => nurseryService.getNurseries(locale),
    select: (data: any[]) =>
      data.filter((n: any) => String(n.id) !== currentCenterId).slice(0, 10),
  });

  if (!isLoading && (!nurseries || nurseries.length === 0)) return null;

  return (
    <section id="suggested-nurseries" className="py-0 scroll-mt-20">
      <Carousel
        opts={{
          align: "start",
          direction: isRtl ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="heading-4 font-bold text-primary">{t("title")}</h2>
          </div>

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
        </div>

        <div className="bg-white-out p-4 rounded-2xl">
          <CarouselContent className="-ml-4">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <CarouselItem
                    key={i}
                    className="pl-4 basis-full sm:basis-2/3 md:basis-1/2 lg:basis-1/2 transition-all duration-300"
                  >
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                  </CarouselItem>
                ))
              : (nurseries || []).map((nursery: NurseryResponse) => (
                  <CarouselItem
                    key={nursery.id}
                    className="pl-4 basis-full sm:basis-2/3 md:basis-1/2 lg:basis-1/2 transition-all duration-300"
                  >
                    <NurseryCard nursery={nursery} locale={locale} />
                  </CarouselItem>
                ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
};

export default SuggestedNurseriesSection;
