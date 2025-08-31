"use client";

import { usePageMetadata } from "@/hooks/usePageMetadata";

import { redirect } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function ParentDashboardHome() {
  const meta = usePageMetadata();

  const locale = useLocale();
  redirect({ href: "/dashboard/parent/children", locale });

  return <div></div>;
}
