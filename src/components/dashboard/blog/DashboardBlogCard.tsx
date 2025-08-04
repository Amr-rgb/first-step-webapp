import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Icons } from "@/components/general/icons";
import { Blog } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface DashboardBlogCardProps {
  blog: Blog;
  onView?: (blog: Blog) => void;
  onEdit?: (blog: Blog) => void;
}

const DashboardBlogCard = ({ blog, onView, onEdit }: DashboardBlogCardProps) => {
  const locale = useLocale();
  const t = useTranslations("blog");

  return (
    <div className="bg-white shadow-card min-w-60 p-2 pb-4 flex flex-col items-start gap-y-2 rounded-2xl text-left rtl:text-right relative">
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
        
        {/* Absolute positioned action buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          {onView && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
              onClick={() => onView(blog)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
              onClick={() => onEdit(blog)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="text-primary font-bold">
        {typeof blog.title === "string" ? blog.title : blog.title?.[locale]}
      </div>

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

export default DashboardBlogCard;
