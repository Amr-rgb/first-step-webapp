"use client";

import CenterCard from "./CenterCard";
import { useCenters } from "@/hooks/useBranches";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState";

const Centers = () => {
  const { data: centers, isLoading, error } = useCenters();
  const t = useTranslations("dashboard.admin.center");

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error.load")}</div>;

  // Show empty state if no centers
  if (!centers || centers.length === 0) {
    return (
      <EmptyState
        title={t("emptyStates.centers.title")}
        description={t("emptyStates.centers.description")}
        icon="🏢"
        size="lg"
        translationKey="dashboard.emptyStates"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {centers.map((center: any) => (
        <CenterCard key={center.id} center={center} />
      ))}
    </div>
  );
};

export default Centers;
