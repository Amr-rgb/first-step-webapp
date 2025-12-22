"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface ExternalOfferCardProps {
  offer: any;
  onDelete: (id: string) => void;
  onEdit: (offer: any) => void;
  onRestore: (id: string) => void;
}

export default function ExternalOfferCard({
  offer,
  onDelete,
  onEdit,
  onRestore,
}: ExternalOfferCardProps) {
  const t = useTranslations("externalOffers");
  // Parsing photos if they are inconsistent
  const photos = Array.isArray(offer.photos) ? offer.photos : [];
  const isArchived = offer.status === "archived";

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col md:flex-row h-full">
        {/* Actions Button Group - Positioned absolute or flex */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isArchived ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full shadow-sm bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onRestore(offer.id);
              }}
              title={t("buttons.restore")}
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(offer.id);
              }}
              title={t("buttons.archive")}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Content Section (Right side in RTL) */}
        <div
          className="flex-1 p-6 flex flex-col lg:grid lg:grid-cols-2 gap-4 text-start order-2 cursor-pointer"
          onClick={() => onEdit(offer)}
        >
          <div>
            <h3 className="text-xl font-bold text-primary flex items-center justify-start gap-2">
              {offer.center_name}
            </h3>
            <p className="text-gray-500 mt-1">{offer.address}</p>
          </div>

          <div>
            <p className="text-gray-700">{offer.descriptions}</p>
          </div>

          <div className="space-y-2 mt-auto">
            <p className="font-semibold text-primary">{offer.money_details}</p>

            {offer.url && (
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm block dir-ltr truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {offer.url}
              </a>
            )}
          </div>

          <div className="text-start text-gray-600 text-sm">
            {offer.time_details}
            <div className="mt-1">{offer.additional_details}</div>
            <div className="mt-1 font-bold">
              <span>0553297766</span>
              {/* This phone number seems hardcoded in image but likely comes from details */}
            </div>
          </div>
        </div>

        {/* Image Section (Left side in RTL) */}
        <div className="rounded-xl overflow-hidden w-full h-full md:w-[120px] bg-gray-100 order-1 relative">
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
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {t("noImage")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
