"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings2, Check, Share2, SearchX } from "lucide-react";
import CouponCard from "@/components/coupons/CouponCard";
import PublicExternalOfferCard from "@/components/coupons/PublicExternalOfferCard";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import NewsletterPopup from "@/components/modals/NewsletterPopup";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
type ViewType = "coupons" | "offers";

interface OffersAndCouponsClientProps {
  initialView: ViewType;
  initialCoupons: Coupon[];
  initialOffers: any[];
}

function EmptyState({
  onSubscribeClick,
  t,
}: {
  onSubscribeClick: () => void;
  t: any;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/assets/illustrations/empty-cloud.png"
          alt="No items"
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
      <Button onClick={onSubscribeClick} size="sm" variant="default">
        {t("emptyState.button")}
      </Button>
    </div>
  );
}

function SearchResultsEmptyState({ t }: { t: any }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 text-gray-300">
        <SearchX className="w-24 h-24" />
      </div>
      <span className="text-xl font-bold text-gray-500">{t("noResults")}</span>
    </div>
  );
}

export default function OffersAndCouponsClient({
  initialView,
  initialCoupons,
  initialOffers,
}: OffersAndCouponsClientProps) {
  usePageMetadata();

  const t = useTranslations("couponCodes");
  const tTabs = useTranslations("externalOffers.tabs");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeView, setActiveView] = useState<ViewType>(initialView);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showNewsletter, setShowNewsletter] = useState(false);

  const handleTabChange = (newView: ViewType) => {
    setActiveView(newView);
    const params = new URLSearchParams(searchParams.toString());

    if (newView === "offers") {
      params.set("view", "offers");
    } else {
      params.delete("view");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: t("share"),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("card.copySuccess"));
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const filteredAndSortedCoupons = useMemo(() => {
    let result = [...initialCoupons];

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
  }, [initialCoupons, searchQuery, sortBy]);

  const filteredOffers = useMemo(() => {
    if (!searchQuery) return initialOffers;

    const query = searchQuery.toLowerCase();
    return initialOffers.filter((offer) => {
      return (
        offer.center_name?.toLowerCase().includes(query) ||
        offer.descriptions?.toLowerCase().includes(query) ||
        offer.address?.toLowerCase().includes(query)
      );
    });
  }, [initialOffers, searchQuery]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Search and Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
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
              className="w-full px-12 py-6 rounded-xl border-gray-200 focus:ring-primary text-start shadow-sm bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            {activeView === "coupons" && (
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
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("percentage")}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <span>{t("sort.percentage")}</span>
                      {sortBy === "percentage" && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {/* Tabs and Share Button Row */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mb-8">
          {/* Share Button */}
          <Button
            variant="outline"
            onClick={handleShare}
            size="sm"
            className="w-full md:w-auto"
          >
            <span>{t("share")}</span>
            <Share2 className="w-5 h-5" />
          </Button>

          {/* Custom Tabs */}
          <div className="flex items-center border border-primary rounded-xl overflow-hidden bg-white w-full md:w-auto">
            <button
              onClick={() => handleTabChange("offers")}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-2 transition-all duration-300 font-medium min-w-[200px]",
                activeView === "offers"
                  ? "blue-gradient text-white"
                  : "text-primary hover:bg-gray-50"
              )}
            >
              <span>{tTabs("externalOffers")}</span>
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/illustrations/offer-icon.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
            </button>
            <div className="w-[1px] h-full bg-primary" />
            <button
              onClick={() => handleTabChange("coupons")}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-2 transition-all duration-300 font-medium min-w-[200px]",
                activeView === "coupons"
                  ? "blue-gradient text-white"
                  : "text-primary hover:bg-gray-50 bg-white"
              )}
            >
              <span>{tTabs("coupons")}</span>
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/illustrations/floating-coupons.png"
                  alt="icon"
                  fill
                  className="object-contain"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-20">
          {activeView === "coupons" ? (
            filteredAndSortedCoupons.length > 0 ? (
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
            ) : searchQuery ? (
              <SearchResultsEmptyState t={t} />
            ) : (
              <EmptyState
                onSubscribeClick={() => setShowNewsletter(true)}
                t={t}
              />
            )
          ) : filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <PublicExternalOfferCard key={offer.id} offer={offer} />
            ))
          ) : searchQuery ? (
            <SearchResultsEmptyState t={t} />
          ) : (
            <EmptyState
              onSubscribeClick={() => setShowNewsletter(true)}
              t={t}
            />
          )}
        </div>

        <NewsletterPopup
          isOpen={showNewsletter}
          onOpenChange={setShowNewsletter}
          isManual
        />
      </div>
    </div>
  );
}
