import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
    },
    sitemap: "https://firststep.com/sitemap.xml",
  };
}
