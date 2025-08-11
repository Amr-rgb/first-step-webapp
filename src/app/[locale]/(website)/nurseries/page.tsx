import { Metadata } from "next";
// import { AdSlide } from "@/types";
// import Advertisment from "@/components/general/Advertisment";
import BlogsWrapper from "@/components/general/blog/BlogsWrapper";
import Contact from "@/components/general/contact/Contact";
import Nurseries from "@/components/general/nurseries/Nurseries";
import { nurseryService } from "@/services/api";

export const revalidate = 86400;

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await paramsPromise;
  return {
    title:
      params.locale === "ar"
        ? "First Step دليلك أفضل الحضانات في السعودية | حضانة آمنة ومريحة لطفلك"
        : "First Step Guide to Best Nurseries in Saudi Arabia | Safe and Comfortable Childcare",
    description:
      params.locale === "ar"
        ? "منصة First Step تسهل عليك العثور على حضانة مناسبة لطفلك حسب الموقع، الأسعار، والخدمات. اكتشف أفضل الحضانات في الرياض، جدة، وغيرها من المدن السعودية."
        : "First Step platform makes it easy to find the right nursery for your child based on location, prices, and services. Discover the best nurseries in Riyadh, Jeddah, and other Saudi cities.",
  };
}

export default async function NurseriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const searchParameters = await searchParams;

  const query =
    typeof searchParameters.query === "string" ? searchParameters.query : "";
  const filter =
    typeof searchParameters.filter === "string" ? searchParameters.filter : "";

  // const slides: AdSlide[] = [
  //   {
  //     id: 1,
  //     title: "Nursery 1",
  //     image:
  //       "https://images.unsplash.com/photo-1578349035260-9f3d4042f1f7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     created_at: "",
  //     published_at: "",
  //   },
  //   {
  //     id: 2,
  //     title: "Nursery 2",
  //     image:
  //       "https://images.unsplash.com/photo-1586694680938-9682c9e1f736?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     created_at: "",
  //     published_at: "",
  //   },
  //   {
  //     id: 3,
  //     title: "Nursery 3",
  //     image:
  //       "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     created_at: "",
  //     published_at: "",
  //   },
  // ];

  const nurseries = await nurseryService.getNurseries(locale);

  return (
    <div>
      {/* <Advertisment slides={slides} /> */}
      <Nurseries
        nurseries={nurseries}
        query={query}
        filter={filter}
        locale={locale}
      />
      <BlogsWrapper number={4} locale={locale} />
      <Contact />
    </div>
  );
}
