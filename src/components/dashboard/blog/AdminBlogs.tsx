"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import BlogCard from "@/components/general/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Eye, PencilLine } from "lucide-react";
import { useTranslations } from "next-intl";

const AdminBlogs = () => {
  const t = useTranslations("dashboard.admin.blog");
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: adminService.getBlogs,
  });

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("error")}</div>;

  // Extract blogs array from paginated response
  const blogs = data?.data || [];

  // Map blogs to the shape BlogCard expects
  const mappedBlogs = blogs.map((blog: any) => ({
    ...blog,
    title: blog.title?.ar || blog.title?.en || t("noTitle"),
    description: blog.description?.ar || blog.description?.en || "",
    image: blog.image,
    published_at: blog.published_at,
  }));

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="blog/add">{t("addBlog")}</Link>
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {mappedBlogs.map((blog: any) => (
          <div key={blog.id} className="relative group">
            <BlogCard blog={blog} />

            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <Button
                size="icon"
                variant="outline"
                className="rounded-md p-4 text-xs"
                asChild
              >
                <Link href={`blog/${blog.id}/edit`}>
                  <PencilLine />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-md p-4 text-xs"
                asChild
              >
                <Link href={`blog/${blog.id}`}>
                  <Eye />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
