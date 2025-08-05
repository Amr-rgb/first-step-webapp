import { Metadata } from "next";
// import Advertisment from "@/components/general/Advertisment";
import Headline from "@/components/general/Headline";
// import StickyScrollServices from "@/components/general/StickyScrollServices";
import { websiteService } from "@/services/api";
import Services from "@/components/general/Services";

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
        ? "خدمات First Step | خيارات موثوقة للحضانات والمراكز التأهيلية في السعودية"
        : "First Step Services | Trusted Options for Nurseries and Rehabilitation Centers in Saudi Arabia",
    description:
      params.locale === "ar"
        ? "تعرف على خدمات منصة First Step التي تساعدك في العثور على أنسب حضانة أو مركز تأهيلي لطفلك بسهولة. استعرض، قارن، واحجز في خطوات بسيطة من مكان واحد."
        : "Discover First Step platform services that help you find the most suitable nursery or rehabilitation center for your child. Browse, compare, and book in simple steps from one place.",
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // const adSlides = await websiteService.getAdSlides(locale);
  // const services = await websiteService.getOurServices(locale);
  const services = [
    {
      id: 1,
      title: "بروفايل احترافي للمركز",
      description:
        "صفحة تعريفية جذابة تعرض هوية الحضانة أو المركز من البرامج والأنشطة. هذه الصفحة تمكن أولياء الأمور من التعرف على الخدمات",
      image: "/assets/screens/center/center-21.jpg",
    },
    {
      id: 2,
      title: "خدماتنا المتميزة",
      description:
        "نقدم مجموعة واسعة من الخدمات التعليمية والترفيهية المصممة خصيصاً لتنمية قدرات الأطفال وإعدادهم للمستقبل بأفضل الطرق التعليمية الحديثة",
      image: "/assets/screens/center/center-21.jpg",
    },
    {
      id: 3,
      title: "فريق العمل المحترف",
      description:
        "يضم فريقنا نخبة من المعلمين والمختصين في التربية والتعليم، المدربين على أحدث الأساليب التعليمية لضمان تقديم أفضل رعاية وتعليم لأطفالكم",
      image: "/assets/screens/center/center-21.jpg",
    },
    {
      id: 4,
      title: "بيئة تعليمية آمنة",
      description:
        "نوفر بيئة تعليمية آمنة ومحفزة للإبداع والتعلم، مع توفير كافة وسائل الأمان والسلامة، ومساحات مصممة خصيصاً لتناسب احتياجات الأطفال في مختلف المراحل العمرية",
      image: "/assets/screens/center/center-21.jpg",
    },
    {
      id: 5,
      title: "بيئة تعليمية آمنة",
      description:
        "نوفر بيئة تعليمية آمنة ومحفزة للإبداع والتعلم، مع توفير كافة وسائل الأمان والسلامة، ومساحات مصممة خصيصاً لتناسب احتياجات الأطفال في مختلف المراحل العمرية",
      image: "/assets/screens/center/center-21.jpg",
    },
    {
      id: 6,
      title: "بيئة تعليمية آمنة",
      description:
        "نوفر بيئة تعليمية آمنة ومحفزة للإبداع والتعلم، مع توفير كافة وسائل الأمان والسلامة، ومساحات مصممة خصيصاً لتناسب احتياجات الأطفال في مختلف المراحل العمرية",
      image: "/assets/screens/center/center-21.jpg",
    },
    {
      id: 7,
      title: "بيئة تعليمية آمنة",
      description:
        "نوفر بيئة تعليمية آمنة ومحفزة للإبداع والتعلم، مع توفير كافة وسائل الأمان والسلامة، ومساحات مصممة خصيصاً لتناسب احتياجات الأطفال في مختلف المراحل العمرية",
      image: "/assets/screens/center/center-21.jpg",
    },
  ];

  return (
    <main>
      {/* <Advertisment slides={adSlides} /> */}
      <Headline />
      <Services services={services} />
    </main>
  );
}
