import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://firststep-app.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/admin/",
        "/api/",
        "/_next/",
        "/tempTestFile",
        "/testtepfile",
      ],
      // crawlDelay: 1, // Optional: Add if you want to slow down crawlers
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
