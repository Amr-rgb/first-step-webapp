"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import DashboardBlogCard from "@/components/dashboard/blog/DashboardBlogCard";
import BlogViewModal from "@/components/dashboard/blog/BlogViewModal";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Blog } from "@/types";
import EmptyState from "@/components/common/EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminBlogs = () => {
  const t = useTranslations("dashboard.admin.blog");
  const locale = useLocale();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminBlogs", page],
    queryFn: () => adminService.getBlogs(page),
  });

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("error")}</div>;

  // Extract blogs array from paginated response
  const blogs = data?.data || [];

  // Map blogs to the shape DashboardBlogCard expects
  const mappedBlogs = blogs.map((blog: any) => ({
    ...blog,
    title: typeof blog.title === "object" ? blog.title?.[locale] : blog.title,
    description:
      typeof blog.description === "object"
        ? blog.description?.[locale]
        : blog.description,
    content:
      typeof blog.content === "object" ? blog.content?.[locale] : blog.content,
  }));

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="blog/add">{t("addBlog")}</Link>
        </Button>
      </div>

      {mappedBlogs.length === 0 ? (
        <EmptyState
          icon="📝"
          size="lg"
          primaryAction={{
            label: t("addBlog"),
            onClick: () => {
              router.push("/dashboard/admin/blog/add");
            },
          }}
          translationKey="dashboard.emptyStates.blogs"
        />
      ) : (
        <>
          <div className="grid lg:grid-cols-3 items-start gap-10">
            {mappedBlogs.map((blog: any) => (
              <DashboardBlogCard
                key={blog.id}
                blog={blog}
                onView={() => {
                  setSelectedBlog(blog);
                  setViewModalOpen(true);
                }}
                onEdit={() => router.push(`blog/${blog.id}/edit`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.meta && data.meta.last_page > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                {locale === "ar" ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
              <span className="text-sm font-medium">
                {t("page")} {page} {t("of")} {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === data.meta.last_page}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {locale === "ar" ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </>
      )}

      <BlogViewModal
        blog={selectedBlog}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminBlogs;
