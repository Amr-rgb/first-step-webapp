import Advertisment from "@/components/general/Advertisment";
import Branches from "@/components/general/nurseries/Branches";
import Header from "@/components/general/nurseries/Header";
import Programs from "@/components/general/nurseries/sections/Programs";
import ProfileWaitingPage from "@/components/general/nurseries/ProfileWaitingPage";
import { slugToReadableName } from "@/lib/utils";
import { AdSlide } from "@/types";
import { getTranslations } from "next-intl/server";

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

  const isWorldOfLearning =
    readableName === "World of Learning" ||
    name.toLowerCase().includes("world-of-learning") ||
    name.toLowerCase().includes("world-of-learning-junior");

  const isWorldOfLearningJunior = name
    .toLowerCase()
    .includes("world-of-learning-junior");

  // Check if nursery has profile configured
  // For now, only World of Learning nurseries have profiles configured
  // Other nurseries should show the waiting page
  const hasProfile = isWorldOfLearning;

  return (
    <div>
      {hasProfile ? (
        <>
          <Header
            name={readableName}
            slogan={isWorldOfLearning ? t("slogan") : undefined}
          />
          <Branches locale={locale} nurseryName={name} />

          {/* World of Learning custom sections */}
          {isWorldOfLearning && (
            <>
              {isWorldOfLearningJunior && (
                <Programs nurseryName={name} locale={locale} />
              )}

              {/* Contact/Owner Info Section */}
              <section className="mt-20 mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B12F53] mb-8">
                  {t("contact.title")}
                </h2>
                <div className="flex justify-center">
                  <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-2 max-w-md w-full mx-4">
                    <img
                      src="/assets/illustrations/contact.png"
                      alt={t("contact.title")}
                      className="mx-auto mb-4 w-16 h-16 object-contain"
                    />
                    <p className="font-bold text-lg text-[#22336C]">{t("contact.ownerName")}</p>
                    <p className="text-gray-700">{t("contact.ownerRole")}</p>
                    <p className="text-gray-700">{t("contact.nurseryName")}</p>
                    <p className="text-gray-700">{t("contact.mobile")}</p>
                    <p className="text-gray-700">{t("contact.phone")}</p>
                    <p className="text-gray-700">{t("contact.address")}</p>
                  </div>
                </div>
              </section>
            </>
          )}
          {/* <Advertisment slides={slides} /> */}
        </>
      ) : (
        <ProfileWaitingPage nurseryName={readableName} locale={locale} />
      )}
    </div>
  );
}
