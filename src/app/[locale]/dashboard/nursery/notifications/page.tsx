import { Metadata } from "next";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { getLocale } from "next-intl/server";
import NotificationsForm from "@/components/forms/dashboard/notifications/CenterNotificationsForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "dashboard/nursery/notifications");
}

export default function CenterDashboardNotifications() {
  return (
    <div className="flex flex-col gap-y-10">
      <NotificationsForm />
    </div>
  );
}
