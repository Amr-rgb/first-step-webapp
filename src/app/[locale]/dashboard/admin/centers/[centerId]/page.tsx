import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import Branches from "@/components/dashboard/branches/Branches";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "dashboard/admin/centers");
}

export default async function CenterBranches({
  params,
}: {
  params: Promise<{ centerId: string }>;
}) {
  const { centerId } = await params;
  const t = await getTranslations("dashboard.admin.center");

  return (
    <div>
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="heading-4 font-medium text-primary">{t("branches")}</h1>
      </div>

      <Branches noEdit baseUrl={centerId} />
    </div>
  );
}
