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
      params.locale === "ar" ? "First Step | المراكز" : "First Step | Centers",
    description:
      params.locale === "ar"
        ? "اكتشف أفضل المراكز في المملكة العربية السعودية عبر منصة First Step."
        : "Discover the best centers in Saudi Arabia through First Step platform.",
  };
}

export default async function CentersPage({
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
    const [nurseriesData, couponsResponse] = await Promise.all([
      nurseryService.getNurseries(locale),
      promocodeWebsiteService.getPromocodes(),
    ]);
    // Only show nursery with ID 68
    nurseries = (nurseriesData as any[]).filter(
      (nursery: any) => Number(nursery.id) === 68
    );
    if (couponsResponse.success) {
      coupons = couponsResponse.data;
    }
  } catch (err: any) {
    // Log error for debugging
    console.error("Error fetching data:", err);
    error = err;
  }

  return (
    <div>
      {coupons.length > 0 && <CouponSlider coupons={coupons} />}
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
