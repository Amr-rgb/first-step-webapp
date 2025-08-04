import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Icons } from "../icons";
import { Blog } from "@/types";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const locale = useLocale();
  const t = useTranslations("blog");

  return (
    <div className="bg-white shadow-card min-w-60 p-2 pb-4 flex flex-col items-start gap-y-2 rounded-2xl text-left rtl:text-right">
      <div className="w-full h-40 rounded-xl overflow-hidden relative">
        <Image
          src={blog.image}
          alt={
            typeof blog.title === "string"
              ? blog.title
              : blog.title?.[locale] || t("blogImageAlt")
          }
          fill
          className="object-cover"
        />
      </div>

      <Link href={`/blog/${blog.id}`} className="text-primary font-bold">
        {typeof blog.title === "string" ? blog.title : blog.title?.[locale]}
      </Link>

      <p className="text-gray text-sm line-clamp-3">
        {typeof blog.description === "string"
          ? blog.description
          : blog.description?.[locale]}
      </p>

      <div className="w-full flex items-end justify-between text-sm">
        <div className="flex flex-col gap-y-2">
          <span className="text-secondary-orange font-medium text-sm">
            {blog.reading_time} {t("minutes")}
          </span>

          {blog.author && (
            <div className="flex items-center gap-x-1">
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: "#E5E5E5" }}
              />
              <span>{blog.author}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-0.5">
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
    </div>
  );
};

export default BlogCard;
