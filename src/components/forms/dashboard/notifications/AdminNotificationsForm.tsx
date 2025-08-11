"use client";

import { z } from "zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Parents from "@/components/dashboard/notifications/Parents";
import type { Parent } from "@/components/tables/data/parents";
import Centers from "@/components/dashboard/notifications/Centers";
import type { Center } from "@/components/tables/data/centers";
import NotificationForm from "@/components/forms/dashboard/notifications/NotificationForm";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { adminService, centerService } from "@/services/dashboardApi";
import { toast } from "sonner";

const notificationSchema = z.object({
  type: z
    .string()
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
  day: z.date({
    required_error: getErrorMessage("general-field-required", "ar"),
  }),
  time: z
    .string({
      message: getErrorMessage("invalid-time", "ar"),
    })
    .min(1, { message: getErrorMessage("general-field-required", "ar") }),
  centerRecipients: z.array(z.any()).optional(),
  parentRecipients: z.array(z.any()).optional(),
  recipients: z
    .object({
      centerRecipients: z.array(z.any()),
      parentRecipients: z.array(z.any()),
    })
    .refine(
      (data) =>
        data.centerRecipients.length > 0 || data.parentRecipients.length > 0,
      { message: getErrorMessage("at-least-one-recipient-required", "ar") }
    ),
});

export type NotificationsFormData = z.infer<typeof notificationSchema>;

// Function to get filtered centers based on selection
const useFilteredCenters = (
  selectedCenters: Center[],
  selectedBranchMap: Record<number, number>
): number[] => {
  return selectedCenters
    .map((center) => {
      // If no branch is selected for this center, return both center ID and all branch IDs
      if (!selectedBranchMap[center.id]) {
        return [
          center.id,
          ...center.branches.map((branch) => branch.id),
        ].filter((id): id is number => id != null && id !== undefined);
      }
      // If a specific branch is selected, return only that branch ID
      const selectedId = selectedBranchMap[center.id];
      return selectedId != null && selectedId !== undefined ? [selectedId] : [];
    })
    .flat()
    .filter((id): id is number => id != null && id !== undefined);
};

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

const NotificationsForm = () => {
  const t = useTranslations("dashboard.center.notifications");
  const [selectedParents, setSelectedParents] = useState<Parent[]>([]);
  const [selectedChildMap, setSelectedChildMap] = useState<
    Record<number, string>
  >({});
  const [selectedCenters, setSelectedCenters] = useState<Center[]>([]);
  const [selectedBranchMap, setSelectedBranchMap] = useState<
    Record<number, number>
  >({});

  const sendNotificationMutation = useMutation({
    mutationFn: (data: NotificationsFormData) => {
      const selectedWithOnlySelectedChild = useFilteredParents(
        selectedParents,
        selectedChildMap
      );
      const selectedBranchIds = useFilteredCenters(
        selectedCenters,
        selectedBranchMap
      );

      return adminService.sendNotification({
        userIds: [
          ...selectedWithOnlySelectedChild.map((parent) => parent.id),
          ...selectedBranchIds,
        ],
        title: data.type,
        date: data.day.toISOString().split("T")[0],
        time_start: data.time,
      });
    },
    onSuccess: () => {
      toast.success(t("form.success"));
      methods.reset();
      setSelectedParents([]);
      setSelectedChildMap({});
    },
    onError: (error) => {
      toast.error(t("form.error"));
      console.error("Notification error:", error);
    },
  });

  const methods = useForm<NotificationsFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      type: "",
      day: undefined,
      time: "",
      centerRecipients: [],
      parentRecipients: [],
    },
    mode: "onChange",
  });

  const onSubmit = async () => {
    const selectedWithOnlySelectedChild = useFilteredParents(
      selectedParents,
      selectedChildMap
    );
    const selectedBranchIds = useFilteredCenters(
      selectedCenters,
      selectedBranchMap
    );

    // Update the hidden field values before validation
    methods.setValue("parentRecipients", selectedWithOnlySelectedChild);
    methods.setValue("centerRecipients", selectedBranchIds);
    methods.setValue("recipients", {
      centerRecipients: selectedBranchIds,
      parentRecipients: selectedWithOnlySelectedChild,
    });

    const valid = await methods.trigger(); // re-validate with updated recipients
    if (!valid) return;

    const data = methods.getValues();
    sendNotificationMutation.mutate(data);
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
        <div className="mb-2 w-full flex flex-col gap-y-6">
          <h1 className="heading-4 font-medium text-primary">{t("title")}</h1>

          <NotificationForm />
        </div>

        <div className="mb-6">
          <Centers
            selected={selectedCenters}
            setSelected={setSelectedCenters}
            selectedBranchMap={selectedBranchMap}
            setSelectedBranchMap={setSelectedBranchMap}
          />
        </div>

        <input type="hidden" {...methods.register("centerRecipients")} />
        {methods.formState.errors.centerRecipients && (
          <p className="text-sm text-red-500 text-center mt-2">
            {t("form.recipients.error")}
          </p>
        )}

        <div>
          <Parents
            selected={selectedParents}
            setSelected={setSelectedParents}
            selectedChildMap={selectedChildMap}
            setSelectedChildMap={setSelectedChildMap}
          />
        </div>

        <input type="hidden" {...methods.register("parentRecipients")} />
        {methods.formState.errors.parentRecipients && (
          <p className="text-sm text-red-500 text-center mt-2">
            {t("form.recipients.error")}
          </p>
        )}

        <input type="hidden" {...methods.register("recipients")} />
        {methods.formState.errors.recipients && (
          <p className="text-sm text-red-500 text-center mt-2">
            {t("form.recipients.error")}
          </p>
        )}

        <Button
          size={"sm"}
          type="submit"
          disabled={sendNotificationMutation.isPending}
          className="mx-auto"
        >
          {sendNotificationMutation.isPending
            ? t("form.sending")
            : t("form.submit")}
        </Button>
      </form>
    </FormProvider>
  );
};

export default NotificationsForm;
