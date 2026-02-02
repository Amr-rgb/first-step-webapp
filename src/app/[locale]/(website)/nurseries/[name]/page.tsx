import NurseryHeader from "./_components/NurseryHeader";
import Plans from "@/components/general/nurseries/sections/Plans";
import ProfileWaitingPage from "@/components/general/nurseries/ProfileWaitingPage";
import { slugToReadableName } from "@/lib/utils";
import { nurseryService } from "@/services/api";

export default async function NurseryPage({
  params,
}: {
  params: Promise<{ name: string; locale: string }>;
}) {
  const { name, locale } = await params;

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

  const portfolio = portfolioResponse?.data as any; // Cast to any to handle user.logo as requested

  if (!portfolio) {
    return (
      <div>
        <ProfileWaitingPage nurseryName={readableName} locale={locale} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <NurseryHeader
        name={portfolio.hero_section?.title_of_hero || readableName}
        tagline={portfolio.hero_section?.subtitle_of_hero || ""}
        logo={portfolio.user?.logo || ""}
        rating={4.5}
      />

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Plans Section */}
        <Plans
          centerId={id || String(portfolio.id)}
          nurseryName={readableName}
          locale={locale}
        />
      </div>
    </div>
  );
}
