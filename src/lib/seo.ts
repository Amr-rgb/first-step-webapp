import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    images: string[];
    locale: string;
    type: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
  robots: string;
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
  };
}

export const defaultSEOConfig: SEOConfig = {
  title:
    "First Step - Smart Childcare Platform | Find Trusted Nurseries in Saudi Arabia",
  description:
    "Connect with trusted nurseries and childcare centers in Saudi Arabia. Smart childcare solutions for every family. Browse centers, compare plans, and book easily.",
  keywords: [
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
    "early childhood education",
    "parenting",
    "childcare booking",
    "nursery finder",
    "childcare platform",
  ],
  openGraph: {
    title: "First Step - Smart Childcare Platform",
    description:
      "Connect with trusted nurseries and childcare centers in Saudi Arabia. Smart childcare solutions for every family.",
    images: ["/assets/logos/complete_logo.svg"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First Step - Smart Childcare Platform",
    description:
      "Connect with trusted nurseries and childcare centers in Saudi Arabia.",
    images: ["/assets/logos/complete_logo.svg"],
  },
  robots: "index, follow",
};

export const arabicSEOConfig: SEOConfig = {
  title:
    "الخطوة الأولى - منصة رعاية الأطفال الذكية | العثور على حضانات موثوقة في السعودية",
  description:
    "تواصل مع حضانات ومراكز رعاية الأطفال الموثوقة في السعودية. حلول رعاية الأطفال الذكية لكل عائلة. تصفح المراكز، قارن الخطط، واحجز بسهولة.",
  keywords: [
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
    "التعليم في مرحلة الطفولة المبكرة",
    "الأبوة والأمومة",
    "حجز رعاية الأطفال",
    "البحث عن حضانة",
    "منصة رعاية الأطفال",
  ],
  openGraph: {
    title: "الخطوة الأولى - منصة رعاية الأطفال الذكية",
    description:
      "تواصل مع حضانات ومراكز رعاية الأطفال الموثوقة في السعودية. حلول رعاية الأطفال الذكية لكل عائلة.",
    images: ["/assets/logos/complete_logo.svg"],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "الخطوة الأولى - منصة رعاية الأطفال الذكية",
    description: "تواصل مع حضانات ومراكز رعاية الأطفال الموثوقة في السعودية.",
    images: ["/assets/logos/complete_logo.svg"],
  },
  robots: "index, follow",
};

export function generateMetadata(
  locale: string,
  customTitle?: string,
  customDescription?: string,
  customKeywords?: string[]
): Metadata {
  const config = locale === "ar" ? arabicSEOConfig : defaultSEOConfig;

  return {
    title: customTitle || config.title,
    description: customDescription || config.description,
    keywords: customKeywords || config.keywords,
    openGraph: {
      ...config.openGraph,
      title: customTitle || config.openGraph.title,
      description: customDescription || config.openGraph.description,
    },
    twitter: {
      ...config.twitter,
      title: customTitle || config.twitter.title,
      description: customDescription || config.twitter.description,
    },
    robots: config.robots,
    alternates: {
      canonical: `https://firststep.com/${locale}`,
      languages: {
        en: "https://firststep.com/en",
        ar: "https://firststep.com/ar",
      },
    },
    other: {
      "geo.region": "SA",
      "geo.country": "Saudi Arabia",
      "geo.placename": "Saudi Arabia",
      ICBM: "24.7136, 46.6753",
      "DC.title": customTitle || config.title,
      "DC.description": customDescription || config.description,
      "DC.language": locale,
      "DC.coverage": "Saudi Arabia",
      "DC.subject": "Childcare, Nursery, Early Childhood Education",
    },
  };
}
