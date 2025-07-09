"use client";

import { use } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminBlogRequestFormData } from "@/lib/schemas";
import { adminService } from "@/services/dashboardApi";
import AdminBlogForm from "@/components/forms/dashboard/blog/AdminBlogForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function BlogEdit({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const t = useTranslations("dashboard.admin.blog.edit");
  const { blogId } = use(params);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => adminService.getBlog(blogId),
    enabled: !!blogId,
  });

  const mutation = useMutation({
    mutationFn: async (payload: Partial<AdminBlogRequestFormData>) => {
      await adminService.updateBlog(blogId, {
        titleAr: payload.title?.ar,
        titleEn: payload.title?.en,
        descriptionAr: payload.description?.ar,
        descriptionEn: payload.description?.en,
        contentAr: payload.content?.ar,
        contentEn: payload.content?.en,
        mainImage: payload.mainImage?.[0] as File,
        cardImage: payload.cardImage?.[0] as File,
      });
    },
    onSuccess: () => {
      toast(t("success"));
      refetch();
    },
    onError: () => {
      toast(t("error"));
    },
  });

  const router = useRouter();

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("fetchError")}</div>;
  if (!data) return null;

  // Map API response to AdminBlogRequestFormData
  const initialValues: AdminBlogRequestFormData = {
    title: data.title,
    description: data.description,
    content: data.content,
    mainImage: data.file,
    cardImage: data.image,
  };

  // Handler to collect dirty fields and only send those
  const handleSubmit = (data: AdminBlogRequestFormData, dirtyFields: any) => {
    const payload: Partial<AdminBlogRequestFormData> = {};
    payload.title = {
      ar: dirtyFields.title?.ar ? data.title.ar : initialValues.title.ar,
      en: dirtyFields.title?.en ? data.title.en : initialValues.title.en,
    };
    payload.description = {
      ar: dirtyFields.description?.ar
        ? data.description.ar
        : initialValues.description.ar,
      en: dirtyFields.description?.en
        ? data.description.en
        : initialValues.description.en,
    };
    payload.content = {
      ar: dirtyFields.content?.ar ? data.content.ar : initialValues.content.ar,
      en: dirtyFields.content?.en ? data.content.en : initialValues.content.en,
    };
    if (dirtyFields.mainImage) payload.mainImage = data.mainImage;
    if (dirtyFields.cardImage) payload.cardImage = data.cardImage;
    mutation.mutate(payload);
  };

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="heading-4 font-bold text-primary max-w-[39.75rem] mx-auto">
          {t("title")}
        </h1>
      </div>
      <AdminBlogForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        onCancel={() => router.back()}
      />
    </div>
  );
}
