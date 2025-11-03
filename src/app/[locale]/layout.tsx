import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Tajawal, Noto_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "../providers";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { getMessages } from "next-intl/server";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieSync from "@/components/auth/CookieSync";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

// export const metadata: Metadata = {
//   title: "First Step",
//   description: "Smart childcare for every family.",
// };

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
