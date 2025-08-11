import { Metadata } from "next";
import { websiteService } from "@/services/api";
import { notFound } from "next/navigation";
import Contact from "@/components/general/contact/Contact";
import Image from "next/image";
import FAQAccordion from "@/components/general/FAQAccordion";
import { CommonQuestion } from "@/types";

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
        ? "الأسئلة الشائعة | First Step - منصة الحضانات الموثوقة"
        : "Frequently Asked Questions | First Step - Trusted Nursery Platform",
    description:
      params.locale === "ar"
        ? "اطلع على الأسئلة الشائعة حول منصة First Step للحضانات والمراكز التأهيلية في المملكة العربية السعودية."
        : "Browse frequently asked questions about First Step platform for nurseries and rehabilitation centers in Saudi Arabia.",
  };
}

export default async function FAQsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let commonQuestions: CommonQuestion[] = [];

  try {
    commonQuestions = await websiteService.getCommonQuestions(locale);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
  }

  // If no FAQs from API, Give dummy data
  if (!commonQuestions || commonQuestions.length === 0) {
    // notFound();

    commonQuestions =
      locale === "ar"
        ? [
            {
              id: 1,
              question: "ما هي First Step وكيف تساعدني؟",
              answer:
                "First Step هي منصة تربط العائلات بالحضانات والمراكز التأهيلية، مما يسهل على أولياء الأمور العثور على الحضانة الأنسب لأطفالهم بناءً على الموقع، البرامج التعليمية، التقييمات، والخدمات المتاحة، مع إمكانية التسجيل والحجز مباشرة عبر الموقع أو التطبيق.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 2,
              question: "كيف يمكنني البحث عن حضانة مناسبة لطفلي؟",
              answer:
                "يمكنك استخدام خاصية البحث على First Step من خلال صفحة الحضانات، حيث يمكنك تصفية النتائج بناءً على الموقع، العمر، مواعيد العمل، والتقييمات. كما يمكنك الاطلاع على ملفات الحضانات وقراءة التقييمات لمساعدتك على اتخاذ القرار الأفضل لطفلك.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 3,
              question: "هل يمكنني الحجز لطفلي من خلال المنصة؟",
              answer:
                'نعم، يمكنك التقديم لحجز مقعد لطفلك في الحضانة التي تناسبك من خلال الضغط على زر "التسجيل" الموجود في صفحة الحضانة، وسيتم إرسال طلبك لإدارة الحضانة للتحقق من توفر الأماكن والرد عليك.',
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 4,
              question: "كيف يمكنني متابعة تطور طفلي في الحضانة؟",
              answer:
                "تتيح لك First Step الوصول إلى تقارير يومية تفصيلية حول أنشطة طفلك ومستوى تطوره داخل الحضانة، والتي يتم تحديثها من قبل المعلمين لمساعدتك على متابعة تقدمه.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 5,
              question: "هل يمكنني التواصل مع الحضانة مباشرة عبر الموقع؟",
              answer:
                "نعم، توفر المنصة خاصية الدردشة المباشرة (قريبًا) والتي تتيح لك التواصل مع إدارة الحضانة للاستفسار عن أي تفاصيل متعلقة بطفلك.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 6,
              question: "هل أستطيع رؤية طفلي داخل الحضانة في أثناء اليوم؟",
              answer:
                "نعمل على توفير ميزة البث المباشر (قريبًا) والتي ستسمح لك بمراقبة طفلك داخل الحضانة من خلال كاميرات آمنة لضمان راحة بالك وثقتك في جودة الرعاية المقدمة.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 7,
              question: "كيف أضمن أن المركز الذي اخترته موثوق؟",
              answer:
                "جميع المراكز المسجلة على منصتنا تمر بعملية تحقق دقيقة، كما يمكنك الاطلاع على تقييمات وتجارب الأهالي الآخرين، بالإضافة إلى مراجعة المعلومات والصور الموجودة في الملف التعريفي لكل مركز.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 8,
              question: "كيف يمكنني تقييم الحضانة بعد تسجيل طفلي؟",
              answer:
                "بعد تسجيل طفلك في إحدى الحضانات عبر First Step، يمكنك مشاركة تجربتك من خلال التقييمات والمراجعات الموجودة على صفحة الحضانة، مما يساعد الأهالي الآخرين على اختيار الأفضل لأطفالهم.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 9,
              question: "هل توفرون دعمًا للأطفال ذوي الاحتياجات الخاصة؟",
              answer:
                "نعم، نوفر قسمًا مخصصًا على First Step يضم قائمة بأفضل المراكز المتخصصة في رعاية الأطفال ذوي الاحتياجات الخاصة. يمكنك استخدام أداة البحث لدينا لتحديد أقرب مركز مناسب لك، والاطلاع على التفاصيل والتقييمات قبل اتخاذ القرار.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 10,
              question: "هل يمكن للحضانات التسجيل والانضمام إلى المنصة؟",
              answer:
                'نعم، يمكن للحضانات والمراكز التأهيلية التسجيل والانضمام إلى First Step لعرض خدماتهم والتواصل مع أولياء الأمور. يمكنهم التقديم عبر زر "انضم لفريقنا" وسيقوم فريقنا بالتواصل معهم لاستكمال الإجراءات.',
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 11,
              question: "هل يوجد دعم فني إذا واجهت مشكلة في استخدام المنصة؟",
              answer:
                'بالطبع! لدينا فريق دعم متاح لمساعدتك على أي استفسارات أو مشكلات تقنية. يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال نموذج "اتصل بنا" على الموقع.',
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
          ]
        : [
            {
              id: 1,
              question: "What is First Step and how can it help me?",
              answer:
                "First Step is a platform that connects families with nurseries and rehabilitation centers, making it easier for parents to find the most suitable nursery for their children based on location, educational programs, reviews, and available services, with the option to register and book directly through the website or app.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 2,
              question: "How can I search for a suitable nursery for my child?",
              answer:
                "You can use the search feature on First Step via the nurseries page, where you can filter results by location, age, working hours, and reviews. You can also view nursery profiles and read reviews to help you make the best decision for your child.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 3,
              question: "Can I book a place for my child through the platform?",
              answer:
                'Yes, you can apply to reserve a spot for your child in the nursery of your choice by clicking the "Register" button on the nursery page. Your request will be sent to the nursery management to check availability and respond to you.',
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 4,
              question:
                "How can I track my child's development in the nursery?",
              answer:
                "First Step allows you to access detailed daily reports about your child's activities and development in the nursery, which are updated by teachers to help you monitor their progress.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 5,
              question:
                "Can I communicate directly with the nursery through the website?",
              answer:
                "Yes, the platform offers a live chat feature (coming soon) that allows you to communicate with the nursery management to inquire about any details related to your child.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 6,
              question:
                "Can I watch my child inside the nursery during the day?",
              answer:
                "We are working on providing a live streaming feature (coming soon) that will allow you to monitor your child inside the nursery through secure cameras, ensuring your peace of mind and trust in the quality of care provided.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 7,
              question:
                "How can I make sure the center I chose is trustworthy?",
              answer:
                "All centers registered on our platform go through a strict verification process. You can also check reviews and experiences of other parents, as well as review the information and photos in each center's profile.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 8,
              question: "How can I rate the nursery after enrolling my child?",
              answer:
                "After enrolling your child in a nursery via First Step, you can share your experience through the reviews and ratings on the nursery's page, helping other parents choose the best option for their children.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 9,
              question:
                "Do you provide support for children with special needs?",
              answer:
                "Yes, we have a dedicated section on First Step with a list of the best centers specialized in caring for children with special needs. You can use our search tool to find the nearest suitable center, view details, and read reviews before making a decision.",
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 10,
              question: "Can nurseries register and join the platform?",
              answer:
                'Yes, nurseries and rehabilitation centers can register and join First Step to showcase their services and connect with parents. They can apply through the "Join Our Team" button, and our team will contact them to complete the process.',
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
            {
              id: 11,
              question:
                "Is there technical support if I face a problem using the platform?",
              answer:
                'Absolutely! We have a support team available to assist you with any inquiries or technical issues. You can contact us via email or through the "Contact Us" form on the website.',
              created_at: "2025-08-10T00:00:00Z",
              published_at: "2025-08-10T00:00:00Z",
            },
          ];
  }

  return (
    <div>
      {/* Header Section */}
      <div className="relative">
        <Image
          src="/assets/backgrounds/blog-bg.png"
          alt="FAQs Header"
          width={1440}
          height={400}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === "ar"
                ? "الأسئلة الشائعة"
                : "Frequently Asked Questions"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              {locale === "ar"
                ? "إجابات شاملة على الأسئلة الأكثر شيوعاً حول منصة First Step"
                : "Comprehensive answers to the most common questions about First Step platform"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-4">
              {locale === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {locale === "ar"
                ? "إليك مجموعة من الأسئلة الشائعة التي قد تساعدك في فهم خدماتنا والاستفادة من منصة First Step بشكل أفضل."
                : "Here are some frequently asked questions that may help you better understand our services and make the most of the First Step platform."}
            </p>
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <FAQAccordion
              commonQuestions={commonQuestions}
              locale={locale}
              variant="default"
            />
          </div>

          {/* Still Have Questions Section */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-primary-blue mb-4">
                {locale === "ar"
                  ? "لا زال لديك أسئلة؟"
                  : "Still have questions?"}
              </h3>
              <p className="text-gray-700 mb-6">
                {locale === "ar"
                  ? "إذا لم تجد إجابة لسؤالك، لا تتردد في التواصل معنا. فريقنا مستعد لمساعدتك."
                  : "If you couldn't find the answer to your question, don't hesitate to contact us. Our team is ready to help you."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:info@firststep-app.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-blue text-white font-medium rounded-lg hover:bg-primary-blue-700 transition-colors"
                >
                  {locale === "ar"
                    ? "راسلنا عبر البريد الإلكتروني"
                    : "Email Us"}
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary-blue text-primary-blue font-medium rounded-lg hover:bg-primary-blue hover:text-white transition-colors"
                >
                  {locale === "ar" ? "صفحة التواصل" : "Contact Page"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
