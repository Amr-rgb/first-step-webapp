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
        <Branches branches={portfolio.branches} />
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
        <Philosophy data={portfolio.Philosophy_Methodology_Goal} />
      )}

      {/* 5. Plans Section */}
      <Plans nurseryName={readableName} locale={locale} />

      {/* 6. Programs Section */}
      <Programs programs={[]} nurseryName={readableName} locale={locale} />

      {/* 6. Services Section */}
      {portfolio.services &&
        Array.isArray(portfolio.services) &&
        portfolio.services.length > 0 && (
          <Services
            services={portfolio.services.map((service) => ({
              title: service.title,
              description: service.description,
              image: service.image_service || "",
            }))}
          />
        )}

      {/* 7. Statistics Section */}
      {portfolio.nursery_state && (
        <Stats
          preview={false}
          stats={[
            ...(portfolio.nursery_state.area
              ? [
                  {
                    icon: (
                      <svg
                        width={120}
                        height={120}
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M60 4 61.792.424a4 4 0 0 0-3.584 0zM36 68v-4h-4v4zm32 0h4v-4h-4zM0 120h120v-8H0zM58.208.424l-48 24 3.584 7.152 48-24zM0 48h120v-8H0zm109.792-23.576-48-24-3.584 7.152 48 24zM8 44v72h8V44zm96 0v72h8V44zm-64 72V68h-8v48zm-4-44h32v-8H36zm28-4v48h8V68z"
                          fill="#b12f53"
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
                        width={120}
                        height={120}
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M54.428 4.285h54.017a7.276 7.276 0 0 1 7.277 7.277V69.66a7.28 7.28 0 0 1-7.277 7.286h-44.16M26.99 34.294a15.004 15.004 0 1 0 0-30.009 15.004 15.004 0 0 0 0 30.009"
                          stroke="#2b3990"
                          strokeWidth={8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M77.142 47.373a8.805 8.805 0 0 0-8.803-8.803H26.991A22.714 22.714 0 0 0 4.285 61.276v20.151h9.729l3.248 34.286H36.72l7.475-59.528H68.34c4.86 0 8.803-3.943 8.803-8.812"
                          stroke="#2b3990"
                          strokeWidth={8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                        width={120}
                        height={120}
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M60 18a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-15 9a15 15 0 1 1 30 0 15 15 0 0 1-30 0m48-3a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-12 6a12 12 0 1 1 24 0 12 12 0 0 1-24 0m-60 0a6 6 0 1 1 12 0 6 6 0 0 1-12 0m6-12a12 12 0 1 0 0 24 12 12 0 0 0 0-24m3.6 71.988L30 90a12 12 0 0 1-12-12V55.5a1.5 1.5 0 0 1 1.5-1.5h10.584a13.4 13.4 0 0 1 2.19-6H19.5c-4.14 0-7.5 3.36-7.5 7.5V78a18 18 0 0 0 20.424 17.838 30 30 0 0 1-1.824-5.85m56.976 5.85Q88.764 96 90 96a18 18 0 0 0 18-18V55.5c0-4.14-3.36-7.5-7.5-7.5H87.726a13.35 13.35 0 0 1 2.19 6H100.5a1.5 1.5 0 0 1 1.5 1.5V78a12 12 0 0 1-3.728 8.697 12 12 0 0 1-8.872 3.291 30 30 0 0 1-1.824 5.85M43.5 48c-4.14 0-7.5 3.36-7.5 7.5V84a24 24 0 0 0 24 24 24.003 24.003 0 0 0 24-24V55.5c0-4.14-3.36-7.5-7.5-7.5zM42 55.5a1.5 1.5 0 0 1 1.5-1.5h33a1.5 1.5 0 0 1 1.5 1.5V84a18 18 0 1 1-36 0z"
                          fill="#83cbaa"
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
        />
      )}

      {/* 8. Activities Section */}
      {portfolio.images_activities &&
        portfolio.images_activities.length > 0 && (
          <Activities
            title={portfolio.activity_section_title}
            subtitle={portfolio.activity_section_subtitle}
            description={portfolio.activity_section_description}
            activities={portfolio.images_activities}
            preview={false}
          />
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
