"use client";

import { useTranslations } from "next-intl";
import { PortfolioFormData } from "@/types";
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

interface ProfilePreviewProps {
  data: PortfolioFormData;
  locale: string;
  nurseryName: string;
}

export const ProfilePreview = ({
  data,
  locale,
  nurseryName,
}: ProfilePreviewProps) => {
  const t = useTranslations("nurseryDetails");

  return (
    <div className="bg-background">
      {/* 1. Hero Section */}
      {data.hero_section && (
        <Header
          name={data.hero_section.title_of_hero || nurseryName}
          slogan={data.hero_section.subtitle_of_hero}
          description={data.hero_section.description}
          backgroundImage={data.hero_section.background_image}
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
      <Plans nurseryName={nurseryName} locale={locale} portfolioData={data} />

      {/* 6. Programs Section */}
      <Programs programs={[]} nurseryName={nurseryName} locale={locale} />

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
        />
      )}

      {/* 9. Activities Section */}
      {data.images_activities && data.images_activities.length > 0 && (
        <Activities
          title={data.activity_section_title}
          subtitle={data.activity_section_subtitle}
          activities={data.images_activities}
          buttonText={t("branches.cta")}
          locale={locale}
          nurseryName={nurseryName}
        />
      )}

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
