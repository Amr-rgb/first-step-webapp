import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ReservationForm from "@/components/general/nurseries/ReservationForm";
import { slugToReadableName } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}): Promise<Metadata> {
  const { locale, name } = await params;
  const nurseryName = slugToReadableName(name);
  
  return {
    title:
      locale === "ar"
        ? `حجز برنامج في ${nurseryName} | First Step`
        : `Book Program at ${nurseryName} | First Step`,
    description:
      locale === "ar"
        ? `احجز برنامج لطفلك في ${nurseryName}. اختر من بين برامجنا المختلفة واملأ تفاصيل الحجز.`
        : `Book a program for your child at ${nurseryName}. Choose from our different programs and fill in booking details.`,
  };
}

export default async function ReservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: "ar" | "en"; name: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, name } = await params;
  const searchParameters = await searchParams;
  const nurseryName = slugToReadableName(name);
  
  const program = typeof searchParameters.program === "string" 
    ? searchParameters.program 
    : "";

  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#22336C] mb-2">
            {locale === "ar" 
              ? "تفاصيل الحجز"
              : "Booking Details"
            }
          </h1>
          {program && (
            <p className="text-lg text-gray-600">
              {locale === "ar" 
                ? `البرنامج المختار: ${program}`
                : `Selected Program: ${program}`
              }
            </p>
          )}
        </div>
        
        <ReservationForm 
          nurseryName={nurseryName}
          selectedProgram={program}
          locale={locale}
        />
      </div>
    </div>
  );
}
