import Advertisment from "@/components/general/Advertisment";
import Branches from "@/components/general/nurseries/Branches";
import Header from "@/components/general/nurseries/Header";
import Programs from "@/components/general/nurseries/sections/Programs";
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

  // Check if portfolio exists and has data
  const hasProfile =
    portfolio &&
    (portfolio.hero_section ||
      (portfolio.branches && portfolio.branches.length > 0) ||
      portfolio.Philosophy_Methodology_Goal ||
      (portfolio.services && portfolio.services.length > 0) ||
      portfolio.nursery_state ||
      (portfolio.images_activities && portfolio.images_activities.length > 0) ||
      (portfolio.teams && portfolio.teams.length > 0) ||
      portfolio.contact_info);

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
      {hasProfile ? (
        <>
          {/* Hero Section */}
          {portfolio.hero_section && (
            <Header
              name={portfolio.hero_section.title_of_hero || readableName}
              slogan={portfolio.hero_section.subtitle_of_hero}
              description={portfolio.hero_section.description}
              backgroundImage={portfolio.hero_section.background_image}
            />
          )}

          {/* Branches Section */}
          {portfolio.branches && portfolio.branches.length > 0 && (
            <Branches locale={locale} nurseryName={readableName} />
          )}

          {/* Philosophy, Methodology, Goals Section */}
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
                      {
                        portfolio.Philosophy_Methodology_Goal.methodology
                          .content
                      }
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

          {/* Services Section */}
          {portfolio.services && portfolio.services.length > 0 && (
            <div className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  {portfolio.service_section_title || t("services.title")}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolio.services.map((service, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-12 h-12 bg-[#B12F53] rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <h3 className="text-xl font-semibold text-[#22336C] mb-3">
                        {service.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolio.services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
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

          {/* Stats Section */}
          {portfolio.nursery_state && (
            <div className="bg-gray-100 py-16">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  {portfolio.nursery_state.area && (
                    <div>
                      <h3 className="text-4xl font-bold text-blue-600 mb-2">
                        {portfolio.nursery_state.area}
                      </h3>
                      <p className="text-gray-600">{t("stats.area")}</p>
                    </div>
                  )}
                  {portfolio.nursery_state.class_rooms && (
                    <div>
                      <h3 className="text-4xl font-bold text-blue-600 mb-2">
                        {portfolio.nursery_state.class_rooms}
                      </h3>
                      <p className="text-gray-600">{t("stats.classrooms")}</p>
                    </div>
                  )}
                  {portfolio.nursery_state.team_members && (
                    <div>
                      <h3 className="text-4xl font-bold text-blue-600 mb-2">
                        {portfolio.nursery_state.team_members}
                      </h3>
                      <p className="text-gray-600">{t("stats.teamMembers")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Activities Section */}
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

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.images_activities.map(
                      (activity: string, index: number) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden shadow-md"
                        >
                          <img
                            src={activity}
                            alt={`Activity ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.images_activities.map((image, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`Activity ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Team Section */}
          {portfolio.teams && portfolio.teams.length > 0 && (
            <div className="bg-gray-100 py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    {t("team.title")}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolio.teams.map((member: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-lg p-6 text-center"
                    >
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                        />
                      )}
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-gray-600">{member.mission}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          {portfolio.contact_info && (
            <div className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  {t("contact.title")}
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t("contact.info")}
                  </h3>
                  <div className="space-y-4">
                    {portfolio.contact_info.address && (
                      <div>
                        <strong>{t("contact.address")}:</strong>{" "}
                        {portfolio.contact_info.address}
                      </div>
                    )}
                    {portfolio.contact_info.working_hours && (
                      <div>
                        <strong>{t("contact.workingHours")}:</strong>{" "}
                        {portfolio.contact_info.working_hours}
                      </div>
                    )}
                    {portfolio.contact_info.phone_number && (
                      <div>
                        <strong>{t("contact.phone")}:</strong>{" "}
                        {portfolio.contact_info.phone_number}
                      </div>
                    )}
                    {portfolio.contact_info.email_address && (
                      <div>
                        <strong>{t("contact.email")}:</strong>{" "}
                        {portfolio.contact_info.email_address}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t("contact.social")}
                  </h3>
                  <div className="space-y-4">
                    {portfolio.contact_info.facebook && (
                      <div>
                        <strong>Facebook:</strong>{" "}
                        <a
                          href={portfolio.contact_info.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {portfolio.contact_info.facebook}
                        </a>
                      </div>
                    )}
                    {portfolio.contact_info.instagram && (
                      <div>
                        <strong>Instagram:</strong>{" "}
                        <a
                          href={portfolio.contact_info.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {portfolio.contact_info.instagram}
                        </a>
                      </div>
                    )}
                    {portfolio.contact_info.twitter && (
                      <div>
                        <strong>Twitter:</strong>{" "}
                        <a
                          href={portfolio.contact_info.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {portfolio.contact_info.twitter}
                        </a>
                      </div>
                    )}
                    {portfolio.contact_info.whatsapp && (
                      <div>
                        <strong>WhatsApp:</strong>{" "}
                        <a
                          href={`https://wa.me/${portfolio.contact_info.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {portfolio.contact_info.whatsapp}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advertisement Section */}
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
        </>
      ) : (
        <ProfileWaitingPage nurseryName={readableName} locale={locale} />
      )}
    </div>
  );
}
