import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import ChildrenCards from "@/components/dashboard/children/Children";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "dashboard/admin/children");
}

export default async function Children() {
  return (
    <div>
      <div className="mb-3.5 flex items-center justify-center">
        <h1 className="sr-only heading-4 font-medium text-primary">الأطفال</h1>
      </div>

      <ChildrenCards noEdit />
    </div>
  );
}
