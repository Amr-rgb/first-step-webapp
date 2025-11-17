"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import BlogCard from "./BlogCard";
import { Blog } from "@/types";
import { Link } from "@/i18n/navigation";

const Blogs = ({
  blogs,
  error,
  locale,
}: {
  blogs: Blog[];
  error?: any;
  locale: string;
}) => {
  const t = useTranslations("blogsection");

  return (
    <section className="mt-40 my-20 relative overflow-hidden md:overflow-visible">
      <div
        className="-z-50 absolute inset-0 bg-center bg-cover scale-130 2xl:bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(/assets/backgrounds/bubbles-bg.svg)` }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center flex flex-col items-center gap-y-6">
          <div className="space-y-4">
            <h2 className="text-primary">
              <span>{t("title.line1")}</span>
              <span className="block">{t("title.line2")}</span>
            </h2>

            <span className="text-gray">{t("subtitle")}</span>
          </div>

          {/* Error State */}
          {error && (
            <div className="py-8 text-center">
              <p className="text-gray-600">
                {locale === "ar"
                  ? "لا يمكن تحميل المقالات حالياً"
                  : "Unable to load blogs at the moment"}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!error && blogs.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-600">
                {locale === "ar"
                  ? "لا توجد مقالات متاحة حالياً"
                  : "No blogs available at the moment"}
              </p>
            </div>
          )}

          {/* Blogs Grid */}
          {!error && blogs.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              <Button asChild size={"sm"}>
                <Link href={`/blog`}>{t("button")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
