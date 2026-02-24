import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Icons } from "../icons";
import { Blog } from "@/types";
import { Clock } from "lucide-react";

const BlogCard = ({ blog }: { blog: Blog }) => {
  const locale = useLocale();
  const t = useTranslations("blog");

  return (
    <Link
      href={`/blog/${blog.id}`}
      className="bg-white shadow-card p-2 pb-4 flex flex-col items-start gap-y-2 rounded-2xl text-left rtl:text-right hover:shadow-sm transition-shadow duration-300 cursor-pointer w-full"
    >
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

      <p className="text-primary font-bold">
        {typeof blog.title === "string" ? blog.title : blog.title?.[locale]}
      </p>

      <p className="text-gray text-sm line-clamp-3">
        {typeof blog.description === "string"
          ? blog.description
          : blog.description?.[locale]}
      </p>

      <div className="mt-auto w-full flex items-end justify-between text-sm">
        <div className="flex items-center gap-x-0.5">
          <Icons.calendar className="fill-gray text-gray size-4" />
          <span className="font-medium text-gray">
            {new Date(blog.published_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-0.5">
            <Clock className="text-info size-4" />
            <span className="text-info font-medium text-sm">
              {blog.reading_time} {t("minutes")}
            </span>
          </div>

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
      </div>
    </Link>
  );
};

export default BlogCard;
