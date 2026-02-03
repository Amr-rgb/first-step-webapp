import NurseryHeader from "./_components/NurseryHeader";
import AboutSection from "./_components/AboutSection";
import FacilitiesSection from "./_components/FacilitiesSection";
import ProgramsSection from "./_components/ProgramsSection";
import ProfileWaitingPage from "@/components/general/nurseries/ProfileWaitingPage";
import { slugToReadableName } from "@/lib/utils";
import { nurseryService } from "@/services/api";
import { getTranslations } from "next-intl/server";

export default async function NurseryPage({
  params,
}: {
  params: Promise<{ name: string; locale: string }>;
}) {
  const { name, locale } = await params;
  const t = await getTranslations("nurseryDetails");

  // Extract ID from URL (expected format: [id]-[slug])
  const idMatch = name.match(/^(\d+)-(.*)$/);
  const id = idMatch ? idMatch[1] : null;
  const slugPart = idMatch ? idMatch[2] : name;
  const readableName = slugToReadableName(slugPart);

  // Fetch basic portfolio data to check existence
  let portfolioResponse;
  if (id) {
    portfolioResponse = await nurseryService.getNurseryPortfolioById(
      id,
      locale,
    );
  } else {
    portfolioResponse = await nurseryService.getNurseryPortfolio(name, locale);
  }

  const portfolio = portfolioResponse?.data as any;

  if (!portfolio) {
    return (
      <div>
        <ProfileWaitingPage nurseryName={readableName} locale={locale} />
      </div>
    );
  }

  const centerIdStr = id || String(portfolio.center_id || portfolio.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <NurseryHeader
        name={portfolio.hero_section?.title_of_hero || readableName}
        tagline={portfolio.hero_section?.subtitle_of_hero || ""}
        logo={portfolio.user?.logo || ""}
        rating={4.5}
      />

      <div className="container mx-auto px-4 md:px-8 py-12 space-y-20">
        {/* About Section */}
        <AboutSection
          title={t("about.title")}
          subtitle={portfolio.hero_section?.subtitle_of_hero || ""}
          description={portfolio.hero_section?.description || ""}
        />

        {/* Facilities Section */}
        <FacilitiesSection
          title={t("facilities.title")}
          facilities={portfolio.admin_options || []}
          locale={locale}
        />

        {/* Programs Section */}
        <div id="programs" className="scroll-mt-20">
          <ProgramsSection
            centerId={centerIdStr}
            nurseryName={name}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
