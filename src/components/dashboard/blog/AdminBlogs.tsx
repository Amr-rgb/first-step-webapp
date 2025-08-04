"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import DashboardBlogCard from "@/components/dashboard/blog/DashboardBlogCard";
import BlogViewModal from "@/components/dashboard/blog/BlogViewModal";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Blog } from "@/types";

const AdminBlogs = () => {
  const t = useTranslations("dashboard.admin.blog");
  const router = useRouter();
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: adminService.getBlogs,
  });

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("error")}</div>;

  // Extract blogs array from paginated response
  const blogs = data?.data || [];

  // Map blogs to the shape DashboardBlogCard expects
  const mappedBlogs = blogs.map((blog: any) => ({
    ...blog,
    title: blog.title,
    description: blog.description,
    image: blog.image,
    reading_time: blog.reading_time,
    published_at: blog.published_at,
    created_at: blog.created_at,
  }));

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="blog/add">{t("addBlog")}</Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 items-start gap-10">
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
