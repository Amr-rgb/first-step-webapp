"use client";

import { useState } from "react";
import { Tabs } from "@/components/general/Tabs";
import Children from "@/components/dashboard/children/Children";
import Parents from "@/components/dashboard/Parents/Parents";
import { useTranslations } from "next-intl";

export default function ParentsPage() {
  const [activeTab, setActiveTab] = useState<"parents" | "children">("parents");
  const t = useTranslations("dashboard.admin.parents");

  return (
    <div>
      <Tabs
        options={[
          { value: "parents", label: t("tabs.parents") },
          { value: "children", label: t("tabs.children") },
        ]}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "parents" ? (
        <Parents />
      ) : (
        <Children noEdit baseUrl="children" />
      )}
    </div>
  );
}
