"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBranch } from "@/hooks/useBranches";
import { BranchFormData, createBranchSchema } from "@/lib/schemas";
import { Step1BasicInfo } from "../../center/Step1";
import { Step2AgesAndHours } from "../../center/Step2AgesAndHours";
import { Step3Communication } from "../../center/Step3";
import { Step4Permits } from "../../center/Step4";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import BranchFormSkeleton from "./BranchFormSkeleton";
import { usePermissions } from "@/hooks/usePermissions";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/api";
import { transformFetchedBranchToFormData } from "./utils/branchDataTransformer";

const BranchShow = ({ branchId }: { branchId: string }) => {
  const locale = useLocale();
  const { can } = usePermissions();
  const canEdit = can("edit", "branches", branchId);
  const branchSchema = createBranchSchema(locale as "ar" | "en");

  const { data: fetchedBranch, isLoading: isFetchingBranch } =
    useBranch(branchId);

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

  const methods = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      // step1
      nursery_name: "",
      phone: "",
      neighborhood: "",
      nursery_type: [],
      types: [],
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
          <Step1BasicInfo disabled isBranch show />
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
