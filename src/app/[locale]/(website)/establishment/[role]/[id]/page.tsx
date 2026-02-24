import {
    EstablishmentHeader,
    AboutSection,
    AdsSection,
    RatingsSection,
    BlogsSection,
    CouponsSection,
    SuggestedEstablishmentsSection,
    ProgramsSection,
} from "../../../establishments/_components";
import FacilitiesSection from "../../../establishments/nurseries/[name]/_components/FacilitiesSection";
import AlbumsSection from "../../../establishments/nurseries/[name]/_components/AlbumsSection";
import ProfileWaitingPage from "@/components/general/nurseries/ProfileWaitingPage";
import { slugToReadableName } from "@/lib/utils";
import { establishmentService } from "@/services/api";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ role: string; id: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id: idParam, locale, role } = await params;
    // Extract ID from URL (expected format: [id]-[slug])
    const idMatch = idParam.match(/^(\d+)-(.*)$/);
    const id = idMatch ? idMatch[1] : idParam; // Fallback to idParam if no match (just ID)

    try {
        let portfolio;
        if (id) {
            const response = await establishmentService.getEstablishmentPortfolioById(id, locale, role);
            portfolio = response?.data as any;
        }

        if (!portfolio) throw new Error();

        return {
            title: portfolio.hero_section?.title_of_hero || portfolio.nursery_name,
            description: portfolio.hero_section?.description || "",
        };
    } catch {
        return {
            title: "Establishment Details",
        };
    }
}

export default async function EstablishmentPage({
    params,
}: {
    params: Promise<{ role: string; id: string; locale: string }>;
}) {
    const { role, id: idParam, locale } = await params;
    const t = await getTranslations("nurseryDetails");

    // Extract ID from URL (expected format: [id]-[slug])
    const idMatch = idParam.match(/^(\d+)-(.*)$/);
    const id = idMatch ? idMatch[1] : idParam;
    const slugPart = idMatch ? idMatch[2] : ""; // Default to empty if no slug
    const readableName = slugPart ? slugToReadableName(slugPart) : "";

    // Fetch basic portfolio data
    let portfolioResponse;
    if (id) {
        portfolioResponse = await establishmentService.getEstablishmentPortfolioById(
            id,
            locale,
            role,
        );
    }

    const portfolio = portfolioResponse?.data as any;

    console.log(`[EstablishmentPage] ID: ${id}, Role: ${role}`);
    console.log(`[EstablishmentPage] Portfolio Data:`, portfolio ? "Found" : "Not Found");
    if (portfolio) {
        console.log(`[EstablishmentPage] Portfolio Name: ${portfolio.nursery_name || portfolio.name}`);
        console.log(`[EstablishmentPage] Portfolio ID: ${portfolio.id}`);
    } else {
        console.log(`[EstablishmentPage] Full Response:`, JSON.stringify(portfolioResponse, null, 2));
    }

    if (!portfolio) {
        return (
            <div>
                <ProfileWaitingPage nurseryName={readableName || "Establishment"} locale={locale} />
            </div>
        );
    }

    const centerIdStr = id || String(portfolio.center_id || portfolio.id);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <EstablishmentHeader
                name={portfolio.hero_section?.title_of_hero || portfolio.nursery_name || portfolio.name || readableName}
                tagline={portfolio.hero_section?.subtitle_of_hero || ""}
                logo={portfolio.user?.logo || portfolio.logo || ""}
                rating={4.5}
                centerId={centerIdStr}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Info Column: About & Facilities */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10 lg:gap-10 order-1">
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

                        {/* Ads Section */}
                        <AdsSection centerId={centerIdStr} />

                        {/* Albums Section */}
                        <AlbumsSection images={portfolio.images_activities || []} />
                    </div>

                    {/* Sticky Sidebar Column: Programs */}
                    <div className="lg:col-span-5 xl:col-span-4 order-2 flex flex-col gap-10">
                        <ProgramsSection
                            centerId={centerIdStr}
                            nurseryName={portfolio.nursery_name || readableName}
                            locale={locale}
                        />

                        {/* Coupons Section */}
                        <CouponsSection
                            centerId={centerIdStr}
                            nurseryLogo={portfolio.user?.logo || portfolio.logo}
                        />

                        {/* Ratings Section */}
                        <RatingsSection />

                        {/* Blogs Section */}
                        <BlogsSection centerId={centerIdStr} />

                        {/* Suggested Establishments Section */}
                        <SuggestedEstablishmentsSection currentCenterId={centerIdStr} />
                    </div>
                </div>
            </div>
        </div>
    );
}
