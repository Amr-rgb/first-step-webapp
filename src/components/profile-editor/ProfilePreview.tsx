"use client";

import { useTranslations } from "next-intl";
import { PortfolioData } from "@/types";
import Advertisment from "@/components/general/Advertisment";
import Branches from "@/components/general/nurseries/Branches";
import Header from "@/components/general/nurseries/Header";
import Programs from "@/components/general/nurseries/sections/Programs";
import Services from "@/components/general/nurseries/sections/Services";
import Philosophy from "@/components/general/nurseries/sections/Philosophy";
import Plans from "@/components/general/nurseries/sections/Plans";
import Activities from "@/components/general/nurseries/sections/Activities";
import Stats from "@/components/general/nurseries/sections/Stats";
import Team from "@/components/general/nurseries/sections/Team";
import { useQuery } from "@tanstack/react-query";
import { useBranches } from "@/hooks/useBranches";
import { centerService } from "@/services/dashboardApi";

interface ProfilePreviewProps {
  data: PortfolioData & {
    title_of_hero?: string;
    subtitle_of_hero?: string;
    description?: string;
    background_image?: string;
  };
  locale: string;
  nurseryName: string;
}

// Plans Preview Component
const PlansPreview = ({ locale }: { locale: string }) => {
  const t = useTranslations("nurseryDetails");
  const { data: branches = [] } = useBranches();

  // Type assertion for branches
  const typedBranches = branches as any[];

  // Fetch plans for all branches
  const { data: allPlans = [] } = useQuery({
    queryKey: ["all-branch-pricing", typedBranches.map((b) => b.id)],
    queryFn: async () => {
      if (typedBranches.length === 0) return [];

      const pricingPromises = typedBranches.map(async (branch: any) => {
        try {
          const response = await centerService.getBranchPricing(
            branch.id.toString()
          );
          return {
            branch_id: branch.id,
            branch_name: branch.nursery_name_branch || branch.name,
            pricing: response.data || [],
          };
        } catch (error) {
          console.error(
            `Error fetching pricing for branch ${branch.id}:`,
            error
          );
          return {
            branch_id: branch.id,
            branch_name: branch.nursery_name_branch || branch.name,
            pricing: [],
          };
        }
      });

      return await Promise.all(pricingPromises);
    },
    enabled: branches.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const getEnrollmentTypeLabel = (type: string) => {
    switch (type) {
      case "hour":
        return locale === "ar" ? "ساعة" : "Hour";
      case "day":
        return locale === "ar" ? "يوم" : "Day";
      case "month":
        return locale === "ar" ? "شهر" : "Month";
      case "year":
        return locale === "ar" ? "سنة" : "Year";
      default:
        return type;
    }
  };

  const getDurationLabel = (count: number, type: string) => {
    const typeLabel = getEnrollmentTypeLabel(type);
    if (count === 1) {
      return typeLabel;
    }
    return `${count} ${typeLabel}${
      locale === "ar" ? "ات" : count > 1 ? "s" : ""
    }`;
  };

  const hasAnyPlans = allPlans.some(
    (branchData: any) => branchData.pricing.length > 0
  );

  if (!hasAnyPlans) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("plans.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("plans.subtitle")}
            </p>
          </div>
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {locale === "ar"
                  ? "لا توجد برامج متاحة حالياً"
                  : "No Programs Available"}
              </h3>
              <p className="text-gray-600">
                {locale === "ar"
                  ? "سيتم إضافة البرامج قريباً. تحقق من الفرع لاحقاً."
                  : "Programs will be added soon. Please check back later."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("plans.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("plans.subtitle")}
          </p>
        </div>

        <div className="space-y-12">
          {allPlans.map((branchData: any) => {
            if (branchData.pricing.length === 0) return null;

            return (
              <div key={branchData.branch_id}>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  {branchData.branch_name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {branchData.pricing.map((plan: any) => (
                    <div
                      key={plan.id}
                      className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">
                        {plan.title}
                      </h4>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {t("plans.ageRange")}: {plan.start_age}-
                            {plan.end_age} {locale === "ar" ? "سنة" : "years"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {t("plans.duration")}:{" "}
                            {getDurationLabel(plan.count, plan.enrollment_type)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {t("plans.price")}: {plan.price_amount}{" "}
                            {locale === "ar" ? "ريال" : "SAR"}
                          </span>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium opacity-50 cursor-not-allowed">
                        {t("plans.bookNow")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const ProfilePreview = ({
  data,
  locale,
  nurseryName,
}: ProfilePreviewProps) => {
  const t = useTranslations("nurseryDetails");

  return (
    <div className="bg-background">
      {/* 1. Hero Section */}
      {data.title_of_hero && (
        <Header
          name={data.title_of_hero || nurseryName}
          slogan={data.subtitle_of_hero}
          description={data.description}
          backgroundImage={data.background_image}
          preview
        />
      )}

      {/* 2. Branches Section */}
      {data.branches && data.branches.length > 0 && (
        <Branches branches={data.branches} />
      )}

      {/* 3. Advertisement Section */}
      {data.ads_images && data.ads_images.length > 0 && (
        <Advertisment
          slides={data.ads_images.map((image, index) => ({
            id: index,
            image: image,
            title: `Advertisement ${index + 1}`,
            created_at: new Date().toISOString(),
            published_at: new Date().toISOString(),
          }))}
        />
      )}

      {/* 4. Philosophy Section */}
      {data.Philosophy_Methodology_Goal && (
        <Philosophy data={data.Philosophy_Methodology_Goal} />
      )}

      {/* 5. Plans Section */}
      <PlansPreview locale={locale} />

      {/* 6. Programs Section */}
      {/* <Programs programs={[]} nurseryName={nurseryName} locale={locale} /> */}

      {/* 7. Services Section */}
      {data.services && data.services.length > 0 && (
        <Services
          services={data.services.map((service) => ({
            title: service.title,
            description: service.description,
            image: service.image_service || "",
          }))}
        />
      )}

      {/* 8. Statistics Section */}
      {data.nursery_state && (
        <Stats
          stats={[
            ...(data.nursery_state.area
              ? [
                  {
                    icon: (
                      <svg
                        width="120"
                        height="120"
                        fill="none"
                        viewBox="0 0 64 64"
                      >
                        <path
                          d="M8 56V24L32 8l24 16v32H8Z"
                          stroke="#B12F53"
                          strokeWidth="4"
                        />
                        <path
                          d="M24 56V40h16v16"
                          stroke="#B12F53"
                          strokeWidth="4"
                        />
                      </svg>
                    ),
                    value: data.nursery_state.area,
                    label: t("stats.area"),
                    color: "text-[#B12F53]",
                  },
                ]
              : []),
            ...(data.nursery_state.class_rooms
              ? [
                  {
                    icon: (
                      <svg
                        width="120"
                        height="120"
                        fill="none"
                        viewBox="0 0 64 64"
                      >
                        <path
                          d="M12 16h40v32H12z"
                          stroke="#22336C"
                          strokeWidth="4"
                        />
                        <path
                          d="M24 32h16M24 40h16"
                          stroke="#22336C"
                          strokeWidth="4"
                        />
                        <circle
                          cx="20"
                          cy="24"
                          r="4"
                          stroke="#22336C"
                          strokeWidth="4"
                        />
                      </svg>
                    ),
                    value: data.nursery_state.class_rooms,
                    label: t("stats.classrooms"),
                    color: "text-[#22336C]",
                  },
                ]
              : []),
            ...(data.nursery_state.team_members
              ? [
                  {
                    icon: (
                      <svg
                        width="120"
                        height="120"
                        fill="none"
                        viewBox="0 0 64 64"
                      >
                        <circle
                          cx="32"
                          cy="20"
                          r="8"
                          stroke="#47B881"
                          strokeWidth="4"
                        />
                        <path
                          d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16"
                          stroke="#47B881"
                          strokeWidth="4"
                        />
                        <circle
                          cx="16"
                          cy="28"
                          r="5"
                          stroke="#47B881"
                          strokeWidth="3"
                        />
                        <circle
                          cx="48"
                          cy="28"
                          r="5"
                          stroke="#47B881"
                          strokeWidth="3"
                        />
                      </svg>
                    ),
                    value: data.nursery_state.team_members,
                    label: t("stats.teamMembers"),
                    color: "text-[#47B881]",
                  },
                ]
              : []),
          ]}
          buttonText={t("branches.cta")}
          locale={locale}
          nurseryName={nurseryName}
          preview
        />
      )}

      {/* 9. Activities Section */}
      <Activities
        title={data.activity_section_title}
        subtitle={data.activity_section_subtitle}
        activities={data.images_activities || []}
        buttonText={t("branches.cta")}
        locale={locale}
        nurseryName={nurseryName}
        preview
      />

      {/* 10. Team Section */}
      {data.teams && data.teams.length > 0 && (
        <Team
          members={data.teams.map((member) => ({
            name: member.name,
            role: member.mission,
            image: member.image,
          }))}
        />
      )}

      {/* 11. Contact Section */}
      {/* {data.contact_info && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {locale === "ar" ? "معلومات التواصل" : "Contact Information"}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {locale === "ar"
                  ? "تواصل معنا للحصول على مزيد من المعلومات"
                  : "Get in touch with us for more information"}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Details */}
                  <div className="space-y-6">
                    {data.contact_info.address && (
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="w-6 h-6 text-blue-600 mt-1">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {locale === "ar" ? "العنوان" : "Address"}
                          </h3>
                          <p className="text-gray-600">
                            {data.contact_info.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.contact_info.phone_number && (
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="w-6 h-6 text-green-600 mt-1">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {locale === "ar" ? "الهاتف" : "Phone"}
                          </h3>
                          <p className="text-gray-600">
                            {data.contact_info.phone_number}
                          </p>
                        </div>
                      </div>
                    )}

                    {data.contact_info.email_address && (
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="w-6 h-6 text-purple-600 mt-1">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                          </h3>
                          <p className="text-gray-600">
                            {data.contact_info.email_address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Working Hours */}
                  <div className="space-y-6">
                    {data.contact_info.working_hours && (
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="w-6 h-6 text-orange-600 mt-1">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {locale === "ar" ? "ساعات العمل" : "Working Hours"}
                          </h3>
                          <p className="text-gray-600">
                            {data.contact_info.working_hours}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Social Media Links */}
                    {(data.contact_info.facebook ||
                      data.contact_info.instagram ||
                      data.contact_info.whatsapp) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {locale === "ar"
                            ? "وسائل التواصل الاجتماعي"
                            : "Social Media"}
                        </h3>
                        <div className="flex space-x-4 rtl:space-x-reverse">
                          {data.contact_info.facebook && (
                            <a
                              href={data.contact_info.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </a>
                          )}
                          {data.contact_info.instagram && (
                            <a
                              href={data.contact_info.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281H7.83c-.928 0-1.679.751-1.679 1.679v7.83c0 .928.751 1.679 1.679 1.679h8.449c.928 0 1.679-.751 1.679-1.679V9.386c0-.928-.751-1.679-1.679-1.679z" />
                              </svg>
                            </a>
                          )}
                          {data.contact_info.whatsapp && (
                            <a
                              href={data.contact_info.whatsapp}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}
    </div>
  );
};
