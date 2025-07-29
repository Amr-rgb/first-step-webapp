import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Blog } from "@/types";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Icons } from "@/components/general/icons";
import { useQuery } from "@tanstack/react-query";
import { centerService } from "@/services/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogViewModalProps {
  blog: Blog | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogViewModal = ({ blog, isOpen, onClose }: BlogViewModalProps) => {
  const locale = useLocale();
  const t = useTranslations("blog");

  // Only fetch full content if we don't already have all the data we need
  const { data: fullBlog, isLoading: isLoadingContent } = useQuery({
    queryKey: ["blog", blog?.id],
    queryFn: () => centerService.getBlog(blog!.id),
    enabled: isOpen && !!blog?.id && !blog.content, // Only fetch if we don't have content
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Use the blog prop as initial data if available
    initialData: blog?.content ? blog : undefined,
  });

  // Use the full blog data if available, otherwise fall back to the blog prop
  const displayBlog = fullBlog || blog;

  if (!blog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">
            {typeof displayBlog?.title === "string"
              ? displayBlog.title
              : displayBlog?.title?.[locale]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Blog image */}
          <div className="w-full h-64 rounded-xl overflow-hidden relative">
            <Image
              src={displayBlog?.coverImage || displayBlog?.cover_url || null}
              alt={
                typeof displayBlog?.title === "string"
                  ? displayBlog.title
                  : displayBlog?.title?.[locale] || ""
              }
              fill
              className="object-cover"
            />
          </div>

          {/* Blog metadata */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="text-secondary-orange font-medium">
                {displayBlog.reading_time} {t("minutes")}
              </span>

              {displayBlog.author && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: "#E5E5E5" }}
                  />
                  <span>{displayBlog.author}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Icons.calendar className="fill-gray" width={12} height={12} />
              <span className="font-medium">
                {new Date(blog.published_at).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Blog description */}
          <div className="text-gray-700">
            <h3 className="font-semibold mb-2">Description</h3>
            <p>
              {typeof blog.description === "string"
                ? blog.description
                : blog.description?.[locale]}
            </p>
          </div>

          {/* Blog content - loaded separately */}
          <div className="text-gray-700">
            <h3 className="font-semibold mb-2">Content</h3>
            {isLoadingContent ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : fullBlog?.content ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    typeof fullBlog.content === "string"
                      ? fullBlog.content
                      : fullBlog.content?.[locale] || "No content available",
                }}
              />
            ) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogViewModal;
