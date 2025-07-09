"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminBlogRequestFormData } from "@/lib/schemas";
import { adminService } from "@/services/dashboardApi";
import AdminBlogForm from "@/components/forms/dashboard/blog/AdminBlogForm";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function BlogDetails({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const t = useTranslations("dashboard.admin.blog.details");
  const { blogId } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => adminService.getBlog(blogId),
    enabled: !!blogId,
  });

  const router = useRouter();

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("error")}</div>;
  if (!data) return null;

  // Map API response to AdminBlogRequestFormData
  const initialValues: AdminBlogRequestFormData = {
    title: data.title,
    description: data.description,
    content: data.content,
    mainImage: data.file,
    cardImage: data.image,
  };

  return (
    <AdminBlogForm
      initialValues={initialValues}
      readOnly
      onCancel={() => router.back()}
    />
  );
}
