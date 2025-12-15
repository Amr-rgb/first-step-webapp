"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "@/components/general/blog/BlogCard";
import { getLatestBlogsAction } from "@/actions/blogActions";
import { Blog } from "@/types";
import { useTranslations } from "next-intl";

interface RelatedBlogsProps {
  locale: string;
  currentBlogId: string;
}

export function RelatedBlogs({ locale, currentBlogId }: RelatedBlogsProps) {
  const t = useTranslations("blog");

  // Fetch latest blogs
  const {
    data: latestBlogs,
    isLoading,
    error,
  } = useQuery<Blog[]>({
    queryKey: ["latest-blogs", locale],
    queryFn: () => getLatestBlogsAction(locale),
  });

  // Filter out the current blog from the related blogs
  const relatedBlogs =
    latestBlogs?.filter((blog) => blog.id !== currentBlogId) || [];

  if (isLoading) {
    return (
      <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 items-center gap-5">
        {Array(3)
          .fill(1)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
      </div>
    );
  }

  if (error) {
    console.error("Error loading related blogs:", error);
    return <p className="text-red-500">{t("errorLoadingBlogs")}</p>;
  }

  if (relatedBlogs.length === 0) {
    return <p className="text-gray-500">{t("noRelatedBlogs")}</p>;
  }

  // Show 4 items on large screens, 3 on medium, and 2 on small
  const maxItems =
    typeof window !== "undefined"
      ? window.innerWidth >= 1024
        ? 4
        : window.innerWidth >= 768
        ? 3
        : 2
      : 3;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 items-center gap-5">
      {relatedBlogs.slice(0, maxItems).map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
