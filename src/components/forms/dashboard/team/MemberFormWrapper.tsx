"use client";

import MemberForm from "./MemberForm";
import { TeamMemberFormData } from "@/lib/schemas";
import { centerService } from "@/services/dashboardApi";
import { useRouter } from "@/i18n/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";

export interface InitialData {
  name: string;
  branch: string;
  job: string;
  image?: File | string;
}

const MemberFormWrapper = ({
  memberId,
  initialData,
  mode,
}: {
  memberId?: string;
  initialData: InitialData;
  mode: "add" | "edit";
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("dashboard.center.team");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: TeamMemberFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("profession", data.job);
      formData.append("branch_id", data.branch);
      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }
      return centerService.createBranchTeamMember(formData);
    },
    onSuccess: ({ data }) => {
      queryClient.refetchQueries({
        queryKey: ["branch-team", data.branch_id],
      });
      toast.success("Team member added successfully");
      router.back();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add team member");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TeamMemberFormData) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("profession", data.job);
      formData.append("branch_id", data.branch);
      if (data.image && typeof data.image !== "string" && data.image[0]) {
        formData.append("image", data.image[0]);
      }
      return centerService.updateBranchTeamMember(memberId!, formData);
    },
    onSuccess: ({ data }) => {
      queryClient.refetchQueries({
        queryKey: ["branch-team", data.branch_id],
      });
      toast.success("Team member updated successfully");
      router.back();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update team member");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => centerService.deleteBranchTeamMember(memberId!),
    onSuccess: ({ data }) => {
      queryClient.refetchQueries({
        queryKey: ["branch-team", data.branch_id],
      });
      toast.success("Team member deleted successfully");
      router.back();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete team member");
    },
  });

  const onAddSubmit = (data: TeamMemberFormData) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: TeamMemberFormData) => {
    updateMutation.mutate(data);
  };

  const onDeleteSubmit = () => {
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <MemberForm
        initialData={initialData}
        mode={mode}
        onSubmit={mode === "add" ? onAddSubmit : onEditSubmit}
        onDelete={onDeleteSubmit}
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending
        }
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title={t("delete.title")}
        description={t("delete.description")}
        onConfirm={handleDelete}
        confirmText={t("delete.confirm")}
        cancelText={t("delete.cancel")}
        variant="destructive"
      />
    </>
  );
};

export default MemberFormWrapper;
