"use client";

import CenterCard from "./CenterCard";
import { useCenters } from "@/hooks/useBranches";
import { useTranslations } from "next-intl";

const Centers = () => {
  const { data: centers, isLoading, error } = useCenters();
  const t = useTranslations("dashboard.admin.center");

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("error.load")}</div>;

  return (
    <div className="flex flex-col gap-4">
      {centers.map((center: any) => (
        <CenterCard key={center.id} center={center} />
      ))}
    </div>
  );
};

export default Centers;
