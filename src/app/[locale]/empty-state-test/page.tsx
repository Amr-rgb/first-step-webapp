import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Locale, makePageMetadata } from "@/lib/metadata";
import EmptyStateTestClient from "./EmptyStateTestClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return makePageMetadata(locale as Locale, "/empty-state-test");
}

export default function EmptyStateTestPage() {
  return <EmptyStateTestClient />;
}
