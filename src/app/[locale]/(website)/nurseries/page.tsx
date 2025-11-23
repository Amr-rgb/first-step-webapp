import { Metadata } from "next";
// import { AdSlide } from "@/types";
// import Advertisment from "@/components/general/Advertisment";
import BlogsWrapper from "@/components/general/blog/BlogsWrapper";
import Contact from "@/components/general/contact/Contact";
import Nurseries from "@/components/general/nurseries/Nurseries";
import { nurseryService } from "@/services/api";
import { websiteService as promocodeWebsiteService } from "@/services/promocodeService";
import CouponSlider from "@/components/general/nurseries/CouponSlider";

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

  let nurseries: any[] = [];
  let coupons: any[] = [];
  let error = null;

  try {
    const [nurseriesData] = await Promise.all([
      nurseryService.getNurseries(locale),
      // promocodeWebsiteService.getPromocodes(),
    ]);
    nurseries = nurseriesData;
    // if (couponsResponse.success) {
    //   coupons = couponsResponse.data;
    // }
  } catch (err: any) {
    // Log error for debugging
    console.error("Error fetching data:", err);
    error = err;
  }

  return (
    <div>
      <CouponSlider coupons={coupons} />
      <Nurseries
        nurseries={nurseries}
        query={query}
        filter={filter}
        locale={locale}
        error={error}
      />
      <BlogsWrapper number={4} locale={locale} />
      <Contact />
    </div>
  );
}
