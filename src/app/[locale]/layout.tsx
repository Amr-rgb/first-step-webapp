import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Tajawal } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "../providers";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { getMessages } from "next-intl/server";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FacebookPixel from "@/components/FacebookPixel";
import TikTokPixel from "@/components/TikTokPixel";
import SnapPixel from "@/components/SnapPixel";
import CookieSync from "@/components/auth/CookieSync";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const baseUrl = "https://firststep-app.com";

  // Remove the locale from the start of the pathname to get the route
  // e.g. /en/about -> /about
  const route = pathname.replace(`/${locale}`, "") || "";

  return {
    alternates: {
      languages: {
        en: `${baseUrl}/en${route}`,
        ar: `${baseUrl}/ar${route}`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <>
      <Suspense fallback={null}>
        <GoogleAnalytics />
        <FacebookPixel />
        <TikTokPixel />
        <SnapPixel />
      </Suspense>
      <NextIntlClientProvider messages={messages}>
        <Suspense fallback={null}>
          <CookieSync />
        </Suspense>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" />
      </NextIntlClientProvider>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
    </>
  );
}
