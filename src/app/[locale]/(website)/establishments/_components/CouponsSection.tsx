"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getCenterPromocodesAction } from "@/actions/nurseryActions";
import SectionHeader from "./SectionHeader";
import CouponCard from "@/components/coupons/CouponCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface CouponsSectionProps {
  centerId: string;
  nurseryLogo?: string;
  tNamespace?: string;
}

const CouponsSection = ({ centerId, nurseryLogo, tNamespace = "nurseryDetails" }: CouponsSectionProps) => {
  const t = useTranslations(`${tNamespace}.coupons` as any);
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["center-promocodes", centerId],
    queryFn: () => getCenterPromocodesAction(centerId),
    select: (data) => data.filter((coupon: any) => coupon.status === "active"),
  });

  if (!isLoading && (!coupons || coupons.length === 0)) return null;

  return (
    <section id="coupons" className="py-0 scroll-mt-20">
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
                  className="pl-4 basis-full md:basis-1/2 lg:basis-full"
                >
                  <Skeleton className="h-40 w-full rounded-2xl" />
                </CarouselItem>
              ))
              : coupons.map((coupon: any) => (
                <CarouselItem
                  key={coupon.id}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-full"
                >
                  <CouponCard
                    title={coupon.title || ""}
                    endDate={coupon.end_date}
                    percentage={parseInt(coupon.percentage) || 0}
                    code={coupon.title}
                    color={coupon.color || "#2B3990"}
                    viewType="branches"
                    centers={
                      coupon.branches?.map((branch: any) => ({
                        id: branch.id,
                        name: branch.name,
                        logo: nurseryLogo || "/assets/logos/logo.svg",
                      })) || []
                    }
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
};

export default CouponsSection;
