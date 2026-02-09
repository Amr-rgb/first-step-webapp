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

  // Use non-www as the canonical domain
  const baseUrl = "https://firststep-app.com";

  // Remove the locale from the start of the pathname to get the route
  // e.g. /en/about -> /about or /ar/services -> /services
  const route = pathname.replace(`/${locale}`, "") || "";

  // Ensure route doesn't have double slashes
  const cleanRoute = route.startsWith("/") ? route : `/${route}`;
  const fullPath = cleanRoute === "/" ? "" : cleanRoute;

  return {
    title: {
      default: "First Step - Smart Childcare Platform | Find Trusted Nurseries in Saudi Arabia",
      template: "%s | First Step",
    },
    description: "Connect with trusted nurseries and childcare centers in Saudi Arabia. Smart childcare solutions for every family. Browse centers, compare plans, and book easily.",
    keywords: [
      "childcare", "nursery", "Saudi Arabia", "daycare", "childcare center",
      "kindergarten", "preschool", "baby care", "child development",
      "family services", "early childhood education", "parenting",
      "childcare booking", "nursery finder", "childcare platform",
    ],
    authors: [{ name: "First Step Team" }],
    creator: "First Step",
    publisher: "First Step",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}${fullPath}`,
      languages: {
        en: `/en${fullPath}`,
        ar: `/ar${fullPath}`,
        "x-default": `/ar${fullPath}`, // Default to Arabic for Saudi Arabia
      },
    },
    openGraph: {
      title: "First Step - Smart Childcare Platform",
      description: "Connect with trusted nurseries and childcare centers in Saudi Arabia. Smart childcare solutions for every family.",
      url: baseUrl,
      siteName: "First Step",
      images: [
        {
          url: "/assets/logos/complete_logo.svg",
          width: 1200,
          height: 630,
          alt: "First Step - Smart Childcare Platform",
        },
      ],
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "First Step - Smart Childcare Platform",
      description: "Connect with trusted nurseries and childcare centers in Saudi Arabia.",
      images: ["/assets/logos/complete_logo.svg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code", // Replace with actual verification code
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
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${tajawal.className} min-h-screen flex flex-col antialiased`} suppressHydrationWarning>
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
      </body>
    </html>
  );
}
