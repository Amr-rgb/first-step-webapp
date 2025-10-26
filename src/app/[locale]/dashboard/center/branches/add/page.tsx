"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess } from "@/lib/toast";
import BranchWrapper from "@/components/forms/dashboard/branches/BranchWrapper";

export default function DashboardAddBranch({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleBranchCreated = (data: { id: string; name: string }) => {
    toastSuccess(
      locale === "ar" ? "تم إنشاء الفرع بنجاح" : "Branch created successfully"
    );
    queryClient.refetchQueries({ queryKey: ["branches"] });
    router.push(`/${locale}/dashboard/center/branches`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="heading-4 font-bold text-primary">
          {locale === "ar" ? "إضافة فرع" : "Add Branch"}
        </h1>
      </div>

      <BranchWrapper mode="add" onBranchCreated={handleBranchCreated} />
    </div>
  );
}
