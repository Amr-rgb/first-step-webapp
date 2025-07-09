"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs } from "@/components/general/Tabs";
import AdminAds from "@/components/dashboard/advertisement/AdminAds";
import CentersAdvertisements from "@/components/dashboard/advertisement/CentersAdvertisements";

export default function Advertisement() {
  const t = useTranslations("dashboard.admin.advertisement");
  const [activeTab, setActiveTab] = useState<"firstStep" | "centers">(
    "firstStep"
  );

  return (
    <div className="flex flex-col gap-y-6">
      <Tabs
        options={[
          { value: "firstStep", label: t("tabs.firstStep") },
          { value: "centers", label: t("tabs.centers") },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "firstStep" ? <AdminAds /> : <CentersAdvertisements />}
    </div>
  );
}
