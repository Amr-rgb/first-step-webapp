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
        ? "سياسة الخصوصية | First Step - منصة الحضانات الموثوقة"
        : "Privacy Policy | First Step - Trusted Nursery Platform",
    description:
      params.locale === "ar"
        ? "اطلع على سياسة الخصوصية لمنصة First Step وتعرف على كيفية حماية بياناتك الشخصية وضمان أمان معلوماتك عند استخدام منصتنا."
        : "View First Step platform's privacy policy and learn how we protect your personal data and ensure the security of your information when using our platform.",
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let privacyContent: any[] = [];

  try {
    privacyContent = await websiteService.getPrivacy(locale);
  } catch (error) {
    console.error("Failed to fetch privacy policy:", error);
    // Return a basic privacy policy if API fails
  }

  // Extract content from the API response
  let content = "";
  if (privacyContent && privacyContent.length > 0) {
    // The content might be in different fields - check both
    content =
      privacyContent[0]?.content?.[locale] ||
      privacyContent[0]?.description?.[locale] ||
      privacyContent[0]?.content ||
      privacyContent[0]?.description ||
      (typeof privacyContent === "string" ? privacyContent : "");
  }

  // If still no content, show not found
  if (!content || content.trim() === "") {
    notFound();
  }

  return (
    <div>
      {/* Header Section */}
      <div className="relative">
        <Image
          src="/assets/backgrounds/blog-bg.png"
          alt="Privacy Policy Header"
          width={1440}
          height={400}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              {locale === "ar"
                ? "نلتزم بحماية خصوصيتك وضمان أمان معلوماتك الشخصية"
                : "We are committed to protecting your privacy and ensuring the security of your personal information"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Privacy Policy Content */}
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

            {/* Last Updated */}
            <div className="mt-12 pt-8 border-t border-gray-200">
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
                  ? "للاستفسارات حول سياسة الخصوصية:"
                  : "Privacy Policy Inquiries:"}
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
