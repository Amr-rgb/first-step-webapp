"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CouponCard from "@/components/coupons/CouponCard";
import { websiteService } from "@/services/promocodeService";
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

export default function CouponCodesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

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
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              جاري التحميل...
            </div>
          ) : coupons.length > 0 ? (
            coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                title={coupon.description || coupon.title} // User said description is main text, title is code. But if description is null, fallback to title? Or maybe empty string.
                endDate={coupon.end_date}
                percentage={parseFloat(coupon.percentage)}
                code={coupon.title}
                color={coupon.color}
                centers={[...coupon.centers, ...(coupon.branches || [])]}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              لا توجد كوبونات متاحة حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
