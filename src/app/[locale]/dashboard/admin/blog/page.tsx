"use client";

import { useState } from "react";
import { Tabs } from "@/components/general/Tabs";
import CentersBlogs from "@/components/dashboard/blog/CentersBlogs";
import AdminBlogs from "@/components/dashboard/blog/AdminBlogs";
import { useTranslations } from "next-intl";

export default function BlogPage() {
  const t = useTranslations("dashboard.admin.blog");
  const [activeTab, setActiveTab] = useState<"firstStep" | "centers">("firstStep");

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

      {activeTab === "firstStep" ? <AdminBlogs /> : <CentersBlogs />}
    </div>
  );
}
