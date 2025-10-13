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
    </div>
  );
};
