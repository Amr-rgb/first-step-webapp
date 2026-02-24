"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getCenterBlogsAction } from "@/actions/nurseryActions";
import BlogCard from "@/components/general/blog/BlogCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Blog } from "@/types";

interface BlogsSectionProps {
  centerId: string;
  tNamespace?: string;
}

const BlogsSection = ({ centerId, tNamespace = "nurseryDetails" }: BlogsSectionProps) => {
  const t = useTranslations(`${tNamespace}.blogs` as any);
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["center-blogs", centerId],
    queryFn: () => getCenterBlogsAction(centerId),
    select: (data) => data.filter((blog: any) => blog.status === "approved"),
  });

  if (!isLoading && (!blogs || blogs.length === 0)) return null;

  return (
    <section id="blogs" className="py-0 scroll-mt-20">
      <Carousel
        opts={{
          align: "start",
          direction: isRtl ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="heading-4 font-bold text-primary">{t("title")}</h2>
          </div>

          <div className="flex items-center gap-2">
            <CarouselPrevious
              useChevron
              className="static translate-y-0 translate-x-0 w-6 h-6 border-2 border-secondary-mint-green! text-secondary-mint-green shadow-none disabled:border-light-gray! disabled:text-light-gray"
            />
            <CarouselNext
              useChevron
              className="static translate-y-0 translate-x-0 w-6 h-6 border-2 border-secondary-mint-green! text-secondary-mint-green shadow-none disabled:border-light-gray! disabled:text-light-gray"
            />
          </div>
        </div>

        <div className="bg-white-out p-4 rounded-2xl">
          <CarouselContent className="-ml-4">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-4 basis-full sm:basis-2/3 md:basis-1/2 lg:basis-1/2 transition-all duration-300"
                >
                  <Skeleton className="h-[340px] w-full rounded-2xl" />
                </CarouselItem>
              ))
              : blogs.map((blogData: any) => {
                // Map API response to Blog interface
                const blog: Blog = {
                  id: blogData.id,
                  title: blogData.title || "",
                  description: blogData.description || "",
                  image:
                    blogData.blog_image_url ||
                    blogData.cover_url ||
                    "/assets/images/placeholder.png",
                  reading_time: String(blogData.reading_time || "0"),
                  published_at:
                    blogData.created_at ||
                    blogData.updated_at ||
                    new Date().toISOString(),
                  created_at:
                    blogData.created_at ||
                    blogData.updated_at ||
                    new Date().toISOString(),
                };

                return (
                  <CarouselItem
                    key={blog.id}
                    className="pl-4 basis-full sm:basis-2/3 md:basis-1/2 lg:basis-1/2 transition-all duration-300"
                  >
                    <BlogCard blog={blog} />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
};

export default BlogsSection;
