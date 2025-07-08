import Image from "next/image";
import { Icons } from "../icons";
import { Blog } from "@/types";

const BlogCard = ({
  blog,
  locale = "ar",
}: {
  blog: Blog;
  locale?: "ar" | "en";
}) => {
  return (
    <div className="bg-white shadow-card min-w-60 p-2 pb-4 flex flex-col items-start gap-y-2 rounded-2xl text-left rtl:text-right">
      <div className="w-full h-40 rounded-xl overflow-hidden relative">
        <Image
          className="object-cover object-center"
          src={blog.image}
          alt=""
          fill
        />
      </div>

      <span className="text-primary font-bold">{blog.title[locale]}</span>

      <p className="text-gray text-sm line-clamp-3">
        {blog.description[locale]}
      </p>

      <div className="w-full flex items-end justify-between text-sm">
        <div className="flex flex-col gap-y-2">
          <span className="text-secondary-orange font-medium text-sm">
            مدة القراءة 3 دقائق
          </span>

          {blog.author && (
            <div className="flex items-center gap-x-1">
              <div className="w-3 h-3 rounded-full overflow-hidden relative">
                <Image
                  className="object-cover object-center"
                  src="https://images.unsplash.com/photo-1716908932235-d865878b12a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                  fill
                />
              </div>
              <span>د. محمود الحسيني</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-0.5">
          <Icons.calendar className="fill-gray" width={12} height={12} />
          <span className="font-medium">{blog.published_at}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
