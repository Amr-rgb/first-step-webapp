"use client";

import { useState } from "react";
import CenterCard from "./CenterCard";
import { useCenters } from "@/hooks/useBranches";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState";
import { FilterButtons } from "@/components/common/FilterButtons";

const Centers = () => {
  const { data: centers, isLoading, error } = useCenters();
  const t = useTranslations("dashboard.admin.center");
  const [activeFilter, setActiveFilter] = useState("all");

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error.load")}</div>;

  // Show empty state if no centers at all (before filtering)
  if (!centers || centers.length === 0) {
    return (
      <EmptyState
        icon="🏢"
        size="lg"
        translationKey="dashboard.emptyStates.centers"
      />
    );
  }

  const counts = {
    all: centers.length,
    pending: centers.filter((c: any) => c.status === "pending").length,
    confirmed: centers.filter((c: any) => c.status === "confirmed").length,
    canceled: centers.filter((c: any) => c.status === "canceled").length,
  };

  const filterOptions = [
    { value: "all", label: t("status.all"), count: counts.all },
    { value: "pending", label: t("status.pending"), count: counts.pending },
    {
      value: "confirmed",
      label: t("status.confirmed"),
      count: counts.confirmed,
    },
    { value: "canceled", label: t("status.canceled"), count: counts.canceled },
  ];

  const filteredCenters = centers.filter((center: any) => {
    if (activeFilter === "all") return true;
    return center.status === activeFilter;
  });

  return (
    <div className="flex flex-col gap-4">
      <FilterButtons
        filters={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {filteredCenters.length > 0 ? (
        filteredCenters.map((center: any) => (
          <CenterCard key={center.id} center={center} />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p className="text-muted-foreground">{t("noResults")}</p>
        </div>
      )}
    </div>
  );
};

export default Centers;
