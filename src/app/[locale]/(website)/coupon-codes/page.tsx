"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings2, Check } from "lucide-react";
import CouponCard from "@/components/coupons/CouponCard";
import Image from "next/image";
import { websiteService } from "@/services/promocodeService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

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

type SortOption = "newest" | "percentage";

import { Skeleton } from "@/components/ui/skeleton";
import NewsletterPopup from "@/components/modals/NewsletterPopup";

function CouponSkeleton() {
  return (
    <div>
      {/* Top Row - Centers */}
      <div className="mb-4 flex items-center justify-start py-2 px-4">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className={`w-9 h-9 rounded-full border-2 border-white ${
              i !== 1 ? "-ml-3" : ""
            }`}
          />
        ))}
      </div>

      <div className="relative flex overflow-hidden h-56">
        {/* Right Side - Discount & Code */}
        <div className="w-[35%] relative flex flex-col items-center justify-center rtl:rounded-l-3xl ltr:rounded-r-3xl bg-gray-100">
          <Skeleton className="h-12 w-20 mb-4 bg-gray-200" />
          <Skeleton className="h-8 w-24 rounded-lg bg-gray-200" />
        </div>

        {/* Left Side - Content */}
        <div className="flex-1 p-6 flex flex-col justify-center items-center relative border border-gray-100 rtl:rounded-r-3xl ltr:rounded-l-3xl bg-white">
          <Skeleton className="h-8 w-3/4 mb-3 bg-gray-100" />
          <Skeleton className="h-4 w-1/2 bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function CouponCodesPage() {
  const t = useTranslations("couponCodes");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await websiteService.getPromocodes();
        if (response.success) {
          setCoupons([]);
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        toast.error(t("loading")); // Using loading error message or generic error
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [t]);

  const filteredAndSortedCoupons = useMemo(() => {
    let result = [...coupons];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((coupon) => {
        const titleMatch = (coupon.description || coupon.title)
          .toLowerCase()
          .includes(query);
        const codeMatch = coupon.title.toLowerCase().includes(query);
        const centersMatch = coupon.centers.some((c) =>
          c.name.toLowerCase().includes(query)
        );
        const branchesMatch = coupon.branches?.some((b) =>
          b.name.toLowerCase().includes(query)
        );

        return titleMatch || codeMatch || centersMatch || branchesMatch;
      });
    }

    // Sort
    switch (sortBy) {
      case "percentage":
        result.sort(
          (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)
        );
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [coupons, searchQuery, sortBy]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Search and Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <Button
            size="sm"
            variant="default"
            onClick={() => setShowNewsletter(true)}
          >
            {t("subscribeButton")}
          </Button>

          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full px-12 py-6 rounded-xl border-gray-200 focus:ring-[#4F46E5] text-start shadow-sm bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <div className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-primary-blue transition-colors p-1">
                    <Settings2 className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setSortBy("newest")}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span>{t("sort.newest")}</span>
                    {sortBy === "newest" && (
                      <Check className="w-4 h-4 text-[#4F46E5]" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("percentage")}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span>{t("sort.percentage")}</span>
                    {sortBy === "percentage" && (
                      <Check className="w-4 h-4 text-[#4F46E5]" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-20">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CouponSkeleton key={i} />)
          ) : filteredAndSortedCoupons.length > 0 ? (
            filteredAndSortedCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                title={coupon.description || coupon.title}
                endDate={coupon.end_date}
                percentage={parseFloat(coupon.percentage)}
                code={coupon.title}
                color={coupon.color}
                centers={[...coupon.centers, ...(coupon.branches || [])]}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-64 h-64 mb-8">
                <Image
                  src="/assets/illustrations/empty-cloud.png"
                  alt="No coupons"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-2 mb-8 max-w-xl mx-auto">
                <span className="text-xl md:text-2xl font-medium text-primary-blue">
                  {t("emptyState.title1")}
                </span>
                <span className="text-2xl md:text-4xl font-bold text-primary-blue">
                  {t("emptyState.title2")}
                </span>
              </div>
              <Button
                onClick={() => setShowNewsletter(true)}
                size="sm"
                variant="default"
              >
                {t("emptyState.button")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <NewsletterPopup
        isOpen={showNewsletter}
        onOpenChange={setShowNewsletter}
        isManual
      />
    </div>
  );
}
