"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BranchAdminFormData,
  BranchFormData,
  createBranchSchema,
} from "@/lib/schemas";
import Branch from "./Branch";
import { useMutation } from "@tanstack/react-query";
import { useBranch } from "@/hooks/useBranches";
import { centerService } from "@/services/dashboardApi";
import BranchFormSkeleton from "./BranchFormSkeleton";
import { ApiError } from "@/lib/error-handling";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

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
  const [branchId, setBranchId] = useState(null);

  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const locale = useLocale();
  const router = useRouter();

  const { data: fetchedBranch, isLoading: isFetchingBranch } =
    useBranch(editBranchId);

  useEffect(() => {
    if (fetchedBranch && onBranchData) {
      onBranchData(fetchedBranch);
    }
  }, [fetchedBranch, onBranchData]);

  const transformedInitialValues: BranchFormData | undefined = useMemo(() => {
    if (!fetchedBranch) return undefined;
    return {
      nursery_name_ar: fetchedBranch.name || "",
      email: fetchedBranch.email || "",
      phone: fetchedBranch.phone || "",
      neighborhood: fetchedBranch.neighborhood || "",
      nursery_name_en: fetchedBranch.nursery_name || "",
      nursery_type: fetchedBranch.nursery_type || [],
      address: fetchedBranch.address || "",
      city: fetchedBranch.city || "",
      location: fetchedBranch.location || "",
      services: fetchedBranch.services || [],
      additional_service: fetchedBranch.additional_service || "",
      accepted_ages: fetchedBranch.accepted_ages || [],
      work_days_from: fetchedBranch.work_days_from || "",
      work_days_to: fetchedBranch.work_days_to || "",
      work_hours_from: fetchedBranch.work_hours_from || "",
      work_hours_to: fetchedBranch.work_hours_to || "",
      emergency_contact: fetchedBranch.emergency_contact ? "yes" : "no",
      communication_methods: fetchedBranch.communication_methods || [],
      meals_and_periods: {
        provides_food: fetchedBranch.provides_food ? "yes" : "no",
        first_meals: fetchedBranch.first_meals || [],
        second_meals: fetchedBranch.second_meals || [],
        time_of_first_period: fetchedBranch.time_of_first_period || "",
        time_of_second_period: fetchedBranch.time_of_second_period || "",
      },
      license_path: fetchedBranch.license_path || undefined,
      commercial_record_path: fetchedBranch.commercial_record_path || undefined,
      logo: fetchedBranch.logo || undefined,
      comments: fetchedBranch.comments || "",
    };
  }, [fetchedBranch]);

  const branchSchema = createBranchSchema(locale as "ar" | "en");

  const methods = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      // step1
      nursery_name_ar: "",
      nursery_name_en: "",
      email: "",
      phone: "",
      neighborhood: "",
      nursery_type: [],
      address: "",
      city: "",
      location: "",
      services: [],
      additional_service: "",
      // step2
      accepted_ages: [],
      // additionalInfo: "",
      work_days_from: "",
      work_days_to: "",
      work_hours_from: "",
      work_hours_to: "",
      // step3
      emergency_contact: undefined,
      communication_methods: [],
      meals_and_periods: {
        provides_food: "yes",
        first_meals: [{ meal_name: "", juice: "", components: "" }],
        second_meals: [{ meal_name: "", juice: "", components: "" }],
        time_of_first_period: "",
        time_of_second_period: "",
      },
      // step4
      license_path: undefined,
      commercial_record_path: undefined,
      logo: undefined,
      // comments: "",
    },
    mode: "onChange",
  });

  const isEditMode = mode === "edit";
  const isDisabled = isEditMode && !methods.formState.isDirty;

  useEffect(() => {
    if (mode === "edit" && transformedInitialValues) {
      methods.reset(transformedInitialValues);
    }
  }, [mode, transformedInitialValues, methods]);

  const handleApiError = (error: ApiError) => {
    toast.error(error.message);
    const formattedErrors = Object.entries(error.errors || {}).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Array.isArray(value) ? value : [value],
      }),
      {}
    );
    setApiErrors(formattedErrors);
    // Set form errors from API response
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
    onSuccess: (data) => {
      toast.success("Branch updated successfully");
      setBranchId(data.id);
      setApiErrors({});
    },
    onError: handleApiError,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      return await centerService.createBranch(data);
    },
    onSuccess: (data) => {
      toast.success("Branch created successfully");
      setBranchId(data.id);
      setApiErrors({});

      // Call onBranchCreated with the new branch data if provided
      if (onBranchCreated) {
        onBranchCreated({
          id: data.id,
          name: data.name || "",
        });
      }
    },
    onError: handleApiError,
  });

  const branchMutation = useMutation({
    mutationFn: async (data: any) => {
      return await centerService.assignBranch(branchId!, data);
    },
    onSuccess: (data) => {
      toast.success("Branch admin assigned successfully");
      router.back();
      setApiErrors({});
    },
    onError: handleApiError,
  });

  const onSubmitBranch = (data: BranchFormData) => {
    const dirtyFields = methods.formState.dirtyFields;
    const allValues = methods.getValues();

    const getDirtyValues = (dirty: any, values: any): any => {
      if (!dirty) return {};

      return Object.entries(dirty).reduce((acc, [key, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) {
          // Special handling for meals_and_periods - include the whole object if any field is dirty
          if (key === "meals_and_periods") {
            acc[key] = values[key];
          } else {
            const nestedDirty = getDirtyValues(value, values[key]);
            if (Object.keys(nestedDirty).length > 0) {
              acc[key] = nestedDirty;
            }
          }
        } else if (value === true) {
          acc[key] = values[key];
        }
        return acc;
      }, {} as any);
    };

    const dirtyValues = getDirtyValues(dirtyFields, allValues);

    const buildExpectedData = (values: Partial<BranchFormData>) => {
      const result: Record<string, any> = {};

      if ("logo" in values) result.logo = values.logo;
      if ("license_path" in values) result.license_path = values.license_path;
      if ("commercial_record_path" in values)
        result.commercial_record_path = values.commercial_record_path;

      if ("nursery_name_en" in values) result.name = values.nursery_name_ar;
      if ("nursery_name_ar" in values)
        result.nursery_name = values.nursery_name_en;

      if ("email" in values) result.email = values.email;
      if ("address" in values) result.address = values.address;
      if ("phone" in values) result.phone = values.phone;
      if ("comments" in values) result.comments = values.comments;

      if ("nursery_type" in values) result.nursery_type = values.nursery_type;
      if ("additional_service" in values)
        result.additional_service = values.additional_service;

      if ("work_days_from" in values)
        result.work_days_from = values.work_days_from;
      if ("work_days_to" in values) result.work_days_to = values.work_days_to;

      if ("work_hours_from" in values)
        result.work_hours_from = values.work_hours_from;
      if ("work_hours_to" in values)
        result.work_hours_to = values.work_hours_to;

      if ("meals_and_periods" in values) {
        const meals = values.meals_and_periods;
        if (meals && "time_of_first_period" in meals)
          result.time_of_first_period = meals.time_of_first_period;
        if (meals && "time_of_second_period" in meals)
          result.time_of_second_period = meals.time_of_second_period;
        if (meals && "first_meals" in meals)
          result.first_meals = meals.first_meals;
        if (meals && "second_meals" in meals)
          result.second_meals = meals.second_meals;
        if (meals && "provides_food" in meals)
          result.provides_food = meals.provides_food === "yes";
      }

      if ("emergency_contact" in values)
        result.emergency_contact = values.emergency_contact === "yes";
      if ("accepted_ages" in values) {
        result.accepted_ages = values.accepted_ages;
        result.special_needs = values.accepted_ages?.includes("disabled");
      }

      if ("location" in values) result.location = values.location;
      if ("city" in values) result.city = values.city;
      if ("neighborhood" in values) result.neighborhood = values.neighborhood;

      if ("services" in values) result.services = values.services;
      if ("communication_methods" in values)
        result.communication_methods = values.communication_methods;

      // Always include pricing even if unchanged (or you can make this conditional)
      result.pricing = [
        {
          enrollment_type: "daily",
          response_speed: "normal",
          price_amount: 100,
        },
        {
          enrollment_type: "daily",
          response_speed: "emergency",
          price_amount: 120,
        },
        {
          enrollment_type: "monthly",
          response_speed: "normal",
          price_amount: 1200,
        },
        {
          enrollment_type: "monthly",
          response_speed: "emergency",
          price_amount: 1400,
        },
        {
          enrollment_type: "6_months",
          response_speed: "normal",
          price_amount: 6500,
        },
        {
          enrollment_type: "hourly",
          response_speed: "normal",
          price_amount: 30,
        },
      ];

      return result;
    };

    const expectedData = buildExpectedData(
      mode === "edit" ? dirtyValues : data
    );

    if (mode === "edit") {
      updateBranchMutation.mutate(expectedData);
      console.log(expectedData);
    } else {
      mutation.mutate(expectedData);
    }
  };

  if (mode === "edit" && isFetchingBranch) {
    return <BranchFormSkeleton />;
  }

  return (
    <React.Fragment>
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
            isSubmitting={mutation.isPending}
            disabled={
              isDisabled || mutation.isPending || updateBranchMutation.isPending
            }
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
    </React.Fragment>
  );
};

export default BranchWrapper;
