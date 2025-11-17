import { blogService } from "@/services/api";
import Blogs from "./Blogs";

const BlogsWrapper = async ({
  locale,
  number,
}: {
  locale: string;
  number?: number;
}) => {
  let blogs: any = [];
  let error = null;

  try {
    blogs = await blogService.getBlogs(locale);
  } catch (err: any) {
    console.error("Error fetching blogs in BlogsWrapper:", err);
    error = err;
  }

  const latestBlogs = blogs
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, number);

  return (
    <Blogs blogs={number ? latestBlogs : blogs} error={error} locale={locale} />
  );
};

export default BlogsWrapper;
