"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBranch } from "@/hooks/useBranches";
import { BranchFormData, createBranchSchema } from "@/lib/schemas";
import { Step1BasicInfo } from "../../center/Step1";
import { Step2AgesAndHours } from "../../center/Step2";
import { Step3Communication } from "../../center/Step3";
import { Step4Permits } from "../../center/Step4";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import BranchFormSkeleton from "./BranchFormSkeleton";
import { usePermissions } from "@/hooks/usePermissions";

const BranchShow = ({ branchId }: { branchId: string }) => {
  const locale = useLocale();
  const { can } = usePermissions();
  const canEdit = can("edit", "branches", branchId);
  const branchSchema = createBranchSchema(locale as "ar" | "en");

  const { data: fetchedBranch, isLoading: isFetchingBranch } =
    useBranch(branchId);

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

  useEffect(() => {
    if (transformedInitialValues) {
      methods.reset(transformedInitialValues);
    }
  }, [transformedInitialValues, methods]);

  if (isFetchingBranch) {
    return <BranchFormSkeleton />;
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col items-center space-y-8">
        <div className="flex flex-col gap-6">
          <Step1BasicInfo disabled isBranch />
          <Step2AgesAndHours disabled />
          <Step3Communication disabled />
          <Step4Permits disabled />

          <div className="flex justify-center gap-5 lg:gap-x-10">
            {canEdit ? (
              <Button asChild size="sm" variant="default">
                <Link href={`${branchId}/edit`}>
                  {locale === "ar" ? "تعديل الفرع" : "Edit Branch"}
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/center/branches">
                  {locale === "ar" ? "العودة" : "Back"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default BranchShow;
