"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CouponCard from "@/components/coupons/CouponCard";

const COLORS = [
  "#2B3990", // Blue
  "#D9534F", // Peach
  "#83CBAA", // Sage
  "#B12F53", // Rose
];

const DUMMY_COUPONS = [
  {
    id: 1,
    title: "اليوم الوطني السعودي",
    endDate: "2025 / 06 / 06",
    percentage: 20,
    code: "NIGHT10",
    color: COLORS[0],
    centers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 2,
    title: "عرض الصيف المميز",
    endDate: "2025 / 08 / 30",
    percentage: 15,
    code: "SUMMER15",
    color: COLORS[1],
    centers: [1, 2],
  },
  {
    id: 3,
    title: "خصم العودة للمدارس",
    endDate: "2025 / 09 / 15",
    percentage: 25,
    code: "SCHOOL25",
    color: COLORS[2],
    centers: [1, 2],
  },
  {
    id: 4,
    title: "خصم خاص للأعضاء",
    endDate: "2025 / 12 / 31",
    percentage: 10,
    code: "MEMBER10",
    color: COLORS[3],
    centers: [1, 2],
  },
];

export default function CouponCodesPage() {
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
              className="w-full pl-4 pr-12 py-6 rounded-full border-gray-200 focus:ring-[#4F46E5] text-right shadow-sm bg-white"
              dir="rtl"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-20">
          {DUMMY_COUPONS.map((coupon) => (
            <CouponCard
              key={coupon.id}
              title={coupon.title}
              endDate={coupon.endDate}
              percentage={coupon.percentage}
              code={coupon.code}
              color={coupon.color}
              centers={coupon.centers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
