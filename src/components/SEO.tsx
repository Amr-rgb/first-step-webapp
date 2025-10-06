"use client";

import Head from "next/head";
import { useLocale } from "next-intl";
import StructuredData from "./StructuredData";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  structuredDataType?: "Organization" | "WebSite" | "LocalBusiness" | "Service";
  customStructuredData?: any;
  noindex?: boolean;
  canonical?: string;
}

export default function SEO({
  title,
  description,
  keywords = [],
  image = "/assets/logos/complete_logo.svg",
  url,
  type = "website",
  structuredDataType = "Organization",
  customStructuredData,
  noindex = false,
  canonical,
}: SEOProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const siteName = isRTL ? "الخطوة الأولى" : "First Step";
  const defaultTitle = isRTL
    ? "الخطوة الأولى - منصة رعاية الأطفال الذكية"
    : "First Step - Smart Childcare Platform";
  const defaultDescription = isRTL
    ? "منصة رعاية الأطفال الذكية التي تربط العائلات بحضانات ومراكز رعاية الأطفال الموثوقة في السعودية"
    : "Connect with trusted nurseries and childcare centers in Saudi Arabia. Smart childcare solutions for every family.";

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullUrl = url ? `https://firststep.com${url}` : "https://firststep.com";
  const canonicalUrl = canonical
    ? `https://firststep.com${canonical}`
    : fullUrl;

  const defaultKeywords = isRTL
    ? [
        "رعاية الأطفال",
        "حضانة",
        "السعودية",
        "رعاية نهارية",
        "مركز رعاية الأطفال",
        "روضة أطفال",
        "مرحلة ما قبل المدرسة",
        "رعاية الرضع",
        "تطور الطفل",
        "خدمات الأسرة",
      ]
    : [
        "childcare",
        "nursery",
        "Saudi Arabia",
        "daycare",
        "childcare center",
        "kindergarten",
        "preschool",
        "baby care",
        "child development",
        "family services",
      ];

  const allKeywords = [...defaultKeywords, ...keywords];

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={fullDescription} />
        <meta name="keywords" content={allKeywords.join(", ")} />
        <meta name="author" content="First Step Team" />
        <meta
          name="robots"
          content={noindex ? "noindex,nofollow" : "index,follow"}
        />
        <meta
          name="googlebot"
          content={noindex ? "noindex,nofollow" : "index,follow"}
        />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Language and Direction */}
        <meta httpEquiv="content-language" content={locale} />
        <meta name="language" content={locale} />
        <meta name="geo.region" content="SA" />
        <meta name="geo.country" content="Saudi Arabia" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={fullDescription} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:image" content={`https://firststep.com${image}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={fullTitle} />
        <meta
          property="og:locale"
          content={locale === "ar" ? "ar_SA" : "en_US"}
        />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={fullDescription} />
        <meta name="twitter:image" content={`https://firststep.com${image}`} />
        <meta name="twitter:image:alt" content={fullTitle} />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#2b3990" />
        <meta name="msapplication-TileColor" content="#2b3990" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={siteName} />

        {/* Structured Data */}
        <StructuredData
          type={structuredDataType}
          customData={customStructuredData}
        />
      </Head>
    </>
  );
}
