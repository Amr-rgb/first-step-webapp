"use client";

import React from "react";
import { Copy, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn, createSlug } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";

interface CouponCardProps {
  title: string;
  endDate: string;
  percentage: number;
  code: string;
  color: string;
  centers: {
    id: number;
    logo: string;
    name: string;
    nursery_name_for_center?: string;
  }[];
}

const COLORS = [
  "#2B3990", // Blue
  "#D9534F", // Peach
  "#83CBAA", // Sage
  "#B12F53", // Rose
];

export default function CouponCard({
  title,
  endDate,
  percentage,
  code,
  color,
  centers,
}: CouponCardProps) {
  const t = useTranslations("couponCodes.card");
  const locale = useLocale();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t("copySuccess"));
  };

  return (
    <div className="group hover:-translate-y-1 transition-transform duration-300">
      <div className="relative flex overflow-hidden h-56 group">
        {/* Right Side (Colored) - Discount & Code */}
        <div
          className={cn(
            "w-[35%] relative flex flex-col items-center justify-center text-white overflow-hidden",
            "rtl:rounded-l-3xl ltr:rounded-r-3xl"
          )}
          style={{ backgroundColor: color }}
        >
          <div
            className={cn(
              "absolute inset-y-1/2 -translate-y-1/2 size-8 md:size-12 bg-white rounded-full z-20",
              "rtl:right-0 ltr:left-0 rtl:translate-x-1/2 ltr:-translate-x-1/2"
            )}
          />

          <div className="relative z-20 text-center mt-6 flex flex-col items-center gap-2 gap-y-8 sm:gap-y-4">
            <div className="text-5xl font-bold tracking-tighter">
              {percentage}
              <span className="text-3xl align-top">%</span>
            </div>

            <button
              onClick={() => handleCopyCode(code)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg backdrop-blur-sm transition-colors active:scale-95"
            >
              <span className="font-mono font-bold tracking-wider text-sm sm:text-lg">
                {code}
              </span>
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div
            className="absolute inset-0 z-10 mix-blend-multiply"
            style={{ backgroundImage: "url('/assets/backgrounds/noise.jpg')" }}
          />
        </div>

        {/* Left Side (White) - Content */}
        <div
          className={cn(
            "flex-1 p-6 flex flex-col justify-center items-center text-center relative z-10 bg-white",
            "border border-primary-blue rtl:rounded-r-3xl ltr:rounded-l-3xl"
          )}
        >
          <div
            className={cn(
              "absolute inset-y-1/2 -translate-y-1/2 size-8 md:size-12 bg-white rounded-full border border-primary-blue z-10",
              "rtl:left-0 ltr:right-0 rtl:-translate-x-1/2 ltr:translate-x-1/2"
            )}
          />

          <Image
            className={cn(
              "pointer-events-none select-none opacity-20 absolute",
              "ltr:-bottom-1/5 ltr:-right-[12%] rtl:-bottom-1/5 rtl:-left-[12%]"
            )}
            src="/assets/logos/logo.svg"
            alt="Firststep"
            width={160}
            height={200}
          />

          <Image
            className={cn(
              "pointer-events-none select-none z-20 absolute top-1/2 -translate-y-1/2",
              "ltr:left-0 ltr:-translate-x-1/2 rtl:right-0 rtl:translate-x-1/2",
              "ltr:rotate-y-180",
              "size-24 sm:size-[125px]"
            )}
            src={
              color === COLORS[0]
                ? `/assets/illustrations/coupon1.png`
                : color === COLORS[1]
                ? `/assets/illustrations/coupon2.png`
                : color === COLORS[2]
                ? `/assets/illustrations/coupon3.png`
                : `/assets/illustrations/coupon4.png`
            }
            alt="coupon"
            width={125}
            height={125}
          />

          <h3 className="text-3xl font-bold text-[#2B3990] mb-3 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {t("validUntil")} {endDate}
          </p>

          {centers.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 mt-4 text-xs font-semibold text-[#2B3990] hover:underline z-20 relative">
                  <MapPin className="w-4 h-4" />
                  {t("viewCenters")}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t("viewCenters")}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  {centers.map((center) => {
                    const centerName =
                      center.nursery_name_for_center || center.name;
                    return (
                      <Link
                        key={center.id}
                        href={`/${locale}/nurseries/${createSlug(
                          centerName
                        )}?branch=${center.id}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border bg-white flex-shrink-0">
                          <Image
                            src={center.logo}
                            alt={center.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900">
                          {center.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
