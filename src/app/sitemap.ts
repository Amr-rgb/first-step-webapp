import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { blogService, nurseryService } from "@/services/api";
import { createSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://firststep-app.com";

  // Static routes
  const staticRoutes = [
    "",
    "/services",
    "/establishments",
    "/our-story",
    "/contact",
    "/blog",
    "/sign-up",
    "/sign-up/center",
    "/sign-up/parent",
    "/sign-in",
    "/forgot-password",
    "/privacy-policy",
    "/terms-conditions",
    "/coupon-codes",
    "/faqs",
  ];

  // Generate sitemap entries for each locale
  const sitemap: MetadataRoute.Sitemap = [];

  // 1. Add static routes
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
            "x-default": `${baseUrl}/ar${route === "" ? "" : route}`,
          },
        },
      });
    });
  });

  // 2. Add dynamic establishment routes (nurseries, centers, etc.)
  try {
    // Fetch nurseries (using 'en' to generate consistent slugs)
    const nurseries = await nurseryService.getNurseries("en");

    nurseries.forEach((nursery) => {
      // Use createSlug to generate the slug from the nursery name
      const slug = createSlug(nursery.nursery_name);
      // Determine establishment type and pluralize for URL
      // Backend returns 'center', 'nursery', etc. - we need 'centers', 'nurseries'
      const typeValue = typeof nursery.type === 'string' ? nursery.type.toLowerCase() : 'nursery';
      const establishmentType = typeValue.endsWith('y')
        ? typeValue.slice(0, -1) + 'ies'  // nursery -> nurseries
        : typeValue + 's';                 // center -> centers

      routing.locales.forEach((locale) => {
        sitemap.push({
          url: `${baseUrl}/${locale}/establishments/${establishmentType}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: {
            languages: {
              en: `${baseUrl}/en/establishments/${establishmentType}/${slug}`,
              ar: `${baseUrl}/ar/establishments/${establishmentType}/${slug}`,
              "x-default": `${baseUrl}/ar/establishments/${establishmentType}/${slug}`,
            },
          },
        });
      });
    });
  } catch (error) {
    console.error("Failed to fetch nurseries for sitemap:", error);
  }

  // 3. Add dynamic blog routes
  try {
    // Fetch blogs
    const blogs = await blogService.getBlogs("en");

    blogs.forEach((blog) => {
      routing.locales.forEach((locale) => {
        sitemap.push({
          url: `${baseUrl}/${locale}/blog/${blog.id}`,
          lastModified: new Date(
            blog.published_at || blog.created_at || new Date()
          ),
          changeFrequency: "weekly",
          priority: 0.6,
          alternates: {
            languages: {
              en: `${baseUrl}/en/blog/${blog.id}`,
              ar: `${baseUrl}/ar/blog/${blog.id}`,
              "x-default": `${baseUrl}/ar/blog/${blog.id}`,
            },
          },
        });
      });
    });
  } catch (error) {
    console.error("Failed to fetch blogs for sitemap:", error);
  }

  return sitemap;
}
