"use client";

import { useLocale } from "next-intl";

interface StructuredDataProps {
  type?: "Organization" | "WebSite" | "LocalBusiness" | "Service";
  customData?: any;
}

export default function StructuredData({
  type = "Organization",
  customData,
}: StructuredDataProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const baseOrganizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: isRTL ? "الخطوة الأولى" : "First Step",
    alternateName: isRTL ? "First Step" : "الخطوة الأولى",
    description: isRTL
      ? "منصة رعاية الأطفال الذكية التي تربط العائلات بحضانات ومراكز رعاية الأطفال الموثوقة في السعودية"
      : "Smart childcare platform connecting families with trusted nurseries and childcare centers in Saudi Arabia",
    url: "https://firststep-app.com",
    logo: "https://firststep-app.com/assets/logos/complete_logo.svg",
    image: "https://firststep-app.com/assets/logos/complete_logo.svg",
    foundingDate: "2024",
    founder: {
      "@type": "Organization",
      name: "First Step Team",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressRegion: "Riyadh",
      addressLocality: "Riyadh",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    sameAs: [
      "https://www.facebook.com/firststep",
      "https://www.instagram.com/firststep",
      "https://www.linkedin.com/company/firststep",
      "https://twitter.com/firststep",
    ],
    serviceArea: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isRTL ? "خدمات رعاية الأطفال" : "Childcare Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRTL ? "البحث عن حضانة" : "Nursery Search",
            description: isRTL
              ? "البحث عن حضانات مناسبة في منطقتك"
              : "Find suitable nurseries in your area",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRTL ? "حجز رعاية الأطفال" : "Childcare Booking",
            description: isRTL
              ? "حجز خدمات رعاية الأطفال بسهولة"
              : "Book childcare services easily",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isRTL ? "مقارنة الخطط" : "Plan Comparison",
            description: isRTL
              ? "مقارنة خطط رعاية الأطفال المختلفة"
              : "Compare different childcare plans",
          },
        },
      ],
    },
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: isRTL ? "الخطوة الأولى" : "First Step",
    alternateName: isRTL ? "First Step" : "الخطوة الأولى",
    url: "https://firststep-app.com",
    description: isRTL
      ? "منصة رعاية الأطفال الذكية"
      : "Smart childcare platform",
    inLanguage: [locale],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://firststep-app.com/nurseries?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: isRTL ? "الخطوة الأولى" : "First Step",
    description: isRTL
      ? "منصة رعاية الأطفال الذكية في السعودية"
      : "Smart childcare platform in Saudi Arabia",
    url: "https://firststep-app.com",
    telephone: "+966-XX-XXX-XXXX", // Replace with actual phone number
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressRegion: "Riyadh",
      addressLocality: "Riyadh",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "24.7136",
      longitude: "46.6753",
    },
    openingHours: "Mo-Fr 08:00-18:00",
    priceRange: "$$",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    currenciesAccepted: "SAR",
  };

  let structuredData;

  switch (type) {
    case "WebSite":
      structuredData = websiteData;
      break;
    case "LocalBusiness":
      structuredData = localBusinessData;
      break;
    case "Service":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: isRTL ? "خدمات رعاية الأطفال" : "Childcare Services",
        description: isRTL
          ? "خدمات رعاية الأطفال المتخصصة"
          : "Specialized childcare services",
        provider: baseOrganizationData,
        areaServed: "Saudi Arabia",
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: "https://firststep-app.com",
          serviceSmsNumber: "+966-XX-XXX-XXXX",
        },
      };
      break;
    default:
      structuredData = baseOrganizationData;
  }

  // Merge custom data if provided
  if (customData) {
    structuredData = { ...structuredData, ...customData };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
