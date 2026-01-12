"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { BranchFormData, createBranchSchema } from "@/lib/schemas";
import { useBranch } from "@/hooks/useBranches";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/api";
import Branch from "./Branch";
import BranchFormSkeleton from "./BranchFormSkeleton";
import { useBranchMutations } from "./hooks/useBranchMutations";
import {
  transformFetchedBranchToFormData,
  transformFormDataToApiPayload,
  getDirtyValues,
} from "./utils/branchDataTransformer";

interface BranchWrapperProps {
  editBranchId?: string;
  mode: "add" | "edit";
  onBranchData?: (data: any) => void;
  onBranchCreated?: (data: { id: string; name: string }) => void;
}

const BranchWrapper = ({
  editBranchId,
  mode,
  onBranchData,
  onBranchCreated,
}: BranchWrapperProps) => {
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const locale = useLocale();

  const { data: fetchedBranch, isLoading: isFetchingBranch } =
    useBranch(editBranchId);

  useEffect(() => {
    if (fetchedBranch && onBranchData) {
      onBranchData(fetchedBranch);
    }
  }, [fetchedBranch, onBranchData]);

  const { data: apiCenterTypes } = useQuery({
    queryKey: ["centerTypes"],
    queryFn: () => authService.getCenterTypes(),
  });

  const transformedInitialValues: BranchFormData | undefined = useMemo(() => {
    if (!fetchedBranch) return undefined;
    const formData = transformFetchedBranchToFormData(fetchedBranch);

    // Map names to IDs if types contains names
    if (apiCenterTypes && Array.isArray(apiCenterTypes)) {
      formData.types = formData.types.map((typeVal) => {
        const matchingType = apiCenterTypes.find(
          (t: any) => t.name === typeVal || t.id.toString() === typeVal
        );
        return matchingType ? matchingType.id.toString() : typeVal;
      });
    }

    return formData;
  }, [fetchedBranch, apiCenterTypes]);

  const branchSchema = createBranchSchema(locale as "ar" | "en");

  const methods = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      neighborhood: "",
      nursery_type: [],
      types: [],
      city: "",
      location: "",
      services: [],
      additional_service: "",
      accepted_ages: [],
      work_days_from: "",
      work_days_to: "",
      work_hours_from: "",
      work_hours_to: "",
      emergency_contact: undefined,
      communication_methods: [],
      meals_and_periods: {
        provides_food: "yes",
        first_meals: [{ meal_name: "", juice: "", components: "" }],
        second_meals: [{ meal_name: "", juice: "", components: "" }],
        time_of_first_period: "",
        time_of_second_period: "",
      },
      license_path: undefined,
      commercial_record_path: undefined,
      logo: undefined,
    },
    mode: "onChange",
  });

  const { updateBranchMutation, createBranchMutation } = useBranchMutations({
    editBranchId,
    methods,
    setApiErrors,
    onBranchCreated,
  });

  const isEditMode = mode === "edit";
  const isDisabled = isEditMode && !methods.formState.isDirty;

  useEffect(() => {
    if (mode === "edit" && transformedInitialValues) {
      methods.reset(transformedInitialValues);
    }
  }, [mode, transformedInitialValues, methods]);

  const onSubmitBranch = (data: BranchFormData) => {
    if (mode === "edit") {
      const dirtyFields = methods.formState.dirtyFields;
      const allValues = methods.getValues();
      const dirtyValues = getDirtyValues(dirtyFields, allValues);
      const payload = transformFormDataToApiPayload(dirtyValues);
      updateBranchMutation.mutate(payload);
    } else {
      const payload = transformFormDataToApiPayload(data);
      createBranchMutation.mutate(payload);
    }
  };

  if (mode === "edit" && isFetchingBranch) {
    return <BranchFormSkeleton />;
  }

  const isSubmitting =
    createBranchMutation.isPending || updateBranchMutation.isPending;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={
          mode === "edit"
            ? (e) => {
                e.preventDefault();
                onSubmitBranch(methods.getValues());
              }
            : methods.handleSubmit(onSubmitBranch)
        }
        className="flex flex-col items-center space-y-8"
      >
        <Branch
          mode={mode}
          isSubmitting={isSubmitting}
          disabled={isDisabled || isSubmitting}
        />

        {Object.keys(apiErrors).length > 0 && (
          <div className="w-full max-w-2xl mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Please fix the following errors:</p>
            </div>
            <ul className="space-y-1.5 text-sm">
              {Object.entries(apiErrors).map(([field, messages]) => (
                <li key={field} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{messages[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default BranchWrapper;
