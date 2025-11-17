import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { Blog } from "@/types";
import { useTranslations, useLocale } from "next-intl";
import { Clock } from "lucide-react";

interface AdminBlogCardProps {
  blog: Blog;
  onAccept?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

const AdminBlogCard = ({
  blog,
  onAccept,
  onReject,
  loading,
}: AdminBlogCardProps) => {
  const t = useTranslations("blog");
  const locale = useLocale();

  return (
    <div className="bg-white shadow-card min-w-60 p-2 pb-4 flex flex-col items-start gap-y-2 rounded-2xl text-left rtl:text-right relative hover:shadow-sm transition-shadow duration-300">
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
        </div>
      </div>

      {/* Action buttons for pending blogs */}
      {blog.status === "pending" ||
        (blog.status === "rejected" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 rounded-2xl gap-y-2">
            {onAccept ? (
              <Button
                variant="secondary"
                className="w-40"
                onClick={onAccept}
                disabled={loading}
              >
                {t("acceptBlog")}
              </Button>
            ) : null}
            {onReject ? (
              <Button
                variant="destructive"
                className="w-40"
                onClick={onReject}
                disabled={loading}
              >
                {t("rejectBlog")}
              </Button>
            ) : null}
          </div>
        ))}
    </div>
  );
};

export default AdminBlogCard;
