import Advertisment from "@/components/general/Advertisment";
import Branches from "@/components/general/nurseries/Branches";
import Header from "@/components/general/nurseries/Header";
import Programs from "@/components/general/nurseries/sections/Programs";
import ProfileWaitingPage from "@/components/general/nurseries/ProfileWaitingPage";
import { slugToReadableName } from "@/lib/utils";
import { AdSlide } from "@/types";
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

  const slides: AdSlide[] = [
    {
      id: 1,
      title: "Nursery 1",
      image:
        "https://images.unsplash.com/photo-1578349035260-9f3d4042f1f7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      created_at: "",
      published_at: "",
    },
    {
      id: 2,
      title: "Nursery 2",
      image:
        "https://images.unsplash.com/photo-1586694680938-9682c9e1f736?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      created_at: "",
      published_at: "",
    },
    {
      id: 3,
      title: "Nursery 3",
      image:
        "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      created_at: "",
      published_at: "",
    },
  ];

  // Fetch portfolio data for this nursery
  const portfolioResponse = await nurseryService.getNurseryPortfolio(
    readableName,
    locale
  );
  const portfolio = portfolioResponse?.portofilo;

  // Check if nursery has a profile with portfolio data
  const hasProfile =
    portfolio &&
    ((portfolio.hero_section &&
      (portfolio.hero_section.title_of_hero ||
        portfolio.hero_section.subtitle_of_hero ||
        portfolio.hero_section.description ||
        portfolio.hero_section.background_image)) ||
      (portfolio.branches && portfolio.branches.length > 0) ||
      (portfolio.Philosophy_Methodology_Goal &&
        (portfolio.Philosophy_Methodology_Goal.philosophy ||
          portfolio.Philosophy_Methodology_Goal.methodology ||
          portfolio.Philosophy_Methodology_Goal.goals)) ||
      (portfolio.services && portfolio.services.length > 0) ||
      (portfolio.nursery_state &&
        (portfolio.nursery_state.area ||
          portfolio.nursery_state.class_rooms ||
          portfolio.nursery_state.team_members)) ||
      (portfolio.images_activities && portfolio.images_activities.length > 0) ||
      (portfolio.teams && portfolio.teams.length > 0) ||
      (portfolio.contact_info &&
        (portfolio.contact_info.address ||
          portfolio.contact_info.phone_number ||
          portfolio.contact_info.email_address ||
          portfolio.contact_info.working_hours ||
          portfolio.contact_info.facebook ||
          portfolio.contact_info.instagram ||
          portfolio.contact_info.whatsapp)));

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
            <Branches locale={locale} nurseryName={name} />
          )}

          {/* Philosophy, Methodology & Goals Section */}
          {portfolio.Philosophy_Methodology_Goal && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  {portfolio.Philosophy_Methodology_Goal.philosophy && (
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold text-center text-[#22336C] mb-8">
                        {portfolio.Philosophy_Methodology_Goal.philosophy
                          .title || t("philosophy.title")}
                      </h2>
                      <p className="text-lg text-gray-700 leading-relaxed text-center">
                        {
                          portfolio.Philosophy_Methodology_Goal.philosophy
                            .content
                        }
                      </p>
                    </div>
                  )}

                  {portfolio.Philosophy_Methodology_Goal.methodology && (
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold text-center text-[#22336C] mb-8">
                        {portfolio.Philosophy_Methodology_Goal.methodology
                          .title || t("methodology.title")}
                      </h2>
                      <p className="text-lg text-gray-700 leading-relaxed text-center">
                        {
                          portfolio.Philosophy_Methodology_Goal.methodology
                            .content
                        }
                      </p>
                    </div>
                  )}

                  {portfolio.Philosophy_Methodology_Goal.goals && (
                    <div>
                      <h2 className="text-3xl font-bold text-center text-[#22336C] mb-8">
                        {portfolio.Philosophy_Methodology_Goal.goals.title ||
                          t("goals.title")}
                      </h2>
                      <p className="text-lg text-gray-700 leading-relaxed text-center">
                        {portfolio.Philosophy_Methodology_Goal.goals.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Services Section */}
          {portfolio.services && portfolio.services.length > 0 && (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#22336C] mb-12">
                  {portfolio.service_section_title || t("services.title")}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolio.services.map((service: string, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-12 h-12 bg-[#B12F53] rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <h3 className="text-xl font-semibold text-[#22336C] mb-3">
                        {service}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Stats Section */}
          {portfolio.nursery_state && (
            <section className="py-16 bg-[#22336C] text-white">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {portfolio.nursery_state.area}
                    </div>
                    <div className="text-gray-300">{t("stats.area")}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {portfolio.nursery_state.class_rooms}
                    </div>
                    <div className="text-gray-300">{t("stats.classrooms")}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {portfolio.nursery_state.team_members}
                    </div>
                    <div className="text-gray-300">
                      {t("stats.teamMembers")}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Activities Section */}
          {portfolio.images_activities &&
            portfolio.images_activities.length > 0 && (
              <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center text-[#22336C] mb-4">
                    {portfolio.activity_section_title || t("activities.title")}
                  </h2>
                  {portfolio.activity_section_subtitle && (
                    <p className="text-lg text-gray-600 text-center mb-12">
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
              </section>
            )}

          {/* Team Section */}
          {portfolio.teams && portfolio.teams.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#22336C] mb-12">
                  {t("team.title")}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {portfolio.teams.map((member: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-md text-center"
                    >
                      {member.image && (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                      )}
                      <h3 className="text-xl font-semibold text-[#22336C] mb-2">
                        {member.name}
                      </h3>
                      <p className="text-gray-600">{member.position}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          {portfolio.contact_info && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#22336C] mb-12">
                  {t("contact.title")}
                </h2>
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6">
                    {portfolio.contact_info.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">📍</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.address")}
                          </h3>
                          <p className="text-gray-600">
                            {portfolio.contact_info.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {portfolio.contact_info.phone_number && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">📞</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.phone")}
                          </h3>
                          <p className="text-gray-600">
                            {portfolio.contact_info.phone_number}
                          </p>
                        </div>
                      </div>
                    )}

                    {portfolio.contact_info.email_address && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">✉️</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.email")}
                          </h3>
                          <p className="text-gray-600">
                            {portfolio.contact_info.email_address}
                          </p>
                        </div>
                      </div>
                    )}

                    {portfolio.contact_info.working_hours && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">🕒</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.workingHours")}
                          </h3>
                          <p className="text-gray-600">
                            {portfolio.contact_info.working_hours}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Social Media Links */}
                    {(portfolio.contact_info.facebook ||
                      portfolio.contact_info.instagram ||
                      portfolio.contact_info.whatsapp) && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">🌐</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.socialMedia")}
                          </h3>
                          <div className="flex gap-4">
                            {portfolio.contact_info.facebook && (
                              <a
                                href={portfolio.contact_info.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#B12F53] hover:text-[#22336C] transition-colors"
                              >
                                Facebook
                              </a>
                            )}
                            {portfolio.contact_info.instagram && (
                              <a
                                href={portfolio.contact_info.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#B12F53] hover:text-[#22336C] transition-colors"
                              >
                                Instagram
                              </a>
                            )}
                            {portfolio.contact_info.whatsapp && (
                              <a
                                href={portfolio.contact_info.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#B12F53] hover:text-[#22336C] transition-colors"
                              >
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <ProfileWaitingPage nurseryName={readableName} locale={locale} />
      )}
    </div>
  );
}
