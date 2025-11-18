"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";
import Coupons from "@/components/dashboard/discount-coupons/Coupons";

export default function DiscountCouponsPage() {
  const meta = usePageMetadata();

  return (
    <div>
      <Coupons />
    </div>
  );
}

