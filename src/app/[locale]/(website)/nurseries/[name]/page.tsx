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

  // Fetch all nurseries to find the specific nursery
  const nurseries = await nurseryService.getNurseries(locale);
  const nursery = nurseries.find((n) => {
    const dbName = n.nursery_name.toLowerCase().trim();
    const searchName = readableName.toLowerCase().trim();
    return (
      dbName === searchName ||
      dbName.includes(searchName) ||
      searchName.includes(dbName)
    );
  });

  // Check if nursery exists and has basic information
  const hasProfile =
    nursery &&
    (nursery.name ||
      nursery.nursery_name ||
      (nursery.branches && nursery.branches.length > 0) ||
      nursery.services?.length > 0 ||
      nursery.phone ||
      nursery.email ||
      nursery.address);

  return (
    <div>
      {hasProfile ? (
        <>
          <Header
            name={nursery?.name || nursery?.nursery_name || readableName}
            slogan={nursery?.additional_service}
            description={nursery?.additional_service}
            backgroundImage={nursery?.logo}
          />

          {/* Branches Section */}
          {nursery?.branches && nursery.branches.length > 0 && (
            <Branches locale={locale} nurseryName={name} />
          )}

          {/* Services Section */}
          {nursery?.services && nursery.services.length > 0 && (
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#22336C] mb-12">
                  {t("services.title")}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {nursery.services.map((service, index) => (
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
          {nursery && (
            <section className="py-16 bg-[#22336C] text-white">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {nursery.branches?.length || 0}
                    </div>
                    <div className="text-gray-300">{t("stats.branches")}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {nursery.services?.length || 0}
                    </div>
                    <div className="text-gray-300">{t("stats.services")}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {nursery.accepted_ages?.length || 0}
                    </div>
                    <div className="text-gray-300">{t("stats.ageGroups")}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">
                      {nursery.nursery_type?.length || 0}
                    </div>
                    <div className="text-gray-300">{t("stats.types")}</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Contact Section */}
          {(nursery?.phone || nursery?.email || nursery?.address) && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-[#22336C] mb-12">
                  {t("contact.title")}
                </h2>
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6">
                    {nursery.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">📍</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.address")}
                          </h3>
                          <p className="text-gray-600">{nursery.address}</p>
                        </div>
                      </div>
                    )}

                    {nursery.phone && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">📞</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.phone")}
                          </h3>
                          <p className="text-gray-600">{nursery.phone}</p>
                        </div>
                      </div>
                    )}

                    {nursery.email && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">✉️</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.email")}
                          </h3>
                          <p className="text-gray-600">{nursery.email}</p>
                        </div>
                      </div>
                    )}

                    {nursery.work_hours_from && nursery.work_hours_to && (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 text-[#B12F53] mt-1">🕒</div>
                        <div>
                          <h3 className="font-semibold text-[#22336C] mb-1">
                            {t("contact.workingHours")}
                          </h3>
                          <p className="text-gray-600">
                            {nursery.work_hours_from} - {nursery.work_hours_to}
                          </p>
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
