import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import BlogRequestForm from "@/components/forms/dashboard/adblog-request/BlogRequest";
import { useTranslations } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(
    locale as Locale,
    "dashboard/center/ad-or-blog-request/blog-request"
  );
}

export default function CenterBlogRequest() {
  const t = useTranslations("dashboard.center.ad-or-blog-request.blog");

  return (
    <div className="p-10 flex flex-col gap-y-4">
      <div className="space-y-2">
        <p className="heading-4 font-medium text-primary">{t("title")}</p>
        <p className="text-info">{t("description")}</p>
      </div>

      <BlogRequestForm />
    </div>
  );
}
