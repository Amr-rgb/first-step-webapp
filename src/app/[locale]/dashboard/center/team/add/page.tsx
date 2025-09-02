"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import MemberFormWrapper from "@/components/forms/dashboard/team/MemberFormWrapper";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function AddTeamMember() {
  const meta = usePageMetadata();

  const t = useTranslations("dashboard.center.team");
  const searchParams = useSearchParams();
  const branchId = searchParams.get("branch_id");

  return (
    <div className="p-10 flex flex-col gap-y-6">
      <p className="heading-4 font-medium text-primary text-center">
        {t("add.title")}
      </p>

      <MemberFormWrapper
        initialData={{
          name: "",
          branch: branchId || "",
          job: "",
          image: undefined,
        }}
        mode="add"
      />
    </div>
  );
}
