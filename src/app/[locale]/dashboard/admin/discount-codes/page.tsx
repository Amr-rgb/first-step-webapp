"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";
import DiscountCodes from "@/components/dashboard/admin-discount-codes/DiscountCodes";
import ExternalOffers from "@/components/dashboard/admin-discount-codes/ExternalOffers";
import { Tabs } from "@/components/general/Tabs";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function DiscountCodesPage() {
  const meta = usePageMetadata();
  const t = useTranslations("externalOffers.tabs");

  const [activeTab, setActiveTab] = useState<"internal" | "external">(
    "internal"
  );

  const tabOptions = [
    { value: "internal" as const, label: t("coupons") },
    { value: "external" as const, label: t("externalOffers") },
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
