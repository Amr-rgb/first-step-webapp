import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { centerService } from "@/services/dashboardApi";
import { toastSuccess, toastError } from "@/lib/toast";
import { ApiError } from "@/lib/error-handling";
import { BranchFormData } from "@/lib/schemas";

interface UseBranchMutationsProps {
  editBranchId?: string;
  methods: UseFormReturn<BranchFormData>;
  setApiErrors: (errors: Record<string, string[]>) => void;
  onBranchCreated?: (data: { id: string; name: string }) => void;
}

export const useBranchMutations = ({
  editBranchId,
  methods,
  setApiErrors,
  onBranchCreated,
}: UseBranchMutationsProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleApiError = (error: ApiError) => {
    toastError(error.message);

    const formattedErrors = Object.entries(error.errors || {}).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? value : [value],
      }),
      {}
    );
    setApiErrors(formattedErrors);

    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : messages;
        methods.setError(field as any, {
          type: "server",
          message: message,
        });
      });
    }
  };

  const updateBranchMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!editBranchId) throw new Error("Missing editBranchId");
      return await centerService.updateBranch(editBranchId, data);
    },
    onSuccess: () => {
      toastSuccess("Branch updated successfully");
      queryClient.refetchQueries({ queryKey: ["branch", editBranchId] });
      queryClient.refetchQueries({ queryKey: ["branches"] });
      setApiErrors({});
      router.back();
    },
    onError: handleApiError,
  });

  const createBranchMutation = useMutation({
    mutationFn: async (data: any) => {
      return await centerService.createBranch(data);
    },
    onSuccess: (data) => {
      toastSuccess("Branch created successfully");
      setApiErrors({});

      if (onBranchCreated) {
        onBranchCreated({
          id: data.id,
          name: data.name || "",
        });
      }
    },
    onError: handleApiError,
  });

  return { updateBranchMutation, createBranchMutation };
};
