import { Metadata } from "next";
import AllBlogs from "@/components/general/blog/AllBlogs";
import Contact from "@/components/general/contact/Contact";
import { blogService } from "@/services/api";
import Image from "next/image";

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
        ? "مدونة First Step | كل ما يهمك عن الحضانات والتربية والرعاية وتأهيل ذوي الاحتياجات الخاصة"
        : "First Step Blog | Everything About Nurseries, Education, Care, and Special Needs Support",
    description:
      params.locale === "ar"
        ? "اقرئي مقالاتنا حول تربية الأطفال، اختيار الحضانة المناسبة، ودعم ذوي الاحتياجات الخاصة. محتوى موثوق من First Step يساعدك في اتخاذ قرارات واعية لطفلك."
        : "Read our articles about child-rearing, choosing the right nursery, and supporting children with special needs. Trusted content from First Step helps you make informed decisions for your child.",
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const blogs = await blogService.getBlogs(locale);

  return (
    <div>
      <Image
        src="/assets/backgrounds/blog-bg.png"
        alt="Blog Header"
        width={1440}
        height={750}
        className="w-full h-full max-h-[750px] object-cover"
      />
      <AllBlogs blogs={blogs} />
      <Contact />
    </div>
  );
}
