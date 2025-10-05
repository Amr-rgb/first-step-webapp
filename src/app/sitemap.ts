import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://firststep.com";

  // Static routes
  const staticRoutes = [
    "",
    "/services",
    "/nurseries",
    "/about",
    "/contact",
    "/blog",
    "/sign-up/center",
    "/sign-up/parent",
    "/privacy-policy",
    "/terms-of-service",
  ];

  // Generate sitemap entries for each locale
  const sitemap: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      const url = route === "" ? `/${locale}` : `/${locale}${route}`;

      sitemap.push({
        url: `${baseUrl}${url}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route === "" ? "" : route}`,
            ar: `${baseUrl}/ar${route === "" ? "" : route}`,
          },
        },
      });
    });
  });

  // Add specific nursery pages (if you have dynamic nursery routes)
  // This would need to be updated based on your actual nursery data
  const nurseryNames = [
    "al-noor-nursery",
    "little-angels-nursery",
    "sunshine-kids",
    "happy-hearts",
    "bright-futures",
    "tiny-tots",
    "little-explorers",
    "childhood-wonders",
  ];

  routing.locales.forEach((locale) => {
    nurseryNames.forEach((nurseryName) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/nurseries/${nurseryName}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/nurseries/${nurseryName}`,
            ar: `${baseUrl}/ar/nurseries/${nurseryName}`,
          },
        },
      });
    });
  });

  return sitemap;
}
