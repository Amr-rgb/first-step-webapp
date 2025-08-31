import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import Reports from "@/components/dashboard/center-reports/Reports";
import { useTranslations } from "next-intl";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "dashboard/center/daily-reports");
}

export default function DailyReports() {
  const t = useTranslations("dashboard.center-reports");

  return (
    <div className="lg:p-4 space-y-1">
      <Reports />

      <div className="mt-4 flex justify-center">
        <Button asChild size={"sm"}>
          <Link href="daily-reports/send">{t("send")}</Link>
        </Button>
      </div>
    </div>
  );
}
