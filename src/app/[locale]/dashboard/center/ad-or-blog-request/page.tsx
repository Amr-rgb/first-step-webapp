"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { Button } from "@/components/ui/button";
import Ads from "@/components/dashboard/ad-or-blog-request/Ads";
import DashboardBlogCard from "@/components/dashboard/blog/DashboardBlogCard";
import BlogViewModal from "@/components/dashboard/blog/BlogViewModal";
import { useState, useEffect } from "react";
import { Blog } from "@/types";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { centerService } from "@/services/dashboardApi";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/hooks/usePermissions";
import EmptyState from "@/components/common/EmptyState";
import { toastError } from "@/lib/toast";

const BlogCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-[264/160] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

const BlogsSection = () => {
  const [selectedBlogId, setSelectedBlogId] = useState<string | number | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("dashboard.center.ad-or-blog-request");

  const queryClient = useQueryClient();

  const {
    data: blogsData,
    error,
    refetch,
    isLoading,
  } = useQuery<Blog[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await centerService.getBlogs();
      return response.data.map((blog: any) => ({
        id: blog.id,
        title: blog.title,
        description: blog.description,
        image: blog.blog_image_url,
        coverImage: blog.cover_url,
        reading_time: blog.reading_time,
        created_at: blog.created_at.split("T")[0],
        published_at: blog.created_at.split("T")[0],
      }));
    },
  });

  const selectedBlog = selectedBlogId
    ? blogsData?.find((blog) => blog.id === selectedBlogId) || null
    : null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="heading-4 font-medium text-primary">{t("blogs")}</h1>

        <Button asChild size={"sm"} variant={"outline"}>
          <Link href="ad-or-blog-request/blog-request">
            {t("request-blog")}
          </Link>
        </Button>
      </div>

      {!isLoading && !error && (!blogsData || blogsData.length === 0) ? (
        <EmptyState
          icon="📝"
          size="lg"
          primaryAction={{
            label: t("request-blog"),
            onClick: () => {
              router.push("/dashboard/center/ad-or-blog-request/blog-request");
            },
          }}
          translationKey="dashboard.emptyStates.blogs"
        />
      ) : (
        <div className="grid md:grid-cols-3 items-start gap-10">
          {blogsData
            ? blogsData?.map((blog) => (
                <DashboardBlogCard
                  key={blog.id}
                  blog={blog}
                  onView={() => {
                    setSelectedBlogId(blog.id);
                    setViewModalOpen(true);
                  }}
                  onEdit={() => {
                    queryClient.refetchQueries({
                      queryKey: ["blogs", blog.id],
                    });
                    router.push(
                      `/dashboard/center/ad-or-blog-request/edit-blog/${blog.id}`
                    );
                  }}
                />
              ))
            : null}

          {isLoading ? (
            <>
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </>
          ) : null}

          {error ? (
            <div className="col-span-3 flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-destructive">
                  {t("blog.form.error.title")}
                </h3>
                <p className="text-sm text-mid-gray">
                  {t("blog.form.error.description")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                {t("blog.form.error.retry")}
              </Button>
            </div>
          ) : null}
        </div>
      )}

      <BlogViewModal
        blog={selectedBlog}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
        }}
      />
    </div>
  );
};

const AdsSection = () => {
  const t = useTranslations("dashboard.center.ad-or-blog-request");

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="heading-4 font-medium text-primary">{t("title")}</h1>

        <Button asChild size={"sm"} variant={"outline"}>
          <Link href="ad-or-blog-request/ad-request">{t("request-ad")}</Link>
        </Button>
      </div>

      <div className="mt-6">
        <Ads />
      </div>
    </div>
  );
};

export default function CenterDashboardRequest() {
  const meta = usePageMetadata();
  const router = useRouter();
  const t = useTranslations("dashboard.center.ad-or-blog-request");
  const { can } = usePermissions();
  const canViewtAd = can("view", "advertisements");
  const canViewtBlog = can("view", "blogs");

  useEffect(() => {
    if (!canViewtAd && !canViewtBlog) {
      toastError(t("permissionError"));
      router.push("/dashboard/center");
    }
  }, [canViewtAd, canViewtBlog, router, t]);

  if (!canViewtAd && !canViewtBlog) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-10">
      {canViewtAd && <AdsSection />}
      {canViewtBlog && <BlogsSection />}
    </div>
  );
}
