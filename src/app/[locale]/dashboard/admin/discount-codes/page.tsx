"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";
import DiscountCodes from "@/components/dashboard/admin-discount-codes/DiscountCodes";
import ExternalOffers from "@/components/dashboard/admin-discount-codes/ExternalOffers";
import { Tabs } from "@/components/general/Tabs";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function DiscountCodesPage() {
  const meta = usePageMetadata();
  // We can use translations if available, or hardcode for now as per requirement for new tab
  // But likely 'coupons' translation exists.
  // I will use hardcoded for the new tab consistent with my previous steps, or try to adhere to existing style.
  // The image shows "First Step كوبونات" (First Step Coupons) and "الترويج لعروض خارجية" (Promoting External Offers).

  const [activeTab, setActiveTab] = useState<"internal" | "external">(
    "internal"
  );

  const tabOptions = [
    { value: "internal" as const, label: "First Step كوبونات" },
    { value: "external" as const, label: "الترويج لعروض خارجية" },
  ];

  return (
    <div className="space-y-6">
      <Tabs
        options={tabOptions}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === "internal" ? <DiscountCodes /> : <ExternalOffers />}
      </div>
    </div>
  );
}
