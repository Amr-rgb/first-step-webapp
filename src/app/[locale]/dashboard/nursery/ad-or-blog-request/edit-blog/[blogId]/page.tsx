"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { centerService } from "@/services/dashboardApi";
import CenterBlogForm from "@/components/forms/dashboard/adblog-request/CenterBlogForm";
import { useTranslations, useLocale } from "next-intl";

export default function CenterBlogEdit({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const meta = usePageMetadata();

  const t = useTranslations("dashboard.center.ad-or-blog-request.blog.edit");
  const locale = useLocale();
  const { blogId } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => centerService.getBlog(blogId),
    enabled: !!blogId,
  });

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("errorLoading")}</div>;
  if (!data) return null;

  // Map API response to form data
  const initialValues = {
    title:
      typeof data.title === "string" ? data.title : data.title?.[locale] || "",
    description:
      typeof data.description === "string"
        ? data.description
        : data.description?.[locale] || "",
    content:
      typeof data.content === "string"
        ? data.content
        : data.content?.[locale] || "",
    mainImageUrl: data.cover_url || data.file,
    cardImageUrl: data.blog_image_url || data.image,
  };

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="heading-4 font-bold text-primary max-w-[39.75rem] mx-auto">
          {t("pageTitle")}
        </h1>
      </div>

      <CenterBlogForm initialValues={initialValues} blogId={blogId} />
    </div>
  );
}
