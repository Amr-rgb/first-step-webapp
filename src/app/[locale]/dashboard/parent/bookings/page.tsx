import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Locale, makePageMetadata } from "@/lib/metadata";
import { Bookings } from "@/components/dashboard/parent-bookings/Bookings";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "/dashboard/parent/bookings");
}

export default function ParentBookingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Bookings />
    </div>
  );
}
