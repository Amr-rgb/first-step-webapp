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
    "First Step - Smart Childcare Platform | Find Trusted Nurseries in Saudi Arabia | Choose the right nursery for your child ",
  description:
    "Discover the best and most trusted nurseries and daycares in Saudi Arabia all in one place. First Step helps you choose a child care that provides balanced care and education for your child",
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

    "nursery near me",
    "nursery in riyadh ",
    "special educational needs ",
    "Child development center ",
    "daycare center ",
    "pre school near me",
    "nursery school",
  ],
  openGraph: {
    title: "First Step - Smart Childcare Platform",
    description:
      "Discover the best and most trusted nurseries and daycares in Saudi Arabia all in one place. First Step helps you choose a child care that provides balanced care and education for your child",
    images: ["/assets/logos/complete_logo.svg"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "First Step - Smart Childcare Platform | Choose the right nursery for your child | Find Trusted Nurseries in Saudi Arabia",
    description:
      "Discover the best and most trusted nurseries and daycares in Saudi Arabia all in one place. First Step helps you choose a child care that provides balanced care and education for your child",
    images: ["/assets/logos/complete_logo.svg"],
  },
  robots: "index, follow",
};

export const arabicSEOConfig: SEOConfig = {
  title:
    " ‌‌منصة ‌‌First Step‌‌ اختاري الحضانة المناسبة لطفلك بسهولة في السعودية",
  description:
    "   اكتشفي أفضل الحضانات وروضات الأطفال الموثوقة في السعودية من مكان واحد. First Step تساعدك في اختيار حضانة توفر رعاية وتعليم متوازن لطفلك.",
  keywords: [
    "رعاية الأطفال",
    "حضانه",
    "حضانات في السعودية",
    "رعاية نهارية",
    "مركز رعاية الأطفال",
    "روضة أطفال",
    "مرحلة ما قبل المدرسة",
    " مراكز ذوي احتياجات خاصة",
    "افضل مركز ذوي احتياجات خاصة",
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
    title:
      " ‌‌منصة ‌‌First Step‌‌ اختاري الحضانة المناسبة لطفلك بسهولة في السعودية",
    description:
      "   اكتشفي أفضل الحضانات وروضات الأطفال الموثوقة في السعودية من مكان واحد. First Step تساعدك في اختيار حضانة توفر رعاية وتعليم متوازن لطفلك.",
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
  pathname: string = "",
  customTitle?: string,
  customDescription?: string,
  customKeywords?: string[]
): Metadata {
  const baseUrl = "https://firststep-app.com";
  const config = locale === "ar" ? arabicSEOConfig : defaultSEOConfig;

  // Ensure pathname doesn't have leading locale if it's passed from some places
  // but usually it should be the raw route
  const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/") || "/";
  const route = cleanPath === "/" ? "" : cleanPath;

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
      canonical: `${baseUrl}/${locale}${route}`,
      languages: {
        en: `${baseUrl}/en${route}`,
        ar: `${baseUrl}/ar${route}`,
        "x-default": `${baseUrl}/ar${route}`, // Arabic is the default locale
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
