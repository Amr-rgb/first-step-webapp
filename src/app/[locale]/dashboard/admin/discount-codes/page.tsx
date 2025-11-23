"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";
import DiscountCodes from "@/components/dashboard/admin-discount-codes/DiscountCodes";

export default function DiscountCodesPage() {
  const meta = usePageMetadata();

  return (
    <div>
      <DiscountCodes />
    </div>
  );
}
