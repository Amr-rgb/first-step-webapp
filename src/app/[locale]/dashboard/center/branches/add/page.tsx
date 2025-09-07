"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { use, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { centerService } from "@/services/dashboardApi";
import BranchWrapper from "@/components/forms/dashboard/branches/BranchWrapper";
import BranchAdminForm from "@/components/forms/dashboard/branches/BranchAdminForm";
import { BranchAdminFormData } from "@/lib/schemas";

export default function DashboardAddBranch({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const meta = usePageMetadata();

  const { locale } = use(params);
  const t = useTranslations("dashboard.center.branches");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branchPayload, setBranchPayload] = useState<any | null>(null);

  const handleBranchDraft = (data: any, name: string) => {
    setBranchPayload(data);
    setBranchName(name);
    setIsAdminFormOpen(true);
  };

  const handleAdminSubmit = async (admin: BranchAdminFormData) => {
    if (!branchPayload) return;

    try {
      setIsSubmitting(true);

      // Merge admin fields with branch payload for a single request
      const mergedPayload: any = {
        ...branchPayload,
        email: admin.email,
        password: admin.password,
      };

      const created = await centerService.createBranch(mergedPayload);
      toast.success(t("admin.assigned"));

      queryClient.refetchQueries({ queryKey: ["branches"] });

      // After successful creation, go back to branches list
      router.push(`/${locale}/dashboard/center/branches`);
    } catch (error) {
      console.error("Error creating branch with admin:", error);
      toast.error(t("errors.something_went_wrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isAdminFormOpen) {
      setIsSubmitting(false);
    }
  }, [isAdminFormOpen]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="heading-4 font-bold text-primary">
          {locale === "ar" ? "إضافة فرع" : "Add Branch"}
        </h1>
      </div>

      <BranchWrapper mode="add" onBranchDraft={handleBranchDraft} />

      <BranchAdminForm
        open={isAdminFormOpen}
        setOpen={setIsAdminFormOpen}
        onSubmit={handleAdminSubmit}
        branchName={branchName}
        disabled={isSubmitting}
      />
    </div>
  );
}
