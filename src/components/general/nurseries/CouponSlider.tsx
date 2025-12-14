"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CouponCard from "@/components/coupons/CouponCard";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Coupon {
  id: number;
  title: string;
  description: string | null;
  percentage: string;
  end_date: string;
  color: string;
  centers: {
    id: number;
    name: string;
    logo: string;
  }[];
  branches: {
    id: number;
    name: string;
    center_id: number;
    logo: string;
  }[];
}

interface CouponSliderProps {
  coupons: Coupon[];
}

export default function CouponSlider({ coupons }: CouponSliderProps) {
  const t = useTranslations("nurseries");

  const sortedCoupons = React.useMemo(() => {
    return [...coupons].sort((a, b) => b.id - a.id);
  }, [coupons]);

  if (!coupons || coupons.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {sortedCoupons.map((coupon) => (
                <CarouselItem
                  key={coupon.id}
                  className="pl-4 basis-[85%] sm:basis-[65%] md:basis-1/2 lg:basis-[43%] xl:basis-1/3"
                >
                  <div className="p-1">
                    <CouponCard
                      title={coupon.description || coupon.title}
                      endDate={coupon.end_date}
                      percentage={parseFloat(coupon.percentage)}
                      code={coupon.title}
                      color={coupon.color}
                      centers={[...coupon.centers, ...(coupon.branches || [])]}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </div>
          </Carousel>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/coupon-codes">
            <Button size="sm" variant="default">
              {t("viewAllCoupons")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
