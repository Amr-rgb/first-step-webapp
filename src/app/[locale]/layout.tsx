import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Tajawal } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "../providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import CookieSync from "@/components/auth/CookieSync";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "First Step",
  description: "Smart childcare for every family.",
};

export default async function RootLayout({
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

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${tajawal.className} min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <NextIntlClientProvider>
          <CookieSync />
          <Providers>{children}</Providers>
          <Toaster />
        </NextIntlClientProvider>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
