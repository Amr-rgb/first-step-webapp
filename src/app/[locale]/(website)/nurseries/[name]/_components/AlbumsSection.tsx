"use client";

import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface AlbumsSectionProps {
  images: string[];
}

const AlbumsSection = ({ images }: AlbumsSectionProps) => {
  const t = useTranslations("nurseryDetails.albums");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Fallback images if none provided
  const displayImages =
    images.length > 0
      ? images
      : [
          "/assets/illustrations/center.png",
          "/assets/illustrations/center.png",
          "/assets/illustrations/center.png",
        ];

  return (
    <section id="albums" className="py-0 scroll-mt-20">
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
            <h2 className="heading-4 font-bold text-primary">
              {t("title")}{" "}
              <span className="text-gray-400 font-medium">
                {t("count", { count: displayImages.length })}
              </span>
            </h2>
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

        <div className="bg-white-out p-4 rounded-2xl flex flex-col gap-6">
          <CarouselContent className="-ml-4">
            {displayImages.map((src, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-4/5 sm:basis-2/3 md:basis-1/2 lg:basis-1/2"
              >
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    src={src}
                    alt={`Album image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <Button size="long" variant="default" className="w-full! max-w-none">
            {t("viewAll")}
          </Button>
        </div>
      </Carousel>
    </section>
  );
};

export default AlbumsSection;
