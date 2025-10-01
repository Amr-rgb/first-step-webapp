"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Parent } from "@/components/tables/data/parents";
import Parents from "@/components/dashboard/notifications/Parents";
import ReportFields from "./ReportFields";
import { centerService } from "@/services/dashboardApi";
import { toastSuccess, toastError } from "@/lib/toast";

const reportsSchema = z.object({
  activities: z
    .string()
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
  behavior: z
    .string()
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
  meals: z
    .string()
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
  napTime: z
    .string()
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
  additionalNotes: z
    .string()
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
  recipients: z
    .array(z.any())
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
});

export type ReportsFormData = z.infer<typeof reportsSchema>;

// Function to get filtered parents based on selection
const useFilteredParents = (
  selectedParents: Parent[],
  selectedChildMap: Record<number, string>
): Parent[] => {
  // If no parents are selected, return all parents with all children
  if (selectedParents.length === 0) {
    return selectedParents;
  }

  // Return selected parents with only the selected children (or all children if none selected for that parent)
  return selectedParents.map((parent) => {
    const selectedChildId = selectedChildMap[parent.id];

    // If no child is selected for this parent, return parent with all children
    if (!selectedChildId) {
      return parent;
    }

    // Return parent with only the selected child
    return {
      ...parent,
      childs: parent.childs.filter((child) => child.id === selectedChildId),
    };
  });
};

const ReportsForm = () => {
  const [selectedParents, setSelectedParents] = useState<Parent[]>([]);
  const [selectedChildMap, setSelectedChildMap] = useState<
    Record<number, string>
  >({});

  const router = useRouter();
  const t = useTranslations("dashboard.center-reports.report");

  const methods = useForm<ReportsFormData>({
    resolver: zodResolver(reportsSchema),
    defaultValues: {
      activities: "",
      behavior: "",
      meals: "",
      napTime: "",
      additionalNotes: "",
      recipients: [],
    },
    mode: "onChange",
  });

  const { mutate: sendReport, isPending } = useMutation({
    mutationFn: ({ childIds, payload }: { childIds: string[]; payload: any }) =>
      centerService.sendDailyReport(childIds, payload),
    onSuccess: () => {
      toastSuccess(t("success"));
      router.back();
    },
    onError: (error) => {
      toastError(t("error"));
      console.error("Error sending report:", error);
    },
  });

  const onSubmit = async () => {
    const selectedWithOnlySelectedChild = useFilteredParents(
      selectedParents,
      selectedChildMap
    );

    // Update the hidden field value before validation
    methods.setValue("recipients", selectedWithOnlySelectedChild);

    const valid = await methods.trigger(); // re-validate with updated recipients
    if (!valid) return;

    const data = methods.getValues();

    // Gather all selected child IDs
    const childIds = data.recipients
      .flatMap((parent: any) => parent.childs.map((child: any) => child.id))
      .filter(Boolean);
    if (!childIds.length) {
      toastError(t("noChildSelected"));
      return;
    }

    // Transform the data to match the API's expected format
    const payload = {
      activities: data.activities,
      behavior: data.behavior,
      meals: data.meals,
      nap_time: data.napTime,
      notes: data.additionalNotes,
    };

    sendReport({ childIds, payload });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent default submission
          onSubmit(); // our custom function
        }}
        className="flex flex-col gap-y-6"
      >
        <div className="space-y-6 lg:p-4">
          <p className="heading-4 text-primary text-center">{t("title")}</p>
          <ReportFields />
        </div>

        <Parents
          selected={selectedParents}
          setSelected={setSelectedParents}
          selectedChildMap={selectedChildMap}
          setSelectedChildMap={setSelectedChildMap}
        />

        <input type="hidden" {...methods.register("recipients")} />
        {methods.formState.errors.recipients && (
          <p className="text-sm text-red-500 text-center mt-2">
            {methods.formState.errors.recipients.message}
          </p>
        )}

        <div className="flex justify-center gap-5 lg:gap-x-10">
          <Button size={"sm"} type="submit" disabled={isPending}>
            {isPending ? t("sending") : t("send")}
          </Button>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => router.back()}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ReportsForm;
