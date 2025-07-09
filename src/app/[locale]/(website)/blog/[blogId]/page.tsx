import { RelatedBlogs } from "@/components/blog/RelatedBlogs";
import { blogService } from "@/services/api";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

// export const revalidate = 86400;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string; blogId: string }>;
}) {
  const { locale, blogId } = await params;
  const t = await getTranslations("blog");

  const blog = await blogService.getBlogById(blogId, locale);

  return (
    <div className="mb-9">
      <div className="relative w-full aspect-[1440/610]">
        <Image
          className="object-cover object-center"
          src={blog.file}
          alt={blog.title?.[locale] || "Blog Image"}
          fill
          priority
        />
        <div className="absolute scale-105 -bottom-0.5 -left-0.5 w-full  overflow-hidden">
          <Image
            src="/assets/illustrations/wave.svg"
            alt="Wave decoration"
            width={1440}
            height={610}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mt-9 container px-4 mx-auto flex flex-col gap-6 lg:flex-row xl:gap-12 2xl:gap-14.5">
        <div className="flex-[3]">
          <div className="prose prose-lg mx-auto">
            <div className="mb-8">
              <h1 className="mb-1.5 text-3xl capitalize font-normal">
                {typeof blog.title === "string"
                  ? blog.title
                  : blog.title?.[locale]}
              </h1>

              <p className="!my-0 text-mid-gray">
                <span>
                  {new Date(blog.published_at).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>{" "}
                —{" "}
                <span>
                  {blog.reading_time} {t("minutes")}
                </span>
              </p>
            </div>

            <div
              className="prose prose-lg mx-auto"
              dangerouslySetInnerHTML={{ __html: blog.content?.[locale] }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h4 className="text-primary">{t("relatedBlogs")}</h4>
          <RelatedBlogs locale={locale} currentBlogId={blogId} />
        </div>
      </div>
    </div>
  );
}
