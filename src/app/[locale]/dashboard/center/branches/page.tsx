"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Branches from "@/components/dashboard/branches/Branches";
import { usePermissions } from "@/hooks/usePermissions";
import { useEffect } from "react";
import { toastError } from "@/lib/toast";

export default function CenterDashboardHome() {
  const meta = usePageMetadata();
  const router = useRouter();
  const t = useTranslations("dashboard.center.branches");
  const { can } = usePermissions();
  const canViewBranches = can("view", "branches");
  const canAddBranch = can("create", "branches");

  useEffect(() => {
    if (!canViewBranches) {
      toastError(t("permissionError"));
      router.push("/dashboard/center");
    }
  }, [canViewBranches, router, t]);

  if (!canViewBranches) {
    return null;
  }

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
