import { Metadata } from "next";
import Headline from "@/components/general/Headline";
import VisionMisson from "@/components/general/VisionMission";
import Values from "@/components/general/Values";
import WhyUs from "@/components/general/WhyUs";
import SocialQR from "@/components/general/SocialQR";
import OriginalPreviewVideo from "@/components/general/OriginalPreviewVideo";

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
        ? "قصتنا في First Step | رؤيتنا لتسهيل اختيار الحضانة والمركز التأهيلي في السعودية"
        : "Our Story at First Step | Our Vision for Simplifying Nursery and Rehabilitation Center Selection in Saudi Arabia",
    description:
      params.locale === "ar"
        ? "منصة First Step ولدت من حاجة حقيقية لتسهيل رحلة الأهل في اختيار حضانة أو مركز تأهيلي مناسب. نشاركك هنا القيم التي نؤمن بها، ورسالتنا تجاه كل طفل وأسرة."
        : "First Step platform was born from a real need to simplify parents' journey in choosing a suitable nursery or rehabilitation center. We share here our values and mission towards every child and family.",
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <Headline />
      <OriginalPreviewVideo />
      <VisionMisson />
      <Values locale={locale} />
      <WhyUs locale={locale} />
      <SocialQR />
    </div>
  );
}
