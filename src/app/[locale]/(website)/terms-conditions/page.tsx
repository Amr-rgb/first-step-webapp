import { Metadata } from "next";
import { websiteService } from "@/services/api";
import { notFound } from "next/navigation";
import Contact from "@/components/general/contact/Contact";
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
        ? "الشروط والأحكام | First Step - منصة الحضانات الموثوقة"
        : "Terms and Conditions | First Step - Trusted Nursery Platform",
    description:
      params.locale === "ar"
        ? "اطلع على شروط وأحكام استخدام منصة First Step للحضانات والمراكز التأهيلية في المملكة العربية السعودية."
        : "View the terms and conditions for using First Step platform for nurseries and rehabilitation centers in Saudi Arabia.",
  };
}

export default async function TermsConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let termsContent: any[] = [];

  try {
    termsContent = await websiteService.getTermsAndConditions(locale);
  } catch (error) {
    console.error("Failed to fetch terms and conditions:", error);
    // Return a basic terms page if API fails
  }

  // Extract content from the API response
  let content = "";
  let hasError = false;

  if (termsContent && termsContent.length > 0) {
    // The content might be in different fields - check both
    content =
      termsContent[0]?.content?.[locale] ||
      termsContent[0]?.description?.[locale] ||
      termsContent[0]?.content ||
      termsContent[0]?.description ||
      (typeof termsContent === "string" ? termsContent : "");
  } else {
    hasError = true;
  }

  // If still no content and there was an error, show error message
  if ((!content || content.trim() === "") && hasError) {
    return (
      <div>
        {/* Header Section */}
        <div className="relative">
          <Image
            src="/assets/backgrounds/blog-bg.png"
            alt="Terms and Conditions Header"
            width={1440}
            height={400}
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {locale === "ar" ? "الشروط والأحكام" : "Terms and Conditions"}
              </h1>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center space-y-6">
              <div className="text-destructive text-6xl">⚠️</div>
              <h2 className="text-2xl font-bold text-primary">
                {locale === "ar"
                  ? "حدث خطأ في تحميل الشروط والأحكام"
                  : "Error Loading Terms and Conditions"}
              </h2>
              <p className="text-gray-600">
                {locale === "ar"
                  ? "نعتذر، حدث خطأ أثناء تحميل محتوى الشروط والأحكام. يرجى المحاولة مرة أخرى لاحقاً."
                  : "Sorry, an error occurred while loading the terms and conditions content. Please try again later."}
              </p>
              <a
                href={`/${locale}`}
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
              </a>
            </div>
          </div>
        </div>

        <Contact />
      </div>
    );
  }

  // If no content but no error, show not found
  if (!content || content.trim() === "") {
    notFound();
  }

  return (
    <div>
      {/* Header Section */}
      <div className="relative">
        <Image
          src="/assets/backgrounds/blog-bg.png"
          alt="Terms and Conditions Header"
          width={1440}
          height={400}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === "ar" ? "الشروط والأحكام" : "Terms and Conditions"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              {locale === "ar"
                ? "الشروط والأحكام المنظمة لاستخدام منصة First Step"
                : "Terms and conditions governing the use of First Step platform"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Terms and Conditions Content */}
            <div
              className={`prose prose-lg max-w-none ${
                locale === "ar" ? "text-right" : "text-left"
              }
                [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:text-primary-blue
                [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:text-primary-blue
                [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-3 [&>h3]:mt-6
                [&>p]:mb-4 [&>p]:leading-7 [&>p]:text-gray-700
                [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-gray-700
                [&>ol]:mb-6 [&>ol>li]:mb-2 [&>ol>li]:text-gray-700
                [&>strong]:font-semibold [&>strong]:text-gray-900
                [&>a]:text-blue-600 [&>a]:hover:text-blue-800 [&>a]:underline
                [&>blockquote]:border-l-4 [&>blockquote]:border-blue-200 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600
              `}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Acceptance Notice */}
            <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                {locale === "ar" ? "إقرار الموافقة" : "Acceptance Agreement"}
              </h3>
              <p className="text-blue-700">
                {locale === "ar"
                  ? "باستخدامك لمنصة First Step، فإنك توافق على جميع الشروط والأحكام المذكورة أعلاه."
                  : "By using the First Step platform, you agree to all the terms and conditions mentioned above."}
              </p>
            </div>

            {/* Last Updated */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                {locale === "ar" ? "آخر تحديث: " : "Last updated: "}
                {new Date().toLocaleDateString(
                  locale === "ar" ? "ar-SA" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                {locale === "ar"
                  ? "للاستفسارات حول الشروط والأحكام:"
                  : "Terms and Conditions Inquiries:"}
              </h3>
              <p className="text-gray-700">
                {locale === "ar" ? "البريد الإلكتروني: " : "Email: "}
                <a
                  href="mailto:info@firststep-app.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  info@firststep-app.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
