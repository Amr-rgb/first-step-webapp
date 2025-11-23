"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings2, Check } from "lucide-react";
import CouponCard from "@/components/coupons/CouponCard";
import { websiteService } from "@/services/promocodeService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function CouponCodesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await websiteService.getPromocodes();
        if (response.success) {
          setCoupons(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        toast.error("فشل في تحميل الكوبونات");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

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
          <Button className="bg-[#4F46E5] hover:bg-[#4338ca] text-white px-8 py-6 text-lg rounded-xl shadow-md transition-all">
            اشترك في نشرة الكوبونات
          </Button>

          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <Input
              type="text"
              placeholder="ابحث عن كوبون أو حضانة أو مركز"
              className="w-full pl-12 pr-12 py-6 rounded-full border-gray-200 focus:ring-[#4F46E5] text-right shadow-sm bg-white"
              dir="rtl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-[#4F46E5] transition-colors p-1">
                    <Settings2 className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setSortBy("newest")}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span>الأحدث</span>
                    {sortBy === "newest" && (
                      <Check className="w-4 h-4 text-[#4F46E5]" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("percentage")}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span>الأعلى خصماً</span>
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
            <div className="col-span-full text-center py-12 text-gray-500">
              جاري التحميل...
            </div>
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
            <div className="col-span-full text-center py-12 text-gray-500">
              لا توجد كوبونات تطابق بحثك
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
