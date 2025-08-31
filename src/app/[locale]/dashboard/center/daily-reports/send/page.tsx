import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import ReportsForm from "@/components/forms/dashboard/center-reports/ReportsForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(
    locale as Locale,
    "dashboard/center/daily-reports/send"
  );
}

export default function SendDailyReports() {
  return (
    <div className="lg:p-4 space-y-1">
      <ReportsForm />
    </div>
  );
}
