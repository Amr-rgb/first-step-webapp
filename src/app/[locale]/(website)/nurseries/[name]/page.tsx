import Advertisment from "@/components/general/Advertisment";
import Branches from "@/components/general/nurseries/Branches";
import Header from "@/components/general/nurseries/Header";
import Programs from "@/components/general/nurseries/sections/Programs";
import Stats from "@/components/general/nurseries/sections/Stats";
import Team from "@/components/general/nurseries/sections/Team";
import ProfileWaitingPage from "@/components/general/nurseries/ProfileWaitingPage";
import { slugToReadableName } from "@/lib/utils";
import { AdSlide, PortfolioResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { nurseryService } from "@/services/api";

export default async function NurseryPage({
  params,
}: {
  params: Promise<{ name: string; locale: string }>;
}) {
  const { name, locale } = await params;
  const t = await getTranslations("nurseryDetails");
  const readableName = slugToReadableName(name);

  // Fetch portfolio data for the specific nursery
  const portfolioResponse = await nurseryService.getNurseryPortfolio(
    readableName,
    locale
  );

  // Use API data only
  const portfolio = portfolioResponse?.data;

  // Early return if no portfolio data
  if (!portfolio) {
    return (
      <div>
        <ProfileWaitingPage nurseryName={readableName} locale={locale} />
      </div>
    );
  }

  return (
    <div>
      {/* 1. Hero Section */}
      {portfolio.hero_section && (
        <Header
          name={portfolio.hero_section.title_of_hero || readableName}
          slogan={portfolio.hero_section.subtitle_of_hero}
          description={portfolio.hero_section.description}
          backgroundImage={portfolio.hero_section.background_image}
        />
      )}

      {/* 2. Branches Section */}
      {portfolio.branches && portfolio.branches.length > 0 && (
        <Branches locale={locale} nurseryName={readableName} />
      )}

      {/* 3. Advertisement Section */}
      {portfolio.ads_images && portfolio.ads_images.length > 0 && (
        <Advertisment
          slides={portfolio.ads_images.map((image, index) => ({
            id: index,
            image: image,
            title: `Advertisement ${index + 1}`,
            created_at: new Date().toISOString(),
            published_at: new Date().toISOString(),
          }))}
        />
      )}

      {/* 4. Philosophy Section */}
      {portfolio.Philosophy_Methodology_Goal && (
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.Philosophy_Methodology_Goal.philosophy && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("philosophy.title")}
                </h3>
                <p className="text-gray-600">
                  {portfolio.Philosophy_Methodology_Goal.philosophy.content}
                </p>
              </div>
            )}

            {portfolio.Philosophy_Methodology_Goal.methodology && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("methodology.title")}
                </h3>
                <p className="text-gray-600">
                  {portfolio.Philosophy_Methodology_Goal.methodology.content}
                </p>
              </div>
            )}

            {portfolio.Philosophy_Methodology_Goal.goals && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("goals.title")}
                </h3>
                <p className="text-gray-600">
                  {portfolio.Philosophy_Methodology_Goal.goals.content}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Programs Section */}
      <Programs nurseryName={readableName} locale={locale} />

      {/* 6. Services Section */}
      {portfolio.services && portfolio.services.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {portfolio.service_section_title || t("services.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                {service.image_service && (
                  <img
                    src={service.image_service}
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Statistics Section */}
      {portfolio.nursery_state && (
        <Stats
          stats={[
            ...(portfolio.nursery_state.area
              ? [
                  {
                    icon: (
                      <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 64 64"
                      >
                        <path
                          d="M8 56V24L32 8l24 16v32H8Z"
                          stroke="#B12F53"
                          strokeWidth="3"
                        />
                        <path
                          d="M24 56V40h16v16"
                          stroke="#B12F53"
                          strokeWidth="3"
                        />
                      </svg>
                    ),
                    value: portfolio.nursery_state.area,
                    label: t("stats.area"),
                    color: "text-[#B12F53]",
                  },
                ]
              : []),
            ...(portfolio.nursery_state.class_rooms
              ? [
                  {
                    icon: (
                      <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 64 64"
                      >
                        <path
                          d="M12 16h40v32H12z"
                          stroke="#22336C"
                          strokeWidth="3"
                        />
                        <path
                          d="M24 32h16M24 40h16"
                          stroke="#22336C"
                          strokeWidth="3"
                        />
                        <circle
                          cx="20"
                          cy="24"
                          r="4"
                          stroke="#22336C"
                          strokeWidth="3"
                        />
                      </svg>
                    ),
                    value: portfolio.nursery_state.class_rooms,
                    label: t("stats.classrooms"),
                    color: "text-[#22336C]",
                  },
                ]
              : []),
            ...(portfolio.nursery_state.team_members
              ? [
                  {
                    icon: (
                      <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 64 64"
                      >
                        <circle
                          cx="32"
                          cy="20"
                          r="8"
                          stroke="#47B881"
                          strokeWidth="3"
                        />
                        <path
                          d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16"
                          stroke="#47B881"
                          strokeWidth="3"
                        />
                        <circle
                          cx="16"
                          cy="28"
                          r="5"
                          stroke="#47B881"
                          strokeWidth="2"
                        />
                        <circle
                          cx="48"
                          cy="28"
                          r="5"
                          stroke="#47B881"
                          strokeWidth="2"
                        />
                      </svg>
                    ),
                    value: portfolio.nursery_state.team_members,
                    label: t("stats.teamMembers"),
                    color: "text-[#47B881]",
                  },
                ]
              : []),
          ]}
          buttonText={t("branches.cta")}
          locale={locale}
          nurseryName={readableName}
        />
      )}

      {/* 8. Activities Section */}
      {portfolio.images_activities &&
        portfolio.images_activities.length > 0 && (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                {portfolio.activity_section_title || t("activities.title")}
              </h2>
              {portfolio.activity_section_subtitle && (
                <p className="text-xl text-gray-600">
                  {portfolio.activity_section_subtitle}
                </p>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.images_activities.map((image, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Activity ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      {/* 9. Team Section */}
      {portfolio.teams && portfolio.teams.length > 0 && (
        <Team
          members={portfolio.teams.map((member) => ({
            name: member.name,
            role: member.mission,
            image: member.image,
          }))}
        />
      )}
    </div>
  );
}
