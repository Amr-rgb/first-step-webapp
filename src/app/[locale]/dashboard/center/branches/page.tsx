"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Branches from "@/components/dashboard/branches/Branches";
import { usePermissions } from "@/hooks/usePermissions";

export default function CenterDashboardHome() {
  const meta = usePageMetadata();

  const t = useTranslations("dashboard.center.branches");
  const { can } = usePermissions();
  const canAddBranch = can("create", "branches");

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="heading-4 font-medium text-primary">{t("title")}</h1>

        {canAddBranch && (
          <Button asChild size={"sm"} variant={"outline"}>
            <Link href={"branches/add"}>{t("add")}</Link>
          </Button>
        )}
      </div>

      <Branches />
    </div>
  );
}
