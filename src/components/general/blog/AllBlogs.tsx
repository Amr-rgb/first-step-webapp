"use client";

import { Blog } from "@/types";
import BlogCard from "./BlogCard";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCw, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const AllBlogs = ({
  blogs,
  error,
  locale,
}: {
  blogs: Blog[];
  error?: any;
  locale: string;
}) => {
  const t = useTranslations("blog");
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <section className="container mx-auto px-4">
      <div className="space-y-6 max-w-[77.5rem] mx-auto">
        {/* header */}
        <div className="space-y-4 text-center">
          <h2 className="heading-3 text-primary text-center">
            <span>{t("blog")}</span>
            <span className="block">First Step</span>
          </h2>

          <p className="text-sm md:text-base text-gray">{t("subtitle")}</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <AlertCircle className="w-16 h-16 text-destructive" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-primary">
                {locale === "ar"
                  ? "حدث خطأ في تحميل المقالات"
                  : "Error Loading Blogs"}
              </h3>
              <p className="text-gray max-w-md">
                {error.isNetworkError
                  ? locale === "ar"
                    ? "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى"
                    : "Please check your internet connection and try again"
                  : error.message ||
                    (locale === "ar"
                      ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى"
                      : "An unexpected error occurred. Please try again")}
              </p>
            </div>
            <Button onClick={handleRetry} className="gap-2">
              <RotateCw className="w-4 h-4" />
              {locale === "ar" ? "إعادة المحاولة" : "Retry"}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!error && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <p className="text-gray text-lg">
              {locale === "ar"
                ? "لا توجد مقالات متاحة حالياً"
                : "No blogs available at the moment"}
            </p>
          </div>
        )}

        {/* blogs */}
        {!error && blogs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllBlogs;
