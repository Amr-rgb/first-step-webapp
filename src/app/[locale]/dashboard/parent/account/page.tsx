"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useLocale, useTranslations } from "next-intl";
import { useAuthUser, useAuthStore } from "@/store/authStore";
import { parentService } from "@/services/dashboardApi";
import EditProfile from "@/components/dashboard/EditProfile";
import { createParentProfileSchema, ParentProfileForm } from "@/lib/schemas";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ParentEditProfilePage() {
  const meta = usePageMetadata();

  const t = useTranslations("dashboard.account");
  const locale = useLocale() as "ar" | "en";
  const user = useAuthUser();
  const queryClient = useQueryClient();

  // ✅ Fetch parent profile data
  const { data: parentData, isLoading } = useQuery({
    queryKey: ["parentData", user?.id],
    queryFn: () => parentService.getUserData(),
    enabled: !!user,
  });

  // ✅ Mutation for update
  const updateProfileMutation = useMutation({
    mutationFn: (payload: ParentProfileForm) =>
      parentService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["parentData"] });

      useAuthStore.getState().updateUser({
        name: updatedUser.parent.name,
        email: updatedUser.parent.email,
        national_number: updatedUser.parent.national_number,
      });
    },
    onError: (err) => {
      console.error("Update failed", err);
    },
  });

  const handleSave = async (formData: ParentProfileForm) => {
    const payload = {
      ...formData,
    };
    await updateProfileMutation.mutateAsync(payload);
  };

  const parentSchema = createParentProfileSchema(locale);

  const parentProfileFields = [
    {
      key: "name",
      label: t("fields.parentName"),
      type: "text",
      placeholder: t("placeholders.parentName"),
      required: true,
    },
    {
      key: "email",
      label: t("fields.email"),
      type: "email",
      placeholder: t("placeholders.email"),
      required: true,
    },
    {
      key: "phone",
      label: t("fields.phone"),
      type: "tel",
      placeholder: t("placeholders.phone"),
      required: true,
    },
    {
      key: "national_number",
      label: t("fields.nationalNumber"),
      type: "text",
      placeholder: t("placeholders.nationalNumber"),
      required: true,
    },
  ];

  if (!user || isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <EditProfile
        title={t("titles.editParentAccount")}
        fields={parentProfileFields}
        onSave={handleSave}
        initialData={parentData.data}
        schema={parentSchema}
      />
    </div>
  );
}
