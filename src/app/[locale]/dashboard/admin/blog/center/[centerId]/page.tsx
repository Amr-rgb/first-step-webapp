"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/dashboardApi";
import AdminBlogCard from "@/components/general/blog/AdminBlogCard";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function CenterBlogsPage({
  params,
}: {
  params: Promise<{ centerId: string }>;
}) {
  const t = useTranslations("dashboard.admin.blog.center");
  const { centerId } = use(params);
  const queryClient = useQueryClient();
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["centerBlogs", centerId],
    queryFn: () => adminService.getOneCenterBlogs(centerId),
  });

  const { mutate: approveBlog, isPending: isApproving } = useMutation({
    mutationFn: (blogId: string) => adminService.approveCenterBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centerBlogs", centerId] });
      toast.success(t("blogApproved"));
    },
    onError: (error) => {
      console.error("Error approving blog:", error);
      toast.error(t("approvalError"));
    },
  });

  const { mutate: rejectBlog, isPending: isRejecting } = useMutation({
    mutationFn: (blogId: string) => adminService.rejectCenterBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centerBlogs", centerId] });
      toast.success(t("blogRejected"));
    },
    onError: (error) => {
      console.error("Error rejecting blog:", error);
      toast.error(t("rejectionError"));
    },
  });

  const handleAccept = (blogId: string) => {
    approveBlog(blogId);
  };

  const handleReject = (blogId: string) => {
    if (confirm(t("confirmReject"))) {
      rejectBlog(blogId);
    }
  };

  const isLoadingAction = isApproving || isRejecting;

  if (isLoading) return <div>{t("loading")}</div>;
  if (error) return <div className="text-red-500">{t("error")}</div>;

  // Helper to map backend blog to AdminBlogCard props
  const mapBlogToCard = (blog: any) => ({
    id: blog.id,
    title: blog.title || t("noTitle"),
    description: blog.description,
    image: blog.blog_image_url,
    published_at: blog.created_at.split(" ")[0],
    reading_time: blog.reading_time,
    status: blog.status,
  });

  return (
    <div className="space-y-4">
      <h1 className="heading-4 text-primary font-medium text-center">
        {t("center")}
      </h1>
      <div className="flex flex-col gap-y-12">
        <div className="space-y-4">
          <p className="heading-4 text-primary font-medium">
            {t("pendingBlogs")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs
              .map(mapBlogToCard)
              .filter((blog: any) => blog.status === "pending")
              .map((blog: any) => (
                <AdminBlogCard
                  key={blog.id}
                  blog={blog}
                  onAccept={() => handleAccept(blog.id)}
                  onReject={() => handleReject(blog.id)}
                  loading={isLoadingAction}
                />
              ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="heading-4 text-primary font-medium">
            {t("acceptedBlogs")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs
              .map(mapBlogToCard)
              .filter((blog: any) => blog.status === "approved")
              .map((blog: any) => (
                <AdminBlogCard key={blog.id} blog={blog} />
              ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="heading-4 text-primary font-medium">
            {t("rejectedBlogs")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs
              .map(mapBlogToCard)
              .filter((blog: any) => blog.status === "rejected")
              .map((blog: any) => (
                <AdminBlogCard key={blog.id} blog={blog} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
