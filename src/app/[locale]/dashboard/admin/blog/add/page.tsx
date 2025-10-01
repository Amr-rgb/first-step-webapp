"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { useRouter } from "next/navigation";
import AdminBlogForm from "@/components/forms/dashboard/blog/AdminBlogForm";
import { adminService } from "@/services/dashboardApi";
import { toastSuccess, toastError } from "@/lib/toast";
import { AdminBlogRequestFormData } from "@/lib/schemas";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminBlogAddPage() {
  const meta = usePageMetadata();

  const t = useTranslations("dashboard.admin.blog.add");
  const router = useRouter();
  const queryClient = useQueryClient();

  const createBlogMutation = useMutation({
    mutationFn: async (data: AdminBlogRequestFormData) => {
      return adminService.createBlog({
        titleAr: data.title.ar,
        titleEn: data.title.en,
        descriptionAr: data.description.ar,
        descriptionEn: data.description.en,
        contentAr: data.content.ar,
        contentEn: data.content.en,
        mainImage: data.mainImage?.[0] as File,
        cardImage: data.cardImage?.[0] as File,
      });
    },
    onSuccess: () => {
      toastSuccess("success");
      // Invalidate the blogs query to refetch the list
      queryClient.refetchQueries({ queryKey: ["adminBlogs"] });
      router.back();
    },
    onError: () => {
      toastError(t("error"));
    },
  });

  const handleSubmit = (data: AdminBlogRequestFormData) => {
    createBlogMutation.mutate(data);
  };

  return (
    <AdminBlogForm
      onSubmit={handleSubmit}
      loading={createBlogMutation.isPending}
    />
  );
}
