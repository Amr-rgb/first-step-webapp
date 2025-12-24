"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface PublicExternalOfferCardProps {
  offer: any;
}

export default function PublicExternalOfferCard({
  offer,
}: PublicExternalOfferCardProps) {
  const t = useTranslations("externalOffers");
  const photos = Array.isArray(offer.photos) ? offer.photos : [];

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col md:flex-row h-full">
        {/* "For Limited Time" Badge - Cross Ribbon Style */}
        <div
          className={cn(
            "absolute top-0 z-20 w-64 h-64 overflow-hidden pointer-events-none",
            "rtl:left-0 ltr:right-0"
          )}
        >
          <div
            className={cn(
              "absolute top-14 w-60 transform bg-secondary-mint-green text-white text-center py-1 text-sm font-medium",
              "rtl:-left-12 rtl:-rotate-45 ltr:-right-12 ltr:rotate-45"
            )}
          >
            {t("forLimitedTime")}
          </div>
        </div>

        {/* Content Section (Right side in RTL) */}
        <div className="flex-1 p-6 flex flex-col gap-4 text-start order-2">
          <div>
            <h3 className="text-xl font-bold text-primary flex items-center justify-start gap-2">
              {offer.center_name}
              <span className="text-2xl">🥳</span>
            </h3>
            <p className="text-gray-500 mt-1">{offer.address}</p>
          </div>

          <div>
            <p className="text-gray-700">{offer.descriptions}</p>
          </div>

          <div className="space-y-2 mt-auto text-sm">
            <p className="font-semibold text-primary">{offer.money_details}</p>

            {offer.location && (
              <div className="flex items-center gap-1 ltr:flex-row rtl:flex-row-reverse">
                <span className="text-gray-600 shrink-0">{t("location")}:</span>
                <a
                  href={offer.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:underline block truncate"
                >
                  {offer.location}
                </a>
              </div>
            )}
          </div>

          <div className="text-start text-gray-600 text-sm">
            {offer.time_details}
            <div className="mt-1">{offer.additional_details}</div>
          </div>
        </div>

        {/* Image Section (Left side in RTL) */}
        <div className="rounded-xl overflow-hidden w-full md:w-[240px] h-full bg-gray-100 order-1 relative">
          {photos.length > 0 ? (
            <Carousel
              className="w-full h-full [&>div]:h-full"
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
            >
              <CarouselContent className="h-full ml-0">
                {photos.map((photo: any, index: number) => {
                  const imageUrl =
                    typeof photo === "string" ? photo : photo.url;

                  return (
                    <CarouselItem key={index} className="pl-0 h-full relative">
                      <Image
                        src={imageUrl || "/placeholder.png"}
                        alt={`Offer image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback could be handled here if needed
                        }}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {photos.length > 1 && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-50">
                  {photos.map((_: any, idx: number) => (
                    <span
                      key={idx}
                      className="w-2 h-2 rounded-full bg-white/50"
                    />
                  ))}
                </span>
              )}
            </Carousel>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {t("noImage")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
