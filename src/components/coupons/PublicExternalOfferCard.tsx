"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface PublicExternalOfferCardProps {
  offer: any;
}

export default function PublicExternalOfferCard({
  offer,
}: PublicExternalOfferCardProps) {
  const photos = Array.isArray(offer.photos) ? offer.photos : [];

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0 flex flex-col md:flex-row h-full">
        {/* "For Limited Time" Badge */}
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white px-6 py-2 rounded-br-2xl font-bold text-sm shadow-lg">
            لفترة محدودة
          </div>
        </div>

        {/* Content Section (Right side in RTL) */}
        <div className="flex-1 p-6 flex flex-col gap-4 text-right order-2 md:order-1">
          <div>
            <h3 className="text-xl font-bold text-primary flex items-center justify-end gap-2">
              {offer.center_name}
              <span className="text-2xl">🥳</span>
            </h3>
            <p className="text-gray-500 mt-1">{offer.address}</p>
          </div>

          <div className="px-5">
            <p className="text-gray-700">{offer.descriptions}</p>
          </div>

          <div className="space-y-2 mt-auto">
            <p className="font-semibold text-primary">{offer.money_details}</p>

            {offer.url && (
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm block ltr:text-left rtl:text-right truncate"
              >
                {offer.url}
              </a>
            )}
          </div>

          <div className="text-right text-gray-600 text-sm">
            {offer.time_details}
            <div className="mt-1">{offer.additional_details}</div>
            <div className="mt-1 font-bold ltr flex justify-end">
              <span dir="ltr">0553297766</span>
            </div>
          </div>
        </div>

        {/* Image Section (Left side in RTL) */}
        <div className="w-full md:w-[300px] h-[250px] bg-gray-100 order-1 md:order-2 relative">
          {photos.length > 0 ? (
            <Carousel className="w-full h-full [&>div]:h-full">
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
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {photos.map((_: any, idx: number) => (
                    <div
                      key={idx}
                      className="w-2 h-2 rounded-full bg-white/50"
                    />
                  ))}
                </div>
              )}
            </Carousel>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
